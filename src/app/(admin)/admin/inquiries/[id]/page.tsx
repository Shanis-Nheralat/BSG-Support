import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth-helpers";
import { PageHeader, Badge } from "@/components/ui";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { Mail, Phone, Building, Calendar, ArrowLeft, Clock, FileText, MessageSquare, TrendingUp, DollarSign, Users, Target, Calculator, BarChart3 } from "lucide-react";
import { InquiryStatusSelect } from "./InquiryStatusSelect";

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
}

interface CalculatorRequirements {
  country?: string;
  teamSize?: number;
  teamMaturity?: string;
  role?: string;
  currency?: string;
  currentCost?: number;
  bsgCost?: number;
  savings?: number;
  efficiencyGain?: number;
  hoursReclaimed?: number;
  roi?: number;
  overheadRatio?: number;
  targetEfficiency?: string;
  fullSalary?: number;
  costBreakdown?: Record<string, CostBreakdownItem>;
  diagnosticScore?: number;
  diagnosticFindings?: DiagnosticFinding[];
  keyIssues?: Array<{ area: string; impact: string }>;
  timeWasteHours?: number;
  taskAllocations?: Record<string, number>;
}

interface InquiryDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: InquiryDetailPageProps) {
  const inquiry = await prisma.inquiries.findUnique({
    where: { id: parseInt(params.id) },
  });
  return { title: inquiry ? `Inquiry from ${inquiry.name}` : "Inquiry Not Found" };
}

export default async function InquiryDetailPage({ params }: InquiryDetailPageProps) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const inquiry = await prisma.inquiries.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!inquiry) notFound();

  function getFormTypeLabel(formType: string) {
    switch (formType) {
      case "general_inquiry":
        return "General Inquiry";
      case "meeting_request":
        return "Meeting Request";
      case "service_intake":
        return "Service Intake";
      default:
        return formType;
    }
  }

  function formatDate(date: Date | null) {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatMaturity(val: string | undefined) {
    if (!val) return "N/A";
    const map: Record<string, string> = { "1": "Basic", "2": "Developing", "3": "Mature", "4": "Advanced" };
    return map[val] || val;
  }

  function formatGoal(val: string | undefined) {
    if (!val) return "N/A";
    const map: Record<string, string> = {
      cost_reduction: "Cost Reduction",
      efficiency_boost: "Efficiency Boost",
      quality_improvement: "Quality Improvement",
      scalability: "Scalability",
    };
    return map[val] || val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function formatTimeline(val: string | undefined) {
    if (!val) return "N/A";
    const map: Record<string, string> = { "3_months": "3 Months", "6_months": "6 Months", "12_months": "12 Months" };
    return map[val] || val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function formatCountryCode(code: string | undefined) {
    if (!code) return "N/A";
    const map: Record<string, string> = {
      UAE: "United Arab Emirates", DE: "Germany", UK: "United Kingdom",
      SA: "Saudi Arabia", QA: "Qatar", US: "United States", AU: "Australia",
    };
    return map[code] || code;
  }

  return (
    <>
      <div className="mb-6">
        <Link
          href="/admin/inquiries"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-navy dark:text-gray-400 dark:hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Inquiries
        </Link>
      </div>

      <PageHeader
        title={`Inquiry from ${inquiry.name}`}
        description={`Submitted on ${formatDate(inquiry.submitted_at)}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Message */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                  Message
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {inquiry.message}
              </p>
            </CardContent>
          </Card>

          {/* Additional Details (if service intake or meeting request) */}
          {inquiry.form_type === "service_intake" && (() => {
            // Check if this is a calculator submission
            const isCalculatorLead = inquiry.message?.includes('[Calculator Lead]');
            let calcData: CalculatorRequirements | null = null;
            
            if (isCalculatorLead && inquiry.requirements) {
              try {
                calcData = JSON.parse(inquiry.requirements) as CalculatorRequirements;
              } catch {
                calcData = null;
              }
            }

            const formatCurrency = (amount: number | undefined, currency: string = 'AED') => {
              if (amount === undefined) return 'N/A';
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
                maximumFractionDigits: 0,
              }).format(amount);
            };

            if (isCalculatorLead && calcData) {
              return (
                <>
                  {/* Calculator Financial Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <div className="flex items-center gap-2">
                          <Calculator className="h-5 w-5 text-gold" />
                          Calculator Analysis Results
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center dark:border-red-800 dark:bg-red-900/20">
                          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {formatCurrency(calcData.currentCost, calcData.currency)}
                          </div>
                          <div className="mt-1 text-xs font-medium uppercase text-gray-500">Current Annual Cost</div>
                        </div>
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center dark:border-green-800 dark:bg-green-900/20">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {formatCurrency(calcData.bsgCost, calcData.currency)}
                          </div>
                          <div className="mt-1 text-xs font-medium uppercase text-gray-500">BSG Annual Cost</div>
                        </div>
                        <div className="rounded-lg border border-gold/30 bg-gold/10 p-4 text-center">
                          <div className="text-2xl font-bold text-gold-dark">
                            {formatCurrency(calcData.savings, calcData.currency)}
                          </div>
                          <div className="mt-1 text-xs font-medium uppercase text-gray-500">Annual Savings</div>
                        </div>
                        <div className="rounded-lg border border-navy/30 bg-navy/10 p-4 text-center dark:border-navy-400/30 dark:bg-navy-400/10">
                          <div className="text-2xl font-bold text-navy dark:text-navy-300">
                            {calcData.roi?.toFixed(1)}%
                          </div>
                          <div className="mt-1 text-xs font-medium uppercase text-gray-500">ROI</div>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                          <TrendingUp className="h-8 w-8 text-green-500" />
                          <div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">{calcData.efficiencyGain?.toFixed(1)}%</div>
                            <div className="text-xs text-gray-500">Efficiency Gain</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                          <Clock className="h-8 w-8 text-blue-500" />
                          <div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">{calcData.hoursReclaimed?.toFixed(1)} hrs</div>
                            <div className="text-xs text-gray-500">Hours Reclaimed/Week</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                          <Target className="h-8 w-8 text-purple-500" />
                          <div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">{calcData.diagnosticScore || 0}%</div>
                            <div className="text-xs text-gray-500">Inefficiency Score</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Team Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-gray-400" />
                          Team Configuration
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Country</dt>
                          <dd className="mt-1 text-gray-900 dark:text-white">{formatCountryCode(calcData.country)}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Team Type</dt>
                          <dd className="mt-1 text-gray-900 dark:text-white">{inquiry.service_type}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Team Size</dt>
                          <dd className="mt-1 text-gray-900 dark:text-white">{calcData.teamSize} employees</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Role Level</dt>
                          <dd className="mt-1 text-gray-900 dark:text-white">{calcData.role}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Currency</dt>
                          <dd className="mt-1 text-gray-900 dark:text-white">{calcData.currency}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Team Maturity</dt>
                          <dd className="mt-1 text-gray-900 dark:text-white">{formatMaturity(calcData.teamMaturity)}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Primary Goal</dt>
                          <dd className="mt-1 text-gray-900 dark:text-white">{formatGoal(inquiry.business_industry || undefined)}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Target Efficiency</dt>
                          <dd className="mt-1 text-gray-900 dark:text-white">{calcData.targetEfficiency ? `${calcData.targetEfficiency}%` : 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Timeline</dt>
                          <dd className="mt-1 text-gray-900 dark:text-white">{formatTimeline(inquiry.implementation_timeline || undefined)}</dd>
                        </div>
                        {calcData.overheadRatio !== undefined && (
                          <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Overhead Ratio</dt>
                            <dd className="mt-1 text-gray-900 dark:text-white">{calcData.overheadRatio}%</dd>
                          </div>
                        )}
                      </dl>
                    </CardContent>
                  </Card>

                  {/* Cost Breakdown */}
                  {calcData.costBreakdown && Object.keys(calcData.costBreakdown).length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                            Per-Employee Cost Breakdown
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {(() => {
                          const breakdown = calcData.costBreakdown!;
                          let totalOverheads = 0;
                          const items = Object.entries(breakdown).map(([, item]) => {
                            totalOverheads += item.value || 0;
                            return item;
                          });
                          const baseSalary = calcData.fullSalary || 0;
                          const trueCost = baseSalary + totalOverheads;

                          return (
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="py-2 text-left font-medium text-gray-500 dark:text-gray-400">Cost Item</th>
                                    <th className="py-2 text-right font-medium text-gray-500 dark:text-gray-400">Amount ({calcData.currency})</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                  {baseSalary > 0 && (
                                    <tr>
                                      <td className="py-2 font-medium text-gray-900 dark:text-white">Base Salary</td>
                                      <td className="py-2 text-right font-medium text-gray-900 dark:text-white">{formatCurrency(baseSalary, calcData.currency)}</td>
                                    </tr>
                                  )}
                                  {items.map((item, idx) => (
                                    <tr key={idx}>
                                      <td className="py-2 text-gray-600 dark:text-gray-300">{item.label}</td>
                                      <td className="py-2 text-right text-gray-600 dark:text-gray-300">{formatCurrency(item.value, calcData.currency)}</td>
                                    </tr>
                                  ))}
                                  <tr className="border-t-2 border-gray-300 dark:border-gray-600 font-medium">
                                    <td className="py-2 text-gray-900 dark:text-white">Total Overheads</td>
                                    <td className="py-2 text-right text-gray-900 dark:text-white">{formatCurrency(totalOverheads, calcData.currency)}</td>
                                  </tr>
                                  {baseSalary > 0 && (
                                    <tr className="font-bold text-navy dark:text-gold">
                                      <td className="py-2">True Cost per Employee</td>
                                      <td className="py-2 text-right">{formatCurrency(trueCost, calcData.currency)}</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          );
                        })()}
                      </CardContent>
                    </Card>
                  )}

                  {/* Task Allocations */}
                  {calcData.taskAllocations && Object.keys(calcData.taskAllocations).length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-gray-400" />
                            Task Time Allocation
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.entries(calcData.taskAllocations).map(([task, pct]) => (
                            <div key={task}>
                              <div className="mb-1 flex items-center justify-between text-sm">
                                <span className="text-gray-700 dark:text-gray-300">{task}</span>
                                <span className="font-medium text-gray-900 dark:text-white">{pct}%</span>
                              </div>
                              <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                <div
                                  className="h-full rounded-full bg-navy transition-all"
                                  style={{ width: `${Math.min(pct, 100)}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Diagnostic Findings */}
                  {calcData.diagnosticFindings && calcData.diagnosticFindings.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-gray-400" />
                            Diagnostic Findings ({calcData.diagnosticFindings.length})
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="py-2 text-left font-medium text-gray-500 dark:text-gray-400">Area</th>
                                <th className="py-2 text-left font-medium text-gray-500 dark:text-gray-400">Question</th>
                                <th className="py-2 text-left font-medium text-gray-500 dark:text-gray-400">Answer</th>
                                <th className="py-2 text-right font-medium text-gray-500 dark:text-gray-400">Impact</th>
                                <th className="py-2 text-right font-medium text-gray-500 dark:text-gray-400">Time Waste</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                              {calcData.diagnosticFindings.map((finding, idx) => (
                                <tr key={idx}>
                                  <td className="py-2 text-gray-700 dark:text-gray-300">{finding.area}</td>
                                  <td className="max-w-[200px] py-2 text-gray-600 dark:text-gray-400">{finding.question}</td>
                                  <td className="py-2">
                                    <Badge variant={finding.impactScore === 0 ? 'success' : finding.impactScore > 50 ? 'danger' : 'warning'}>
                                      {finding.answer}
                                    </Badge>
                                  </td>
                                  <td className="py-2 text-right text-gray-900 dark:text-white">{finding.impactScore}%</td>
                                  <td className="py-2 text-right text-gray-600 dark:text-gray-300">{finding.timeWasteMinutes} min/wk</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {calcData.timeWasteHours !== undefined && (
                          <p className="mt-4 text-sm text-gray-500">
                            Total estimated time waste: <span className="font-medium text-red-600">{calcData.timeWasteHours.toFixed(1)} hours/week</span>
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Key Issues Identified */}
                  {calcData.keyIssues && calcData.keyIssues.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-red-500" />
                            Key Issues Identified ({calcData.keyIssues.length})
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {calcData.keyIssues.map((issue, idx) => (
                            <li key={idx} className="flex items-start gap-2 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
                              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                              <div>
                                <span className="font-medium text-gray-900 dark:text-white">{issue.area}</span>
                                <span className="text-gray-500"> - {issue.impact}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                        {calcData.timeWasteHours !== undefined && (
                          <p className="mt-4 text-sm text-gray-500">
                            Estimated time waste: <span className="font-medium text-red-600">{calcData.timeWasteHours.toFixed(1)} hours/week</span>
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </>
              );
            }

            // Fallback for non-calculator service intake
            return (
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-gray-400" />
                      Service Requirements
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    {inquiry.service_type && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Service Type
                        </dt>
                        <dd className="mt-1 text-gray-900 dark:text-white">
                          {inquiry.service_type}
                        </dd>
                      </div>
                    )}
                    {inquiry.business_industry && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Business Industry
                        </dt>
                        <dd className="mt-1 text-gray-900 dark:text-white">
                          {inquiry.business_industry}
                        </dd>
                      </div>
                    )}
                    {inquiry.implementation_timeline && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Implementation Timeline
                        </dt>
                        <dd className="mt-1 text-gray-900 dark:text-white">
                          {inquiry.implementation_timeline}
                        </dd>
                      </div>
                    )}
                    {inquiry.requirements && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Requirements
                        </dt>
                        <dd className="mt-1 whitespace-pre-wrap text-gray-900 dark:text-white">
                          {inquiry.requirements}
                        </dd>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>
            );
          })()}

          {inquiry.form_type === "meeting_request" && (
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    Meeting Details
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  {inquiry.meeting_date && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Requested Date
                      </dt>
                      <dd className="mt-1 text-gray-900 dark:text-white">
                        {new Date(inquiry.meeting_date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </dd>
                    </div>
                  )}
                  {inquiry.meeting_time && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Requested Time
                      </dt>
                      <dd className="mt-1 text-gray-900 dark:text-white">
                        {inquiry.meeting_time}
                        {inquiry.timezone && ` (${inquiry.timezone})`}
                      </dd>
                    </div>
                  )}
                  {inquiry.services && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Services of Interest
                      </dt>
                      <dd className="mt-1 text-gray-900 dark:text-white">
                        {inquiry.services}
                      </dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          )}

          {/* Admin Notes */}
          {inquiry.admin_notes && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {inquiry.admin_notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <InquiryStatusSelect
                inquiryId={inquiry.id}
                currentStatus={inquiry.status || "New"}
              />
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Name
                  </dt>
                  <dd className="mt-1 text-gray-900 dark:text-white">
                    {inquiry.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="flex items-center gap-2 text-navy hover:text-gold dark:text-navy-300"
                    >
                      <Mail className="h-4 w-4" />
                      {inquiry.email}
                    </a>
                  </dd>
                </div>
                {inquiry.phone && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Phone
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={`tel:${inquiry.phone}`}
                        className="flex items-center gap-2 text-navy hover:text-gold dark:text-navy-300"
                      >
                        <Phone className="h-4 w-4" />
                        {inquiry.phone}
                      </a>
                    </dd>
                  </div>
                )}
                {inquiry.company && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Company
                    </dt>
                    <dd className="mt-1 flex items-center gap-2 text-gray-900 dark:text-white">
                      <Building className="h-4 w-4 text-gray-400" />
                      {inquiry.company}
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Meta Info */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Form Type
                  </dt>
                  <dd className="mt-1">
                    <Badge variant="default">
                      {getFormTypeLabel(inquiry.form_type)}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Submitted
                  </dt>
                  <dd className="mt-1 flex items-center gap-2 text-gray-900 dark:text-white">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {formatDate(inquiry.submitted_at)}
                  </dd>
                </div>
                {inquiry.updated_at && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Last Updated
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500">
                      {formatDate(inquiry.updated_at)}
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <a
                  href={`mailto:${inquiry.email}?subject=Re: Your inquiry to Backsure Global Support`}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-600"
                >
                  <Mail className="h-4 w-4" />
                  Send Email Reply
                </a>
                {inquiry.phone && (
                  <a
                    href={`tel:${inquiry.phone}`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
