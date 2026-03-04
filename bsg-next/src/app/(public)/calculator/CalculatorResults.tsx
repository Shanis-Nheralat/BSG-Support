'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  AlertTriangle, Target, Building, TrendingUp, CheckCircle,
  DollarSign, Clock, Calculator, ArrowLeft, Download, Loader2,
} from 'lucide-react';
import type { CalculationResults, FormDataState, TeamDefinition, RoleLevel } from '@/lib/calculator/types';
import { formatCurrency } from '@/lib/calculator/calculations';
import { currencies } from '@/lib/calculator/constants';
import { CalculatorResultsPDF } from './CalculatorResultsPDF';

// Dynamically import PDFDownloadLink to avoid SSR issues
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => <span className="inline-flex items-center"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Preparing PDF...</span> }
);

interface CalculatorResultsProps {
  results: CalculationResults;
  formData: FormDataState;
  selectedTeam: TeamDefinition | undefined;
  selectedRole: RoleLevel | undefined;
  onBack: () => void;
}

export default function CalculatorResults({
  results,
  formData,
  selectedTeam,
  selectedRole,
  onBack,
}: CalculatorResultsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const hasSubmitted = useRef(false);
  
  const c = formData.selectedCurrency;
  const { currentSituation, withBSG, results: r, diagnosticResults, employeeCost } = results;

  // Auto-submit lead when results page loads
  useEffect(() => {
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;

    async function submitLead() {
      setIsSubmitting(true);

      try {
        const response = await fetch('/api/calculator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // Contact info
            fullName: formData.fullName,
            companyEmail: formData.companyEmail,
            companyName: formData.companyName,
            mobileNumber: formData.mobileNumber,
            // Team selection
            selectedTeam: selectedTeam?.name || 'Unknown',
            selectedRole: selectedRole?.name || 'Unknown',
            teamSize: results.teamSize,
            teamMaturity: formData.teamMaturity,
            currency: c,
            // Financial results
            currentCost: currentSituation.teamCost,
            bsgCost: withBSG.bsgTotalCost,
            savings: r.realSavings,
            efficiencyGain: r.efficiencyGain,
            hoursReclaimed: r.hoursReclaimed,
            roi: r.roi,
            // Cost breakdown (per employee)
            costBreakdown: {
              fullSalary: employeeCost.fullSalary,
              visaCosts: employeeCost.visaCosts,
              insurance: employeeCost.insurance,
              training: employeeCost.training,
              equipment: employeeCost.equipment,
              officeSpace: employeeCost.officeSpace,
              leaveSalary: employeeCost.leaveSalary,
              annualFlight: employeeCost.annualFlight,
              eosGratuity: employeeCost.eosGratuity,
              otherCosts: employeeCost.otherCosts,
              totalOverheads: employeeCost.totalOverheads,
              trueCost: employeeCost.trueCost,
            },
            // Diagnostic details
            diagnosticScore: Math.round(diagnosticResults.inefficiencyPercent * 100),
            diagnosticAnswers: formData.diagnosticAnswers,
            keyIssues: diagnosticResults.keyIssues,
            timeWasteHours: diagnosticResults.timeWasteHours,
            // Goals & preferences
            primaryGoal: formData.primaryGoal,
            targetEfficiency: formData.targetEfficiency,
            timeline: formData.timeline,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to submit');
        }

        setSubmitStatus({
          type: 'success',
          message: 'Thank you! Our team will contact you within 24 hours to discuss your optimization opportunities.',
        });
      } catch (error) {
        setSubmitStatus({
          type: 'error',
          message: error instanceof Error ? error.message : 'Failed to submit. Please try again.',
        });
      } finally {
        setIsSubmitting(false);
      }
    }

    submitLead();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-8 rounded-xl bg-navy p-8 text-center text-white shadow-lg">
          <h1 className="mb-2 text-3xl font-bold">{selectedTeam?.name} Optimization Report</h1>
          <p className="text-lg text-white/90">Strategic Business Enhancement Analysis by BSG ({currencies[c].name})</p>
        </div>

        {/* Executive Summary */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-md">
          <h2 className="mb-6 text-center text-2xl font-bold text-navy">Executive Summary</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-5">
              <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-900">
                <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                Current State
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Your {results.teamSize}-person {selectedTeam?.name?.toLowerCase()} costs {formatCurrency(currentSituation.teamCost, c)} annually but operates at only {currentSituation.currentEfficiency}% efficiency, wasting {r.hoursReclaimed} hours per week.
              </p>
            </div>
            <div className="rounded-lg border-2 border-green-200 bg-green-50 p-5">
              <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-900">
                <Target className="mr-2 h-5 w-5 text-green-500" />
                Future with BSG
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                BSG delivers {withBSG.bsgEfficiency}% efficiency at {formatCurrency(withBSG.bsgTotalCost, c)} annually - {r.isPositiveSavings ? `saving you ${formatCurrency(r.realSavings, c)}` : `requiring ${formatCurrency(Math.abs(r.realSavings), c)} additional investment`} while reclaiming {Math.max(0, r.hoursReclaimed - 2)} productive hours per week.
              </p>
            </div>
          </div>
        </div>

        {/* Company Overview */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-md">
          <h3 className="mb-4 flex items-center text-xl font-semibold text-navy">
            <Building className="mr-3 h-6 w-6 text-gold" />
            Company Overview
          </h3>
          <div className="rounded-lg bg-navy p-6 text-center text-white">
            <h4 className="text-xl font-bold">{(formData.companyName || 'YOUR COMPANY').toUpperCase()}&apos;S TEAM ANALYSIS</h4>
            <p className="mt-2 text-white/90">{selectedTeam?.name} | {results.teamSize} Personnel | {currencies[c].name}</p>
          </div>
        </div>

        {/* Current Performance */}
        <div className="mb-6 rounded-xl border-l-4 border-l-red-500 border border-gray-200 bg-white p-6 shadow-md">
          <h3 className="mb-4 flex items-center text-xl font-semibold text-navy">
            <TrendingUp className="mr-3 h-6 w-6 text-red-500" />
            Current Performance Issues
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border-t-4 border-t-red-500 bg-white p-5 shadow text-center">
              <div className="text-2xl font-bold text-red-600">{formatCurrency(currentSituation.teamCost, c)}</div>
              <div className="mt-1 text-sm font-medium uppercase text-gray-600">Annual Cost</div>
            </div>
            <div className="rounded-lg border-t-4 border-t-red-500 bg-white p-5 shadow text-center">
              <div className="text-2xl font-bold text-red-600">{currentSituation.currentEfficiency}%</div>
              <div className="mt-1 text-sm font-medium uppercase text-gray-600">Efficiency</div>
            </div>
            <div className="rounded-lg border-t-4 border-t-red-500 bg-white p-5 shadow text-center">
              <div className="text-2xl font-bold text-red-600">{r.hoursReclaimed} hrs/wk</div>
              <div className="mt-1 text-sm font-medium uppercase text-gray-600">Wasted Hours</div>
            </div>
            <div className="rounded-lg border-t-4 border-t-red-500 bg-white p-5 shadow text-center">
              <div className="text-2xl font-bold text-red-600">{diagnosticResults.keyIssues.length || 'Multiple'}</div>
              <div className="mt-1 text-sm font-medium uppercase text-gray-600">Process Issues</div>
            </div>
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="mb-6 rounded-xl border-l-4 border-l-red-500 border border-gray-200 bg-white p-6 shadow-md">
          <h3 className="mb-4 flex items-center text-xl font-semibold text-navy">
            <AlertTriangle className="mr-3 h-6 w-6 text-red-500" />
            Cost Analysis
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-red-600 p-5 text-white">
              <h4 className="mb-4 font-semibold">Cost Per Employee (Annual)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span>Base Salary</span>
                  <span>{formatCurrency(employeeCost.fullSalary, c)}</span>
                </div>
                <div className="border-b border-white/20 pb-2">
                  <div className="flex justify-between font-medium text-white/90 mb-1">
                    <span>Overhead Breakdown:</span>
                  </div>
                  <div className="ml-2 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Visa & Work Permit</span>
                      <span>{formatCurrency(employeeCost.visaCosts, c)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Health Insurance</span>
                      <span>{formatCurrency(employeeCost.insurance, c)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Training & Development</span>
                      <span>{formatCurrency(employeeCost.training, c)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Equipment & IT</span>
                      <span>{formatCurrency(employeeCost.equipment, c)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Office Space</span>
                      <span>{formatCurrency(employeeCost.officeSpace, c)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Leave Salary</span>
                      <span>{formatCurrency(employeeCost.leaveSalary, c)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annual Flight</span>
                      <span>{formatCurrency(employeeCost.annualFlight, c)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>EOS Gratuity</span>
                      <span>{formatCurrency(employeeCost.eosGratuity, c)}</span>
                    </div>
                    {employeeCost.otherCosts > 0 && (
                      <div className="flex justify-between">
                        <span>Other Costs</span>
                        <span>{formatCurrency(employeeCost.otherCosts, c)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span>Total Overheads</span>
                  <span>{formatCurrency(employeeCost.totalOverheads, c)}</span>
                </div>
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span>Inefficiency Loss</span>
                  <span>{currentSituation.productivityLoss}% capacity</span>
                </div>
                <div className="flex justify-between pt-2 font-bold text-lg">
                  <span>True Cost Per Head</span>
                  <span>{formatCurrency(currentSituation.trueCostPerEmployee, c)}</span>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-red-600 p-5 text-white">
              <h4 className="mb-4 font-semibold">Total Team Costs (Annual)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span>Total Salaries ({results.teamSize} staff)</span>
                  <span>{formatCurrency(employeeCost.fullSalary * results.teamSize, c)}</span>
                </div>
                <div className="border-b border-white/20 pb-2">
                  <div className="flex justify-between font-medium text-white/90 mb-1">
                    <span>Total Overheads:</span>
                    <span>{formatCurrency(employeeCost.totalOverheads * results.teamSize, c)}</span>
                  </div>
                  <div className="ml-2 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Visa & Work Permit</span>
                      <span>{formatCurrency(employeeCost.visaCosts * results.teamSize, c)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Health Insurance</span>
                      <span>{formatCurrency(employeeCost.insurance * results.teamSize, c)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Training & Development</span>
                      <span>{formatCurrency(employeeCost.training * results.teamSize, c)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Equipment & IT</span>
                      <span>{formatCurrency(employeeCost.equipment * results.teamSize, c)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Office Space</span>
                      <span>{formatCurrency(employeeCost.officeSpace * results.teamSize, c)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Leave Salary</span>
                      <span>{formatCurrency(employeeCost.leaveSalary * results.teamSize, c)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annual Flight</span>
                      <span>{formatCurrency(employeeCost.annualFlight * results.teamSize, c)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>EOS Gratuity</span>
                      <span>{formatCurrency(employeeCost.eosGratuity * results.teamSize, c)}</span>
                    </div>
                    {employeeCost.otherCosts > 0 && (
                      <div className="flex justify-between">
                        <span>Other Costs</span>
                        <span>{formatCurrency(employeeCost.otherCosts * results.teamSize, c)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span>Weekly Time Waste</span>
                  <span>{r.hoursReclaimed} hours</span>
                </div>
                <div className="flex justify-between pt-2 font-bold text-lg">
                  <span>Annual Total</span>
                  <span>{formatCurrency(currentSituation.teamCost, c)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BSG Solution Comparison */}
        <div className="mb-6 rounded-xl border-l-4 border-l-green-500 border border-gray-200 bg-white p-6 shadow-md">
          <h3 className="mb-4 flex items-center text-xl font-semibold text-navy">
            <CheckCircle className="mr-3 h-6 w-6 text-green-500" />
            BSG Solution Benefits
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="p-4 text-left font-semibold">Metric</th>
                  <th className="p-4 text-center font-semibold">Current</th>
                  <th className="p-4 text-center font-semibold">With BSG</th>
                  <th className="p-4 text-center font-semibold">Improvement</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-900">Annual Cost</td>
                  <td className="p-4 text-center font-bold text-red-600">{formatCurrency(currentSituation.teamCost, c)}</td>
                  <td className="p-4 text-center font-bold text-green-600">{formatCurrency(withBSG.bsgTotalCost, c)}</td>
                  <td className="p-4 text-center font-bold" style={{ color: r.isPositiveSavings ? '#16a34a' : '#dc2626' }}>
                    {r.isPositiveSavings ? `${Math.round((r.realSavings / currentSituation.teamCost) * 100)}% Reduction` : `${Math.round((Math.abs(r.realSavings) / currentSituation.teamCost) * 100)}% Increase`}
                  </td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">Efficiency Rate</td>
                  <td className="p-4 text-center font-bold text-red-600">{currentSituation.currentEfficiency}%</td>
                  <td className="p-4 text-center font-bold text-green-600">{withBSG.bsgEfficiency}%</td>
                  <td className="p-4 text-center font-bold text-green-600">{r.efficiencyGain}% Increase</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-gray-900">Time Wastage</td>
                  <td className="p-4 text-center font-bold text-red-600">{r.hoursReclaimed} hrs/week</td>
                  <td className="p-4 text-center font-bold text-green-600">2 hrs/week</td>
                  <td className="p-4 text-center font-bold text-green-600">87% Reduction</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="mb-6 rounded-xl border-l-4 border-l-green-500 border border-gray-200 bg-white p-6 shadow-md">
          <h3 className="mb-4 flex items-center text-xl font-semibold text-navy">
            <Target className="mr-3 h-6 w-6 text-green-500" />
            Key Benefits Summary
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-green-600 p-5 text-center text-white shadow">
              <DollarSign className="mx-auto mb-2 h-6 w-6" />
              <div className="text-2xl font-bold">{formatCurrency(Math.abs(r.realSavings), c)}</div>
              <div className="mt-1 text-sm">{r.isPositiveSavings ? 'Annual Savings' : 'Quality Investment'}</div>
            </div>
            <div className="rounded-lg bg-green-600 p-5 text-center text-white shadow">
              <Clock className="mx-auto mb-2 h-6 w-6" />
              <div className="text-2xl font-bold">{Math.max(0, r.hoursReclaimed - 2)}</div>
              <div className="mt-1 text-sm">Hours/Week Gained</div>
            </div>
            <div className="rounded-lg bg-green-600 p-5 text-center text-white shadow">
              <CheckCircle className="mx-auto mb-2 h-6 w-6" />
              <div className="text-2xl font-bold">{withBSG.bsgEfficiency}%</div>
              <div className="mt-1 text-sm">Guaranteed Rate</div>
            </div>
            <div className="rounded-lg bg-green-600 p-5 text-center text-white shadow">
              <TrendingUp className="mx-auto mb-2 h-6 w-6" />
              <div className="text-2xl font-bold">{r.isPositiveSavings ? r.roi + '%' : 'Quality'}</div>
              <div className="mt-1 text-sm">{r.isPositiveSavings ? 'ROI' : 'Investment'}</div>
            </div>
          </div>

          {r.isPositiveSavings && (
            <div className="mt-6 rounded-lg bg-navy p-6 text-white">
              <h4 className="mb-4 text-center text-lg font-semibold">Return on Investment</h4>
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded bg-white/10 p-4 text-center">
                  <div className="font-semibold">Investment</div>
                  <div className="text-sm">{formatCurrency(withBSG.bsgTotalCost, c)}/year</div>
                </div>
                <div className="rounded bg-white/10 p-4 text-center">
                  <div className="font-semibold">Savings</div>
                  <div className="text-sm">{formatCurrency(r.realSavings, c)}/year</div>
                </div>
                <div className="rounded bg-white/10 p-4 text-center">
                  <div className="font-semibold">ROI</div>
                  <div className="text-sm">{r.roi}% Return</div>
                </div>
                <div className="rounded bg-white/10 p-4 text-center">
                  <div className="font-semibold">Payback</div>
                  <div className="text-sm">Immediate</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Methodology */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-md">
          <h3 className="mb-4 flex items-center text-xl font-semibold text-navy">
            <Calculator className="mr-3 h-6 w-6 text-gold" />
            Calculation Methodology
          </h3>
          <div className="rounded-lg bg-gray-50 p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-3 font-semibold text-navy">Current Cost Calculation</h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <div>Base Salary: {formatCurrency(employeeCost.fullSalary, c)}</div>
                  <div>Total Overheads: {formatCurrency(employeeCost.totalOverheads, c)}</div>
                  <div>True Cost per Employee: {formatCurrency(employeeCost.trueCost, c)}</div>
                  <div>Team Size: {results.teamSize} people</div>
                  <div className="mt-2 font-semibold">Total Team Cost: {formatCurrency(currentSituation.teamCost, c)}</div>
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-semibold text-navy">BSG Cost Calculation</h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <div>BSG Rate: {selectedRole ? Math.round(selectedRole.bsgRate * 100) : 80}% of salary</div>
                  <div>Cost per Employee: {formatCurrency(withBSG.bsgCostPerEmployee, c)}</div>
                  <div>Efficiency Guarantee: {withBSG.bsgEfficiency}%</div>
                  <div className="mt-2 font-semibold">Total BSG Cost: {formatCurrency(withBSG.bsgTotalCost, c)}</div>
                </div>
              </div>
            </div>
            <div className="mt-4 rounded bg-blue-50 p-4 text-xs text-navy">
              <strong>Notes:</strong> EOS Gratuity calculated as (Salary / 365) x 21 days per UAE Labor Law. Inefficiency score capped at 20% maximum. BSG efficiency guaranteed at minimum 96%. Currency: {currencies[c].name}.
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-md print:hidden">
          <h2 className="mb-6 text-2xl font-bold text-navy">Transform Your {selectedTeam?.name} Operations Today</h2>
          
          {isSubmitting && (
            <div className="mb-6 flex items-center justify-center gap-2 text-sm text-navy">
              <Loader2 className="h-5 w-5 animate-spin" />
              Submitting your analysis...
            </div>
          )}
          
          {submitStatus && (
            <div
              className={`mb-6 rounded-lg p-4 text-sm ${
                submitStatus.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {submitStatus.message}
            </div>
          )}
          
          <div className="flex flex-wrap justify-center gap-4">
            <PDFDownloadLink
              document={
                <CalculatorResultsPDF
                  results={results}
                  formData={formData}
                  selectedTeam={selectedTeam}
                  selectedRole={selectedRole}
                />
              }
              fileName={`BSG-${selectedTeam?.name || 'Team'}-Analysis-${formData.companyName || 'Report'}.pdf`}
              className="inline-flex items-center rounded-full border-2 border-navy px-6 py-3 font-semibold text-navy transition hover:bg-gray-100"
            >
              {({ loading }) => (
                loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Preparing PDF...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Download Report
                  </>
                )
              )}
            </PDFDownloadLink>
            <button
              onClick={onBack}
              className="inline-flex items-center rounded-full border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Calculator
            </button>
          </div>
          <p className="mt-6 text-gray-600">
            Begin realizing {r.isPositiveSavings ? `${formatCurrency(r.realSavings, c)} in annual savings` : 'enhanced operational efficiency'} with professional team optimization
          </p>
        </div>
      </div>
    </div>
  );
}
