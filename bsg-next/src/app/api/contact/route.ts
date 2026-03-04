import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, getContactNotificationEmail } from "@/lib/email";
import { notifyNewInquiry } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      message,
      form_type,
      // Meeting specific fields
      meeting_date,
      meeting_time,
      timezone,
      // Intake specific fields
      service_type,
      business_industry,
      implementation_timeline,
      requirements,
      additional_comments,
      services,
    } = body;

    // Validate required fields
    if (!name || !email || !message || !form_type) {
      return NextResponse.json(
        { error: "Name, email, message, and form type are required" },
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

    // Validate form type
    const validFormTypes = ["general_inquiry", "meeting_request", "service_intake"];
    if (!validFormTypes.includes(form_type)) {
      return NextResponse.json(
        { error: "Invalid form type" },
        { status: 400 }
      );
    }

    // Create inquiry in database
    const inquiry = await prisma.inquiries.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        message,
        form_type,
        status: "New",
        submitted_at: new Date(),
        // Meeting fields
        meeting_date: meeting_date ? new Date(meeting_date) : null,
        meeting_time: meeting_time || null,
        timezone: timezone || null,
        // Intake fields
        service_type: service_type || null,
        business_industry: business_industry || null,
        implementation_timeline: implementation_timeline || null,
        requirements: requirements || null,
        additional_comments: additional_comments || null,
        services: services || null,
      },
    });

    // Create admin notification
    await notifyNewInquiry(name, form_type, inquiry.id);

    // Send notification email to admin
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_FROM;
    if (adminEmail) {
      const emailContent = getContactNotificationEmail({
        name,
        email,
        phone,
        company,
        message,
        formType: form_type,
      });

      await sendEmail({
        to: adminEmail,
        ...emailContent,
        replyTo: email,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully. We will get back to you soon.",
        id: inquiry.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to submit form. Please try again later." },
      { status: 500 }
    );
  }
}
