import React from "react";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { createNotification } from "@/lib/notifications";
import { resolveLocale, loadEmailTranslations } from "@/lib/email-translations";
import { getCalculatorAdminNotification, getCalculatorUserConfirmation } from "@/lib/email-templates";
import { teams } from "@/lib/calculator/constants";
import { calculateTaskHandover, calculateRoadmap, calculateGoalKPIs, formatCurrency } from "@/lib/calculator/calculations";
import type { CalculationResults, FormDataState, CurrencyCode, GoalType, MaturityLevel, TimelineOption, CountryCode, RoleLevelId } from "@/lib/calculator/types";

interface CostBreakdownItem {
  label: string;
  value: number;
  icon?: string;
  type?: string;
}

interface DiagnosticFinding {
  question: string;
  answer: string;
  impactScore: number;
  timeWasteMinutes: number;
  weight: number;
  area: string;
  questionIndex: number;
  answerIndex: number;
}

interface KeyIssue {
  area: string;
  impact: string;
}

interface CalculatorLeadData {
  // i18n & PDF generation
  locale?: string;
  teamId?: string;
  roleId?: RoleLevelId;
  calculationResults?: CalculationResults;
  // Contact info
  fullName: string;
  companyEmail: string;
  companyName: string;
  mobileNumber: string;
  // Country & team
  selectedCountry: string;
  selectedTeam: string;
  selectedRole: string;
  teamSize: number;
  teamMaturity: string;
  currency: string;
  // Financial results
  fullSalary?: number;
  currentCost: number;
  bsgCost: number;
  savings: number;
  efficiencyGain: number;
  hoursReclaimed: number;
  roi: number;
  overheadRatio?: number;
  // Cost breakdown (per employee — map-based)
  costBreakdown?: Record<string, CostBreakdownItem>;
  // Diagnostic details
  diagnosticScore?: number;
  diagnosticFindings?: DiagnosticFinding[];
  keyIssues?: KeyIssue[];
  timeWasteHours?: number;
  // Task allocations
  taskAllocations?: Record<string, number>;
  // Goals & preferences
  primaryGoal: string;
  targetEfficiency: string;
  timeline: string;
}

/**
 * Build PDFTranslations from the server-side translation function.
 * Mirrors the 50+ keys that CalculatorResults.tsx passes to CalculatorResultsPDF.
 */
function buildPdfTranslations(
  t: (key: string, params?: Record<string, string | number>) => string,
  body: CalculatorLeadData,
  calcResults: CalculationResults,
  locale: string,
) {
  const c = body.currency as CurrencyCode;
  const selectedTeam = teams.find((team) => team.id === body.teamId);
  const taskHandover = calculateTaskHandover(selectedTeam, calcResults.diagnosticResults);
  const roadmap = calculateRoadmap(body.teamMaturity as MaturityLevel, body.timeline as TimelineOption, calcResults.results.realSavings);
  const goalKPIs = calculateGoalKPIs(body.primaryGoal as GoalType, calcResults, c);
  const { results: r, withBSG, employeeCost } = calcResults;

  return {
    analysis: t("Calculator.pdfAnalysis"),
    keyMetrics: t("Calculator.pdfKeyMetrics"),
    bsgRecommends: t("Calculator.pdfBsgRecommends", {
      narrative: t(`Calculator.goals.${body.primaryGoal}.leadNarrative`),
      size: body.teamSize,
      team: selectedTeam ? t(`Calculator.teams.${selectedTeam.id}.name`) : body.selectedTeam,
    }),
    currentEfficiency: t("Calculator.pdfCurrentEfficiency", {
      pct: Math.round(calcResults.currentSituation.currentEfficiency),
      cost: formatCurrency(calcResults.currentSituation.teamCost, c),
    }),
    withBsg: t("Calculator.pdfWithBsg", {
      pct: Math.round(withBSG.bsgEfficiency),
      cost: formatCurrency(withBSG.bsgTotalCost, c),
    }),
    saving: r.isPositiveSavings ? t("Calculator.pdfSaving", { amount: formatCurrency(r.realSavings, c) }) : "",
    diagnosticFindings: t("Calculator.diagnosticFindings"),
    high: t("Calculator.impactHigh"),
    med: t("Calculator.impactMedium"),
    ok: t("Calculator.impactOk"),
    minPerWeek: t("Calculator.minPerWeek"),
    taskHandoverMap: t("Calculator.taskHandoverMap"),
    bsgAbsorbs: t("Calculator.bsgAbsorbs", { pct: taskHandover.bsgTotalPct, hours: taskHandover.bsgHoursPerWeek }),
    clientRetains: t("Calculator.clientRetains", { pct: taskHandover.clientTotalPct, hours: taskHandover.clientHoursPerWeek }),
    financialImpact: t("Calculator.pdfFinancialImpact"),
    financialSummary: t("Calculator.pdfFinancialSummary"),
    annualSavings: t("Calculator.annualSavingsLabel"),
    qualityInvestment: t("Calculator.qualityInvestment"),
    range: t("Calculator.pdfRange", { min: formatCurrency(r.savingsRange.min, c), max: formatCurrency(r.savingsRange.max, c) }),
    bsgInvestment: t("Calculator.bsgInvestment"),
    perEmployee: t("Calculator.pdfPerEmployee", { amount: formatCurrency(withBSG.bsgCostPerEmployee, c) }),
    investment: t("Calculator.investmentLabel"),
    savings: t("Calculator.savingsLabel"),
    uplift: t("Calculator.upliftLabel"),
    roi: t("Calculator.roiLabel"),
    efficiency: t("Calculator.efficiencyLabel"),
    costBreakdown: t("Calculator.perEmployeeCostBreakdown", { country: t(`Calculator.countries.${body.selectedCountry}.name`) }),
    baseSalary: t("Calculator.baseSalary"),
    trueCostPerEmployee: t("Calculator.trueCostPerEmployee"),
    metric: t("Calculator.pdfMetric"),
    current: t("Calculator.pdfCurrent"),
    withBSG: t("Calculator.pdfWithBSG"),
    change: t("Calculator.pdfChange"),
    annualCost: t("Calculator.pdfAnnualCost"),
    hoursWasted: t("Calculator.pdfHoursWasted"),
    implementationRoadmap: t("Calculator.pdfImplementationRoadmap", { maturity: t(`Calculator.maturity.${body.teamMaturity}.label`) }),
    savingsLabel: t("Calculator.pdfSavingsLabel", { amount: "{amount}" }),
    methodology: t("Calculator.pdfMethodology"),
    bsgRateNote: t("Calculator.pdfBsgRateNote", { rate: Math.round(calcResults.bsgRateUsed * 100) }),
    inefficiencyCapped: t("Calculator.pdfInefficiencyCapped", { level: body.teamMaturity, label: t(`Calculator.maturity.${body.teamMaturity}.label`) }),
    savingsRangeNote: t("Calculator.pdfSavingsRangeNote", { currency: t(`Calculator.currencies.${c}.name`) }),
    disclaimer: t("Calculator.pdfDisclaimer"),
    reportGenerated: t("Calculator.pdfReportGenerated", {
      date: new Date().toLocaleDateString(locale === "de" ? "de-DE" : "en-US", { year: "numeric", month: "long", day: "numeric" }),
    }),
    // Config-translated props
    teamName: selectedTeam ? t(`Calculator.teams.${selectedTeam.id}.name`) : body.selectedTeam,
    goalLabel: t(`Calculator.goals.${body.primaryGoal}.label`),
    countryName: t(`Calculator.countries.${body.selectedCountry}.name`),
    currencyName: t(`Calculator.currencies.${c}.name`),
    staffLabel: t("Calculator.staff"),
    kpiLabels: goalKPIs.map((_, i) => t(`Calculator.goals.${body.primaryGoal}.kpi${i + 1}Label`)),
    findingTexts: calcResults.diagnosticResults.findings.slice(0, 5).map((f) => ({
      area: selectedTeam ? t(`Calculator.teams.${selectedTeam.id}.name`) : f.area,
      answer: selectedTeam ? t(`Calculator.teams.${selectedTeam.id}.questions.${f.questionIndex}.options.${f.answerIndex}`) : f.answer,
    })),
    bsgTaskNames: taskHandover.bsgTasks.slice(0, 5).map((item) => selectedTeam ? t(`Calculator.teams.${selectedTeam.id}.tasks.${item.taskId}`) : item.name),
    clientTaskNames: taskHandover.clientTasks.slice(0, 5).map((item) => selectedTeam ? t(`Calculator.teams.${selectedTeam.id}.tasks.${item.taskId}`) : item.name),
    costCategoryLabels: Object.fromEntries(Object.keys(employeeCost.costBreakdown).map((key) => [key, t(`Calculator.countries.${body.selectedCountry}.costCategories.${key}.label`)])),
    phaseNames: roadmap.map((phase) => t(`Calculator.maturity.${body.teamMaturity}.phase${phase.number}`)),
    maturityDescription: t(`Calculator.maturity.${body.teamMaturity}.description`),
    countryMethodologyNote: t(`Calculator.countries.${body.selectedCountry}.methodologyNote`),
    efficiencyRow: t("Calculator.efficiencyLabel"),
  };
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

    // Validate required calculation fields
    if (
      !body.selectedTeam || !body.selectedCountry || !body.primaryGoal ||
      !body.timeline || !body.currency ||
      typeof body.teamSize !== "number" || body.teamSize < 1 ||
      typeof body.currentCost !== "number" ||
      typeof body.bsgCost !== "number" ||
      typeof body.savings !== "number" ||
      typeof body.efficiencyGain !== "number" ||
      typeof body.hoursReclaimed !== "number" ||
      typeof body.roi !== "number"
    ) {
      return NextResponse.json(
        { error: "Missing or invalid calculation results" },
        { status: 400 }
      );
    }

    // Resolve locale for user-facing emails
    const locale = resolveLocale(body.locale, request.cookies.get("NEXT_LOCALE")?.value);

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
          country: body.selectedCountry,
          teamSize: body.teamSize,
          teamMaturity: body.teamMaturity,
          role: body.selectedRole,
          currency: body.currency,
          fullSalary: body.fullSalary,
          currentCost: body.currentCost,
          bsgCost: body.bsgCost,
          savings: body.savings,
          efficiencyGain: body.efficiencyGain,
          hoursReclaimed: body.hoursReclaimed,
          roi: body.roi,
          overheadRatio: body.overheadRatio,
          targetEfficiency: body.targetEfficiency,
          costBreakdown: body.costBreakdown,
          diagnosticScore: body.diagnosticScore,
          diagnosticFindings: body.diagnosticFindings,
          keyIssues: body.keyIssues,
          timeWasteHours: body.timeWasteHours,
          taskAllocations: body.taskAllocations,
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

    // Send notification email to sales team (always English)
    const salesEmail = process.env.SALES_EMAIL || process.env.ADMIN_EMAIL || process.env.SMTP_FROM;
    if (salesEmail) {
      const adminContent = getCalculatorAdminNotification({
        fullName: body.fullName,
        companyEmail: body.companyEmail,
        companyName: body.companyName,
        mobileNumber: body.mobileNumber,
        selectedTeam: body.selectedTeam,
        selectedRole: body.selectedRole,
        teamSize: body.teamSize,
        primaryGoal: body.primaryGoal,
        timeline: body.timeline,
        savings: body.savings,
        efficiencyGain: body.efficiencyGain,
        hoursReclaimed: body.hoursReclaimed,
        roi: body.roi,
        currency: body.currency,
      });

      await sendEmail({
        to: salesEmail,
        ...adminContent,
        replyTo: body.companyEmail,
      });
    }

    // Load translations for user-facing email
    const t = await loadEmailTranslations(locale);

    // Build roadmap phases for the email template
    let roadmapPhases: Array<{ number: number; monthRange: string; name: string; accruedSavings: number }> | undefined;
    if (body.calculationResults) {
      const roadmap = calculateRoadmap(
        body.teamMaturity as MaturityLevel,
        body.timeline as TimelineOption,
        body.calculationResults.results.realSavings,
      );
      roadmapPhases = roadmap.map((phase) => ({
        number: phase.number,
        monthRange: phase.monthRange,
        name: t(`Calculator.maturity.${body.teamMaturity}.phase${phase.number}`),
        accruedSavings: phase.accruedSavings,
      }));
    }

    // Rich HTML email with results (in user's language)
    const userContent = getCalculatorUserConfirmation(
      {
        fullName: body.fullName,
        companyName: body.companyName,
        selectedTeam: body.teamId ? (teams.find((team) => team.id === body.teamId) ? t(`Calculator.teams.${body.teamId}.name`) : body.selectedTeam) : body.selectedTeam,
        selectedCountry: body.selectedCountry,
        teamSize: body.teamSize,
        currency: body.currency,
        primaryGoal: t(`Calculator.goals.${body.primaryGoal}.label`),
        timeline: body.timeline === "3_months" ? t("Calculator.threeMonths") : body.timeline === "6_months" ? t("Calculator.sixMonths") : t("Calculator.twelveMonths"),
        currentCost: body.currentCost,
        bsgCost: body.bsgCost,
        savings: body.savings,
        efficiencyGain: body.efficiencyGain,
        hoursReclaimed: body.hoursReclaimed,
        roi: body.roi,
        diagnosticFindings: body.diagnosticFindings,
        roadmapPhases,
      },
      t,
      locale,
    );

    // Generate PDF attachment if calculation results are available
    let pdfAttachment: Array<{ filename: string; content: Buffer; contentType: string }> | undefined;

    if (body.calculationResults && body.teamId && body.roleId) {
      try {
        const { renderToBuffer } = await import("@react-pdf/renderer");
        const { CalculatorResultsPDF } = await import("@/app/[locale]/(public)/calculator/CalculatorResultsPDF");

        const selectedTeam = teams.find((team) => team.id === body.teamId);
        const logoPath = path.join(process.cwd(), "public", "images", "logo.png");

        // Build FormDataState from body
        const formDataState: FormDataState = {
          fullName: body.fullName,
          companyEmail: body.companyEmail,
          companyName: body.companyName,
          mobileNumber: body.mobileNumber,
          selectedCountry: body.selectedCountry as CountryCode | "",
          selectedCurrency: body.currency as CurrencyCode | "",
          teamSize: String(body.teamSize),
          fullSalary: body.fullSalary ? String(body.fullSalary) : "",
          costOverrides: {},
          costCustomFlags: {},
          otherCosts: "",
          teamMaturity: body.teamMaturity as MaturityLevel | "",
          diagnosticAnswers: {},
          primaryGoal: body.primaryGoal as GoalType | "",
          targetEfficiency: body.targetEfficiency as "95" | "97" | "99" | "",
          timeline: body.timeline as TimelineOption | "",
        };

        // Build PDF translations
        const pdfTranslations = buildPdfTranslations(t, body, body.calculationResults, locale);

        const pdfElement = React.createElement(CalculatorResultsPDF, {
          results: body.calculationResults,
          formData: formDataState,
          selectedTeam,
          roleId: body.roleId,
          translations: pdfTranslations,
          locale,
          logoSrc: logoPath,
        });

        // renderToBuffer expects ReactElement<DocumentProps> but our component wraps Document internally
        const pdfBuffer = await renderToBuffer(pdfElement as React.ReactElement);
        const teamName = selectedTeam ? t(`Calculator.teams.${selectedTeam.id}.name`) : body.selectedTeam;
        const safeFilename = `BSG-${teamName}-Analysis-${body.companyName}`.replace(/[^a-zA-Z0-9 _-]/g, "").replace(/\s+/g, "-");

        pdfAttachment = [{
          filename: `${safeFilename}.pdf`,
          content: Buffer.from(pdfBuffer),
          contentType: "application/pdf",
        }];
      } catch (pdfError) {
        console.error("PDF generation failed, sending email without attachment:", pdfError);
        // Continue without PDF attachment
      }
    }

    await sendEmail({
      to: body.companyEmail,
      ...userContent,
      attachments: pdfAttachment,
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
