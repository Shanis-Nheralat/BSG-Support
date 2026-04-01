import type { TranslationFn } from "./email-translations";

// ── Common HTML wrapper for all emails ──

function wrapEmailHtml(headerTitle: string, bodyHtml: string, footerText: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #062767; color: white; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px;">${headerTitle}</h1>
      </div>
      <div style="padding: 24px;">
        ${bodyHtml}
      </div>
      <div style="background: #f3f4f6; padding: 12px; text-align: center; font-size: 12px; color: #6b7280;">
        ${footerText} | <a href="https://backsureglobalsupport.com" style="color: #6b7280;">www.backsureglobalsupport.com</a>
      </div>
    </div>
  `;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ═══════════════════════════════════════════════
// ── ADMIN TEMPLATES (always English, no i18n) ──
// ═══════════════════════════════════════════════

export function getContactAdminNotification(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  formType: string;
}) {
  const subject = `New ${data.formType.replace(/_/g, " ")} from ${data.name}`;

  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Form Type:</strong> ${data.formType.replace(/_/g, " ")}</p>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ""}
    ${data.company ? `<p><strong>Company:</strong> ${escapeHtml(data.company)}</p>` : ""}
    <hr />
    <h3>Message:</h3>
    <p>${escapeHtml(data.message).replace(/\n/g, "<br />")}</p>
  `;

  const text = `New Contact Form Submission\nForm Type: ${data.formType.replace(/_/g, " ")}\nName: ${data.name}\nEmail: ${data.email}\n${data.phone ? `Phone: ${data.phone}\n` : ""}${data.company ? `Company: ${data.company}\n` : ""}\nMessage:\n${data.message}`;

  return { subject, html, text };
}

export function getCareersAdminNotification(data: {
  name: string;
  email: string;
  phone: string;
  position: string;
}) {
  const subject = `New Job Application: ${data.position} - ${data.name}`;

  const html = `
    <h2>New Job Application</h2>
    <p><strong>Position:</strong> ${escapeHtml(data.position)}</p>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
    <p><em>Resume attached or available in admin panel.</em></p>
  `;

  const text = `New Job Application\nPosition: ${data.position}\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\n\nResume attached or available in admin panel.`;

  return { subject, html, text };
}

export function getCalculatorAdminNotification(data: {
  fullName: string;
  companyEmail: string;
  companyName: string;
  mobileNumber?: string;
  selectedTeam: string;
  selectedRole: string;
  teamSize: number;
  primaryGoal: string;
  timeline: string;
  savings: number;
  efficiencyGain: number;
  hoursReclaimed: number;
  roi: number;
  currency: string;
}) {
  const savingsFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: data.currency || "USD",
    maximumFractionDigits: 0,
  }).format(data.savings);

  const subject = `High-Value Calculator Lead: ${data.companyName} - ${data.selectedTeam}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #062767; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">New Calculator Lead</h1>
      </div>
      <div style="padding: 20px; background: #f9fafb;">
        <h2 style="color: #062767; margin-top: 0;">Contact Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${escapeHtml(data.fullName)}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Company:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${escapeHtml(data.companyName)}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${escapeHtml(data.companyEmail)}">${escapeHtml(data.companyEmail)}</a></td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.mobileNumber || "Not provided"}</td></tr>
        </table>

        <h2 style="color: #062767; margin-top: 24px;">Analysis Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Team Type:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${escapeHtml(data.selectedTeam)}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Role Level:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${escapeHtml(data.selectedRole)}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Team Size:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.teamSize} people</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Primary Goal:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${escapeHtml(data.primaryGoal)}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Timeline:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${escapeHtml(data.timeline)}</td></tr>
        </table>

        <div style="background: #dcfce7; border: 1px solid #16a34a; border-radius: 8px; padding: 16px; margin-top: 24px; text-align: center;">
          <h3 style="color: #16a34a; margin: 0 0 8px 0;">Projected Annual Savings</h3>
          <div style="font-size: 32px; font-weight: bold; color: #16a34a;">${savingsFormatted}</div>
          <div style="color: #666; margin-top: 8px;">${data.efficiencyGain}% efficiency gain | ${data.hoursReclaimed} hours/week reclaimed | ${data.roi}% ROI</div>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="mailto:${escapeHtml(data.companyEmail)}?subject=Your BSG Efficiency Analysis Results" style="display: inline-block; background: #062767; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reply to Lead</a>
        </div>
      </div>
      <div style="background: #062767; color: white; padding: 12px; text-align: center; font-size: 12px;">
        Backsure Global Support - Team Efficiency Calculator Lead
      </div>
    </div>
  `;

  const text = `New Calculator Lead\n\nName: ${data.fullName}\nCompany: ${data.companyName}\nEmail: ${data.companyEmail}\nPhone: ${data.mobileNumber || "N/A"}\n\nTeam: ${data.selectedTeam}\nRole: ${data.selectedRole}\nSize: ${data.teamSize}\nGoal: ${data.primaryGoal}\nTimeline: ${data.timeline}\n\nSavings: ${savingsFormatted}\nEfficiency: ${data.efficiencyGain}%\nHours/wk: ${data.hoursReclaimed}\nROI: ${data.roi}%`;

  return { subject, html, text };
}

// ═══════════════════════════════════════════════════
// ── USER TEMPLATES (i18n via translation function) ──
// ═══════════════════════════════════════════════════

export function getContactUserConfirmation(
  data: { name: string; formType: string; meetingDate?: string; meetingTime?: string },
  t: TranslationFn,
) {
  const formTypeKey = data.formType === "meeting_request" ? "Meeting" : data.formType === "service_intake" ? "Intake" : "General";
  const subject = t(`Emails.contact.userSubject${formTypeKey}`);
  const headerTitle = t("Emails.contact.thankYouTitle");
  const footerText = t("Emails.common.footerText");

  const formTypeDisplay = data.formType === "meeting_request"
    ? t("Emails.contact.formTypeMeeting")
    : data.formType === "service_intake"
      ? t("Emails.contact.formTypeIntake")
      : t("Emails.contact.formTypeGeneral");

  let meetingDetail = "";
  if (data.formType === "meeting_request" && data.meetingDate) {
    const timeStr = data.meetingTime ? ` at ${data.meetingTime}` : "";
    meetingDetail = `<p>${t("Emails.contact.meetingDateNote", { date: data.meetingDate, time: timeStr })}</p>`;
  }

  const bodyHtml = `
    <p>${t("Emails.common.greeting", { name: escapeHtml(data.name) })}</p>
    <p>${t("Emails.contact.userBody", { formType: formTypeDisplay })}</p>
    ${meetingDetail}
    <p>${t("Emails.common.responseTime", { hours: "24" })}</p>
    <p>${t("Emails.common.reachOut")} <a href="mailto:info@backsureglobalsupport.com" style="color: #062767;">info@backsureglobalsupport.com</a>.</p>
    <p>${t("Emails.common.bestRegards")}<br>${t("Emails.common.bsgTeam")}</p>
  `;

  const html = wrapEmailHtml(headerTitle, bodyHtml, footerText);
  const text = `${t("Emails.common.greeting", { name: data.name })}\n\n${t("Emails.contact.userBody", { formType: formTypeDisplay })}\n\n${t("Emails.common.responseTime", { hours: "24" })}\n\n${t("Emails.common.bestRegards")}\n${t("Emails.common.bsgTeam")}`;

  return { subject, html, text };
}

export function getCareersUserConfirmation(
  data: { name: string; position: string },
  t: TranslationFn,
) {
  const subject = t("Emails.careers.userSubject", { position: data.position });
  const headerTitle = t("Emails.careers.headerTitle");
  const footerText = t("Emails.common.footerText");

  const bodyHtml = `
    <p>${t("Emails.common.greeting", { name: escapeHtml(data.name) })}</p>
    <p>${t("Emails.careers.userBody", { position: escapeHtml(data.position) })}</p>
    <p>${t("Emails.careers.reviewNote")}</p>
    <p>${t("Emails.common.reachOut")} <a href="mailto:info@backsureglobalsupport.com" style="color: #062767;">info@backsureglobalsupport.com</a>.</p>
    <p>${t("Emails.common.bestRegards")}<br>${t("Emails.common.bsgHrTeam")}</p>
  `;

  const html = wrapEmailHtml(headerTitle, bodyHtml, footerText);
  const text = `${t("Emails.common.greeting", { name: data.name })}\n\n${t("Emails.careers.userBody", { position: data.position })}\n\n${t("Emails.careers.reviewNote")}\n\n${t("Emails.common.bestRegards")}\n${t("Emails.common.bsgHrTeam")}`;

  return { subject, html, text };
}

export function getMeetingUserConfirmation(
  data: { name: string; date: string; time: string; localTime: string; timezone: string },
  t: TranslationFn,
) {
  const subject = t("Emails.meeting.userSubject");
  const headerTitle = t("Emails.meeting.headerTitle");
  const footerText = t("Emails.common.footerText");

  const bodyHtml = `
    <p>${t("Emails.common.greeting", { name: escapeHtml(data.name) })}</p>
    <p>${t("Emails.meeting.userBody")}</p>
    <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">${t("Emails.meeting.dateLabel")}</td>
          <td style="padding: 8px 0; font-weight: 600;">${escapeHtml(data.date)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">${t("Emails.meeting.timeUaeLabel")}</td>
          <td style="padding: 8px 0; font-weight: 600;">${escapeHtml(data.time)} GST</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">${t("Emails.meeting.localTimeLabel")}</td>
          <td style="padding: 8px 0; font-weight: 600;">${escapeHtml(data.localTime)} (${data.timezone.replace(/_/g, " ")})</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">${t("Emails.meeting.durationLabel")}</td>
          <td style="padding: 8px 0; font-weight: 600;">${t("Emails.meeting.duration")}</td>
        </tr>
      </table>
    </div>
    <p>${t("Emails.meeting.rescheduleNote", { email: '<a href="mailto:info@backsureglobalsupport.com" style="color: #062767;">info@backsureglobalsupport.com</a>', phone: '<a href="tel:+971524419445" style="color: #062767;">+971 52-441-9445</a>' })}</p>
    <p>${t("Emails.common.bestRegards")}<br>${t("Emails.common.bsgTeam")}</p>
  `;

  const html = wrapEmailHtml(headerTitle, bodyHtml, footerText);
  const text = `${t("Emails.common.greeting", { name: data.name })}\n\n${t("Emails.meeting.userBody")}\n\n${t("Emails.meeting.dateLabel")}: ${data.date}\n${t("Emails.meeting.timeUaeLabel")}: ${data.time} GST\n${t("Emails.meeting.localTimeLabel")}: ${data.localTime} (${data.timezone.replace(/_/g, " ")})\n${t("Emails.meeting.durationLabel")}: ${t("Emails.meeting.duration")}\n\n${t("Emails.meeting.rescheduleNote", { email: "info@backsureglobalsupport.com", phone: "+971 52-441-9445" })}\n\n${t("Emails.common.bestRegards")}\n${t("Emails.common.bsgTeam")}`;

  return { subject, html, text };
}

// ── Rich Calculator User Confirmation Email ──

interface CalculatorEmailData {
  fullName: string;
  companyName: string;
  selectedTeam: string;
  selectedCountry: string;
  teamSize: number;
  currency: string;
  primaryGoal: string;
  timeline: string;
  currentCost: number;
  bsgCost: number;
  savings: number;
  efficiencyGain: number;
  hoursReclaimed: number;
  roi: number;
  diagnosticFindings?: Array<{
    question: string;
    answer: string;
    impactScore: number;
    timeWasteMinutes: number;
  }>;
  roadmapPhases?: Array<{
    number: number;
    monthRange: string;
    name: string;
    accruedSavings: number;
  }>;
}

function formatCurrencyEmail(amount: number, currency: string, locale: string): string {
  try {
    return new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString()}`;
  }
}

export function getCalculatorUserConfirmation(
  data: CalculatorEmailData,
  t: TranslationFn,
  locale: string,
) {
  const subject = t("Emails.calculator.userSubject");
  const headerTitle = t("Emails.calculator.headerTitle");
  const footerText = t("Emails.common.footerText");

  const currentCostFmt = formatCurrencyEmail(data.currentCost, data.currency, locale);
  const bsgCostFmt = formatCurrencyEmail(data.bsgCost, data.currency, locale);
  const savingsFmt = formatCurrencyEmail(data.savings, data.currency, locale);

  // Diagnostic findings (top 3)
  let diagnosticHtml = "";
  if (data.diagnosticFindings && data.diagnosticFindings.length > 0) {
    const top3 = data.diagnosticFindings
      .sort((a, b) => b.impactScore - a.impactScore)
      .slice(0, 3);
    diagnosticHtml = `
      <div style="margin-top: 24px;">
        <h3 style="color: #062767; margin-bottom: 12px;">${t("Emails.calculator.diagnosticTitle")}</h3>
        ${top3.map((f) => {
          const isHigh = f.impactScore >= 80;
          const bg = isHigh ? "#fef2f2" : "#fffbeb";
          const border = isHigh ? "#fecaca" : "#fde68a";
          const color = isHigh ? "#dc2626" : "#92400e";
          const label = isHigh ? t("Emails.calculator.highImpact") : t("Emails.calculator.medImpact");
          return `
            <div style="background: ${bg}; border: 1px solid ${border}; border-radius: 8px; padding: 12px; margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 600; color: ${color}; font-size: 11px;">${label}</span>
                <span style="color: ${color}; font-size: 12px;">${f.timeWasteMinutes} ${t("Emails.calculator.minutesPerWeek")}</span>
              </div>
              <p style="margin: 4px 0 0; font-size: 13px; color: #374151;">${escapeHtml(f.answer)}</p>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  // Implementation roadmap
  let roadmapHtml = "";
  if (data.roadmapPhases && data.roadmapPhases.length > 0) {
    roadmapHtml = `
      <div style="margin-top: 24px;">
        <h3 style="color: #062767; margin-bottom: 12px;">${t("Emails.calculator.roadmapTitle")}</h3>
        ${data.roadmapPhases.map((phase) => {
          const phaseAmount = formatCurrencyEmail(phase.accruedSavings, data.currency, locale);
          return `
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin-bottom: 8px;">
              <div style="font-weight: 600; color: #062767; font-size: 13px;">${t("Emails.calculator.phaseLabel", { number: phase.number })} — ${phase.monthRange}</div>
              <div style="font-size: 13px; color: #374151; margin-top: 4px;">${escapeHtml(phase.name)}</div>
              <div style="font-size: 12px; color: #16a34a; margin-top: 2px;">${t("Emails.calculator.savingsBy", { amount: phaseAmount })}</div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  const bodyHtml = `
    <p>${t("Emails.common.greeting", { name: escapeHtml(data.fullName) })}</p>
    <p>${t("Emails.calculator.introBody", { team: escapeHtml(data.selectedTeam) })}</p>

    <!-- Summary strip -->
    <div style="background: #f0f4ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr>
          <td style="padding: 4px 8px; color: #6b7280;">${t("Emails.calculator.teamLabel")}</td>
          <td style="padding: 4px 8px; font-weight: 600;">${escapeHtml(data.selectedTeam)}</td>
          <td style="padding: 4px 8px; color: #6b7280;">${t("Emails.calculator.teamSizeLabel")}</td>
          <td style="padding: 4px 8px; font-weight: 600;">${data.teamSize}</td>
        </tr>
        <tr>
          <td style="padding: 4px 8px; color: #6b7280;">${t("Emails.calculator.goalLabel")}</td>
          <td style="padding: 4px 8px; font-weight: 600;">${escapeHtml(data.primaryGoal)}</td>
          <td style="padding: 4px 8px; color: #6b7280;">${t("Emails.calculator.timelineLabel")}</td>
          <td style="padding: 4px 8px; font-weight: 600;">${escapeHtml(data.timeline)}</td>
        </tr>
      </table>
    </div>

    <!-- Financial Impact -->
    <h3 style="color: #062767; margin-bottom: 12px;">${t("Emails.calculator.financialTitle")}</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">${t("Emails.calculator.currentCostLabel")}</td>
        <td style="padding: 10px 0; font-weight: 600; text-align: right;">${currentCostFmt}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">${t("Emails.calculator.bsgCostLabel")}</td>
        <td style="padding: 10px 0; font-weight: 600; text-align: right;">${bsgCostFmt}</td>
      </tr>
    </table>

    <!-- Savings highlight box -->
    <div style="background: #dcfce7; border: 1px solid #16a34a; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 16px;">
      <div style="font-size: 12px; color: #16a34a; text-transform: uppercase; font-weight: 600;">${t("Emails.calculator.annualSavingsLabel")}</div>
      <div style="font-size: 32px; font-weight: bold; color: #16a34a; margin: 8px 0;">${savingsFmt}</div>
      <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
        <tr>
          <td style="text-align: center; padding: 4px;">
            <div style="font-size: 18px; font-weight: 700; color: #062767;">${data.roi}%</div>
            <div style="font-size: 11px; color: #6b7280;">${t("Emails.calculator.roiLabel")}</div>
          </td>
          <td style="text-align: center; padding: 4px;">
            <div style="font-size: 18px; font-weight: 700; color: #062767;">${data.efficiencyGain}%</div>
            <div style="font-size: 11px; color: #6b7280;">${t("Emails.calculator.efficiencyLabel")}</div>
          </td>
          <td style="text-align: center; padding: 4px;">
            <div style="font-size: 18px; font-weight: 700; color: #062767;">${data.hoursReclaimed}</div>
            <div style="font-size: 11px; color: #6b7280;">${t("Emails.calculator.hoursLabel")}</div>
          </td>
        </tr>
      </table>
    </div>

    ${diagnosticHtml}
    ${roadmapHtml}

    <!-- PDF note -->
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
      <p style="margin: 0; font-weight: 600; color: #062767;">${t("Emails.calculator.pdfAttached")}</p>
    </div>

    <p>${t("Emails.calculator.ctaText")}</p>

    <div style="text-align: center; margin: 24px 0;">
      <a href="https://backsureglobalsupport.com/contact" style="display: inline-block; background: #062767; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">${t("Emails.calculator.ctaButton")}</a>
    </div>

    <p>${t("Emails.common.bestRegards")}<br>${t("Emails.common.bsgTeam")}</p>
  `;

  const html = wrapEmailHtml(headerTitle, bodyHtml, footerText);
  const text = `${t("Emails.common.greeting", { name: data.fullName })}\n\n${t("Emails.calculator.introBody", { team: data.selectedTeam })}\n\n${t("Emails.calculator.financialTitle")}\n${t("Emails.calculator.currentCostLabel")}: ${currentCostFmt}\n${t("Emails.calculator.bsgCostLabel")}: ${bsgCostFmt}\n${t("Emails.calculator.annualSavingsLabel")}: ${savingsFmt}\n${t("Emails.calculator.roiLabel")}: ${data.roi}%\n${t("Emails.calculator.efficiencyLabel")}: ${data.efficiencyGain}%\n${t("Emails.calculator.hoursLabel")}: ${data.hoursReclaimed}\n\n${t("Emails.calculator.pdfAttached")}\n\n${t("Emails.calculator.ctaText")}\n\n${t("Emails.common.bestRegards")}\n${t("Emails.common.bsgTeam")}`;

  return { subject, html, text };
}
