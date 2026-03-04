import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth-helpers";
import { PageHeader, Badge } from "@/components/ui";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { Mail, Phone, Building, Calendar, ArrowLeft, Clock, FileText, MessageSquare, TrendingUp, DollarSign, Users, Target, Calculator } from "lucide-react";
import { InquiryStatusSelect } from "./InquiryStatusSelect";

interface CostBreakdown {
  fullSalary?: number;
  visaCosts?: number;
  insurance?: number;
  training?: number;
  equipment?: number;
  officeSpace?: number;
  leaveSalary?: number;
  annualFlight?: number;
  eosGratuity?: number;
  otherCosts?: number;
  totalOverheads?: number;
  trueCost?: number;
}

interface CalculatorRequirements {
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
  targetEfficiency?: string;
  costBreakdown?: CostBreakdown;
  diagnosticScore?: number;
  diagnosticAnswers?: Record<number, number>;
  keyIssues?: Array<{ area: string; impact: string }>;
  timeWasteHours?: number;
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
                          <dd className="mt-1 text-gray-900 dark:text-white">{calcData.teamMaturity || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Primary Goal</dt>
                          <dd className="mt-1 text-gray-900 dark:text-white">{inquiry.business_industry}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Target Efficiency</dt>
                          <dd className="mt-1 text-gray-900 dark:text-white">{calcData.targetEfficiency}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Timeline</dt>
                          <dd className="mt-1 text-gray-900 dark:text-white">{inquiry.implementation_timeline}</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>

                  {/* Cost Breakdown */}
                  {calcData.costBreakdown && (
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
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="py-2 text-left font-medium text-gray-500 dark:text-gray-400">Cost Item</th>
                                <th className="py-2 text-right font-medium text-gray-500 dark:text-gray-400">Amount ({calcData.currency})</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                              <tr>
                                <td className="py-2 text-gray-900 dark:text-white">Base Salary</td>
                                <td className="py-2 text-right text-gray-900 dark:text-white">{formatCurrency(calcData.costBreakdown.fullSalary, calcData.currency)}</td>
                              </tr>
                              <tr>
                                <td className="py-2 text-gray-600 dark:text-gray-300">Visa & Work Permit</td>
                                <td className="py-2 text-right text-gray-600 dark:text-gray-300">{formatCurrency(calcData.costBreakdown.visaCosts, calcData.currency)}</td>
                              </tr>
                              <tr>
                                <td className="py-2 text-gray-600 dark:text-gray-300">Health Insurance</td>
                                <td className="py-2 text-right text-gray-600 dark:text-gray-300">{formatCurrency(calcData.costBreakdown.insurance, calcData.currency)}</td>
                              </tr>
                              <tr>
                                <td className="py-2 text-gray-600 dark:text-gray-300">Training & Development</td>
                                <td className="py-2 text-right text-gray-600 dark:text-gray-300">{formatCurrency(calcData.costBreakdown.training, calcData.currency)}</td>
                              </tr>
                              <tr>
                                <td className="py-2 text-gray-600 dark:text-gray-300">Equipment & Software</td>
                                <td className="py-2 text-right text-gray-600 dark:text-gray-300">{formatCurrency(calcData.costBreakdown.equipment, calcData.currency)}</td>
                              </tr>
                              <tr>
                                <td className="py-2 text-gray-600 dark:text-gray-300">Office Space & Utilities</td>
                                <td className="py-2 text-right text-gray-600 dark:text-gray-300">{formatCurrency(calcData.costBreakdown.officeSpace, calcData.currency)}</td>
                              </tr>
                              <tr>
                                <td className="py-2 text-gray-600 dark:text-gray-300">Leave Salary</td>
                                <td className="py-2 text-right text-gray-600 dark:text-gray-300">{formatCurrency(calcData.costBreakdown.leaveSalary, calcData.currency)}</td>
                              </tr>
                              <tr>
                                <td className="py-2 text-gray-600 dark:text-gray-300">Annual Flight Allowance</td>
                                <td className="py-2 text-right text-gray-600 dark:text-gray-300">{formatCurrency(calcData.costBreakdown.annualFlight, calcData.currency)}</td>
                              </tr>
                              <tr>
                                <td className="py-2 text-gray-600 dark:text-gray-300">EOS Gratuity</td>
                                <td className="py-2 text-right text-gray-600 dark:text-gray-300">{formatCurrency(calcData.costBreakdown.eosGratuity, calcData.currency)}</td>
                              </tr>
                              <tr>
                                <td className="py-2 text-gray-600 dark:text-gray-300">Other Costs</td>
                                <td className="py-2 text-right text-gray-600 dark:text-gray-300">{formatCurrency(calcData.costBreakdown.otherCosts, calcData.currency)}</td>
                              </tr>
                              <tr className="border-t-2 border-gray-300 dark:border-gray-600 font-medium">
                                <td className="py-2 text-gray-900 dark:text-white">Total Overheads</td>
                                <td className="py-2 text-right text-gray-900 dark:text-white">{formatCurrency(calcData.costBreakdown.totalOverheads, calcData.currency)}</td>
                              </tr>
                              <tr className="font-bold text-navy dark:text-gold">
                                <td className="py-2">True Cost per Employee</td>
                                <td className="py-2 text-right">{formatCurrency(calcData.costBreakdown.trueCost, calcData.currency)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
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
