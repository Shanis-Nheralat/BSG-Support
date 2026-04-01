import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { notifyNewCandidate } from "@/lib/notifications";
import { resolveLocale, loadEmailTranslations } from "@/lib/email-translations";
import { getCareersAdminNotification, getCareersUserConfirmation } from "@/lib/email-templates";
import { uploadFile } from "@/lib/upload";

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
    const bodyLocale = formData.get("locale") as string | null;

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

    // Resolve locale for user-facing emails
    const locale = resolveLocale(bodyLocale || undefined, request.cookies.get("NEXT_LOCALE")?.value);

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

      // Upload file (Vercel Blob in production, local filesystem in dev)
      resumePath = await uploadFile(resume, `resumes/${fileName}`);
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

    // Send notification email to HR (always English)
    const hrEmail = process.env.HR_EMAIL || process.env.ADMIN_EMAIL || process.env.SMTP_FROM;
    if (hrEmail) {
      const adminContent = getCareersAdminNotification({
        name,
        email,
        phone,
        position,
      });

      await sendEmail({
        to: hrEmail,
        ...adminContent,
        replyTo: email,
      });
    }

    // Send confirmation email to applicant (in user's language)
    const t = await loadEmailTranslations(locale);
    const userContent = getCareersUserConfirmation({ name, position }, t);

    await sendEmail({
      to: email,
      ...userContent,
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
