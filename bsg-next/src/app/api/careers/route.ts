import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, getApplicationNotificationEmail } from "@/lib/email";
import { notifyNewCandidate } from "@/lib/notifications";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const position = formData.get("position") as string;
    const resume = formData.get("resume") as File | null;
    const jobIdStr = formData.get("job_id") as string | null;
    const jobId = jobIdStr ? parseInt(jobIdStr) : null;

    // Validate required fields
    if (!name || !email || !phone || !position) {
      return NextResponse.json(
        { error: "Name, email, phone, and position are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate resume if provided
    let resumePath = "";
    if (resume && resume.size > 0) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      
      if (!allowedTypes.includes(resume.type)) {
        return NextResponse.json(
          { error: "Resume must be a PDF or Word document" },
          { status: 400 }
        );
      }

      // Validate file size (5MB max)
      if (resume.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Resume must be smaller than 5MB" },
          { status: 400 }
        );
      }

      // Generate unique filename
      const timestamp = Date.now();
      const safeFileName = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const ext = resume.name.split(".").pop();
      const fileName = `${safeFileName}-${timestamp}.${ext}`;

      // Ensure uploads directory exists
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "resumes");
      await mkdir(uploadsDir, { recursive: true });

      // Save file
      const bytes = await resume.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = path.join(uploadsDir, fileName);
      await writeFile(filePath, buffer);

      resumePath = fileName;
    }

    // Create candidate in database
    const candidate = await prisma.candidates.create({
      data: {
        name,
        email,
        phone,
        position,
        job_id: jobId,
        resume_path: resumePath,
        status: "New",
        submitted_at: new Date(),
      },
    });

    // Increment applications count on job if linked
    if (jobId) {
      await prisma.job_postings.update({
        where: { id: jobId },
        data: { applications: { increment: 1 } },
      });
    }

    // Create admin notification
    await notifyNewCandidate(name, position, candidate.id);

    // Send notification email to HR
    const hrEmail = process.env.HR_EMAIL || process.env.ADMIN_EMAIL || process.env.SMTP_FROM;
    if (hrEmail) {
      const emailContent = getApplicationNotificationEmail({
        name,
        email,
        phone,
        position,
      });

      await sendEmail({
        to: hrEmail,
        ...emailContent,
        replyTo: email,
      });
    }

    // Send confirmation email to applicant
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #062767; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px;">Application Received</h1>
        </div>
        <div style="padding: 24px;">
          <p>Dear ${name},</p>
          <p>Thank you for applying for the <strong>${position}</strong> position at Backsure Global Support. We have received your application and our HR team will review it carefully.</p>
          <p>If your profile matches our requirements, we will reach out to schedule the next steps. Please allow our team a few business days to review all applications.</p>
          <p>In the meantime, feel free to reach out to us at <a href="mailto:info@backsureglobalsupport.com">info@backsureglobalsupport.com</a> if you have any questions.</p>
          <p>Best regards,<br>The BSG HR Team</p>
        </div>
        <div style="background: #f3f4f6; padding: 12px; text-align: center; font-size: 12px; color: #6b7280;">
          Backsure Global Support | Dubai, UAE | <a href="https://backsureglobalsupport.com">www.backsureglobalsupport.com</a>
        </div>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: `Application received - ${position} at BSG Support`,
      html: confirmationHtml,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your application has been submitted successfully. We will review it and get back to you.",
        id: candidate.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Career application error:", error);
    return NextResponse.json(
      { error: "Failed to submit application. Please try again later." },
      { status: 500 }
    );
  }
}
