import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { createNotification } from "@/lib/notifications";

interface CostBreakdown {
  fullSalary: number;
  visaCosts: number;
  insurance: number;
  training: number;
  equipment: number;
  officeSpace: number;
  leaveSalary: number;
  annualFlight: number;
  eosGratuity: number;
  otherCosts: number;
  totalOverheads: number;
  trueCost: number;
}

interface KeyIssue {
  area: string;
  impact: string;
}

interface CalculatorLeadData {
  // Contact info
  fullName: string;
  companyEmail: string;
  companyName: string;
  mobileNumber: string;
  // Team selection
  selectedTeam: string;
  selectedRole: string;
  teamSize: number;
  teamMaturity: string;
  currency: string;
  // Financial results
  currentCost: number;
  bsgCost: number;
  savings: number;
  efficiencyGain: number;
  hoursReclaimed: number;
  roi: number;
  // Cost breakdown (per employee)
  costBreakdown?: CostBreakdown;
  // Diagnostic details
  diagnosticScore?: number;
  diagnosticAnswers?: Record<number, number>;
  keyIssues?: KeyIssue[];
  timeWasteHours?: number;
  // Goals & preferences
  primaryGoal: string;
  targetEfficiency: string;
  timeline: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CalculatorLeadData = await request.json();

    // Validate required fields
    if (!body.fullName || !body.companyEmail || !body.companyName) {
      return NextResponse.json(
        { error: "Missing required contact information" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.companyEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check for free email providers
    const freeEmailDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "live.com", "icloud.com", "mail.com"];
    const emailDomain = body.companyEmail.split("@")[1]?.toLowerCase();
    if (freeEmailDomains.includes(emailDomain)) {
      return NextResponse.json(
        { error: "Please use a company email address" },
        { status: 400 }
      );
    }

    // Create inquiry in database
    const inquiry = await prisma.inquiries.create({
      data: {
        name: body.fullName,
        email: body.companyEmail,
        phone: body.mobileNumber || null,
        company: body.companyName,
        form_type: "service_intake",
        status: "New",
        message: `[Calculator Lead] ${body.selectedTeam} Team Analysis - ${body.teamSize} employees`,
        service_type: body.selectedTeam,
        business_industry: body.primaryGoal,
        implementation_timeline: body.timeline,
        requirements: JSON.stringify({
          // Team details
          teamSize: body.teamSize,
          teamMaturity: body.teamMaturity,
          role: body.selectedRole,
          currency: body.currency,
          // Financial summary
          currentCost: body.currentCost,
          bsgCost: body.bsgCost,
          savings: body.savings,
          efficiencyGain: body.efficiencyGain,
          hoursReclaimed: body.hoursReclaimed,
          roi: body.roi,
          targetEfficiency: body.targetEfficiency,
          // Cost breakdown (per employee)
          costBreakdown: body.costBreakdown,
          // Diagnostic details
          diagnosticScore: body.diagnosticScore,
          diagnosticAnswers: body.diagnosticAnswers,
          keyIssues: body.keyIssues,
          timeWasteHours: body.timeWasteHours,
        }),
        submitted_at: new Date(),
      },
    });

    // Create admin notification
    await createNotification({
      type: "success",
      title: "New Calculator Lead",
      message: `${body.fullName} from ${body.companyName} completed ${body.selectedTeam} analysis`,
      link: `/admin/inquiries/${inquiry.id}`,
    });

    // Send notification email to sales team
    const salesEmail = process.env.SALES_EMAIL || process.env.ADMIN_EMAIL || process.env.SMTP_FROM;
    if (salesEmail) {
      const savingsFormatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: body.currency || "USD",
        maximumFractionDigits: 0,
      }).format(body.savings);

      await sendEmail({
        to: salesEmail,
        subject: `🎯 High-Value Calculator Lead: ${body.companyName} - ${body.selectedTeam}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #062767; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">New Calculator Lead</h1>
            </div>
            <div style="padding: 20px; background: #f9fafb;">
              <h2 style="color: #062767; margin-top: 0;">Contact Information</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${body.fullName}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Company:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${body.companyName}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${body.companyEmail}">${body.companyEmail}</a></td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${body.mobileNumber || "Not provided"}</td></tr>
              </table>
              
              <h2 style="color: #062767; margin-top: 24px;">Analysis Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Team Type:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${body.selectedTeam}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Role Level:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${body.selectedRole}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Team Size:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${body.teamSize} people</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Primary Goal:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${body.primaryGoal}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Timeline:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${body.timeline}</td></tr>
              </table>
              
              <div style="background: #dcfce7; border: 1px solid #16a34a; border-radius: 8px; padding: 16px; margin-top: 24px; text-align: center;">
                <h3 style="color: #16a34a; margin: 0 0 8px 0;">Projected Annual Savings</h3>
                <div style="font-size: 32px; font-weight: bold; color: #16a34a;">${savingsFormatted}</div>
                <div style="color: #666; margin-top: 8px;">${body.efficiencyGain}% efficiency gain | ${body.hoursReclaimed} hours/week reclaimed | ${body.roi}% ROI</div>
              </div>
              
              <div style="text-align: center; margin-top: 24px;">
                <a href="mailto:${body.companyEmail}?subject=Your BSG Efficiency Analysis Results" style="display: inline-block; background: #062767; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reply to Lead</a>
              </div>
            </div>
            <div style="background: #062767; color: white; padding: 12px; text-align: center; font-size: 12px;">
              Backsure Global Support - Team Efficiency Calculator Lead
            </div>
          </div>
        `,
        replyTo: body.companyEmail,
      });
    }

    // Send confirmation email to the lead
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #062767; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Thank You for Your Interest</h1>
        </div>
        <div style="padding: 20px;">
          <p>Dear ${body.fullName},</p>
          <p>Thank you for using our Team Efficiency Calculator. We've received your analysis request and our team will be in touch within 24 hours to discuss how BSG can help optimize your ${body.selectedTeam.toLowerCase()} operations.</p>
          <p>Your analysis showed potential savings of <strong>${new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: body.currency || "USD",
            maximumFractionDigits: 0,
          }).format(body.savings)}</strong> annually with a <strong>${body.efficiencyGain}%</strong> efficiency improvement.</p>
          <p>In the meantime, feel free to reach out to us directly at <a href="mailto:info@backsureglobalsupport.com">info@backsureglobalsupport.com</a>.</p>
          <p>Best regards,<br>The BSG Team</p>
        </div>
        <div style="background: #f3f4f6; padding: 12px; text-align: center; font-size: 12px; color: #6b7280;">
          Backsure Global Support | Dubai, UAE | <a href="https://backsureglobalsupport.com">www.backsureglobalsupport.com</a>
        </div>
      </div>
    `;

    await sendEmail({
      to: body.companyEmail,
      subject: "Your BSG Team Efficiency Analysis Results",
      html: confirmationHtml,
    });

    return NextResponse.json({
      success: true,
      message: "Your results have been saved and our team will contact you shortly.",
      inquiryId: inquiry.id,
    });
  } catch (error) {
    console.error("Calculator lead submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit. Please try again or contact us directly." },
      { status: 500 }
    );
  }
}
