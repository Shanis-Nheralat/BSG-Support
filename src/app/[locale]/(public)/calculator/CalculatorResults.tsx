'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations, useLocale } from 'next-intl';
import { Loader2, Search, ArrowLeftRight, CircleCheckBig, Building, Coins, Map, FileText, ArrowLeft, MessageSquare } from 'lucide-react';
import type { CalculationResults, FormDataState, TeamDefinition, RoleLevelId } from '@/lib/calculator/types';
import { formatCurrency, calculateTaskHandover, calculateRoadmap, calculateGoalKPIs } from '@/lib/calculator/calculations';
import { roleDefaults } from '@/lib/calculator/constants';
import { countryProfiles, goalConfigs } from '@/lib/calculator/countries';
import { renderIcon } from '@/lib/calculator/icons';
import { CalculatorResultsPDF } from './CalculatorResultsPDF';

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => <span className="inline-flex items-center"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Preparing PDF...</span> }
);

interface CalculatorResultsProps {
  results: CalculationResults;
  formData: FormDataState;
  selectedTeam: TeamDefinition | undefined;
  roleId: RoleLevelId;
  taskAllocations: Record<string, number>;
  onBack: () => void;
}

export default function CalculatorResults({
  results,
  formData,
  selectedTeam,
  roleId,
  taskAllocations,
  onBack,
}: CalculatorResultsProps) {
  const t = useTranslations('Calculator');
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const hasSubmitted = useRef(false);

  const c = formData.selectedCurrency;
  const profile = countryProfiles[formData.selectedCountry];
  const goalCfg = goalConfigs[formData.primaryGoal];
  const { currentSituation, withBSG, results: r, diagnosticResults, employeeCost } = results;

  // Computed results
  const taskHandover = calculateTaskHandover(selectedTeam, diagnosticResults);
  const roadmap = calculateRoadmap(formData.teamMaturity, formData.timeline, r.realSavings);
  const goalKPIs = calculateGoalKPIs(formData.primaryGoal, results, c);

  // Auto-submit lead on mount
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
            fullName: formData.fullName,
            companyEmail: formData.companyEmail,
            companyName: formData.companyName,
            mobileNumber: formData.mobileNumber,
            selectedCountry: formData.selectedCountry,
            selectedTeam: selectedTeam?.name || 'Unknown',
            selectedRole: roleDefaults[roleId]?.name || 'Unknown',
            teamSize: results.teamSize,
            teamMaturity: formData.teamMaturity,
            currency: c,
            fullSalary: employeeCost.fullSalary,
            currentCost: currentSituation.teamCost,
            bsgCost: withBSG.bsgTotalCost,
            savings: r.realSavings,
            efficiencyGain: r.efficiencyGain,
            hoursReclaimed: r.hoursReclaimed,
            roi: r.roi,
            overheadRatio: results.overheadRatio,
            costBreakdown: employeeCost.costBreakdown,
            diagnosticScore: Math.round(diagnosticResults.inefficiencyPercent * 100),
            diagnosticFindings: diagnosticResults.findings,
            keyIssues: diagnosticResults.keyIssues,
            timeWasteHours: diagnosticResults.timeWasteHours,
            taskAllocations,
            primaryGoal: formData.primaryGoal,
            targetEfficiency: formData.targetEfficiency,
            timeline: formData.timeline,
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to submit');
        setSubmitStatus({ type: 'success', message: t('submitSuccess') });
      } catch (error) {
        setSubmitStatus({ type: 'error', message: error instanceof Error ? error.message : 'Failed to submit.' });
      } finally {
        setIsSubmitting(false);
      }
    }
    submitLead();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-navy-50">
      {/* ═══ Navy Banner ═══ */}
      <div className="bg-navy py-4 text-center text-white">
        <h1 className="font-poppins text-lg font-bold tracking-tight">{t("pageTitle")}</h1>
        <p className="mt-0.5 text-xs text-white/70">{t("resultsTitle")}</p>
      </div>

      {/* ═══ Section 1: Goal-Aligned Header & KPIs ═══ */}
      <div className="px-4 pt-6 pb-0 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className={`rounded-2xl bg-gradient-to-r ${goalCfg.headerGradient} p-6 text-center text-white shadow-lg sm:p-8`}>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              {renderIcon(goalCfg.icon, 'inline h-5 w-5')} {t('reportFor', { goal: t(`goals.${formData.primaryGoal}.label`), team: selectedTeam ? t(`teams.${selectedTeam.id}.name`) : '' })}
            </h2>
            <p className="mt-1 text-xs opacity-80 sm:text-sm">
              {t('preparedFor', { company: formData.companyName, country: t(`countries.${formData.selectedCountry}.name`), size: results.teamSize, currency: t(`currencies.${c}.name`) })}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">{profile.flag} {t(`countries.${formData.selectedCountry}.name`)}</span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">{t('maturityBadge', { level: t(`maturity.${formData.teamMaturity}.label`) })}</span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">{formData.timeline.replace('_', ' ')}</span>
            </div>

            {/* Goal KPIs */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {goalKPIs.map((kpi, i) => (
                <div key={i} className="rounded-xl border border-white/20 bg-white/10 p-3 text-center">
                  <div className="text-xl font-bold tracking-tight sm:text-2xl">{kpi.value}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider opacity-75">{t(`goals.${formData.primaryGoal}.kpi${i+1}Label`)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Goal Narrative */}
          <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm leading-relaxed text-gray-700">
              {t('goalNarrative')} <strong>{t(`goals.${formData.primaryGoal}.leadNarrative`)}</strong> {t('goalNarrativeFor', { size: results.teamSize, team: selectedTeam ? t(`teams.${selectedTeam.id}.name`).toLowerCase() : 'team' })}
              {t('currentEffLabel')} <strong>{currentSituation.currentEfficiency}%</strong> {t('efficiencyWith')}{' '}
              <strong>{formatCurrency(currentSituation.teamCost, c)}</strong> {t('annualCostLabel')}
              {t('bsgCanDeliver')} <strong>{withBSG.bsgEfficiency}%</strong> {t('efficiencyAt')}{' '}
              <strong>{formatCurrency(withBSG.bsgTotalCost, c)}</strong>,{' '}
              {r.isPositiveSavings
                ? <>{t('savingAnnually', { amount: '' })}<strong>{formatCurrency(r.realSavings, c)}</strong></>
                : <>{t('qualityInvestmentOf', { amount: '' })}<strong>{formatCurrency(Math.abs(r.realSavings), c)}</strong></>
              } {t('whileReclaiming', { hours: r.hoursReclaimed })}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-4 px-4 py-4 sm:px-6">

        {/* ═══ Section 2: Diagnostic Findings ═══ */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Search className="h-5 w-5 text-gray-600" />
            <div>
              <h3 className="text-sm font-semibold text-gray-800">{t('diagnosticFindings')}</h3>
              <p className="text-[10px] text-gray-500">{t('diagnosticFindingsDesc')}</p>
            </div>
          </div>
          {diagnosticResults.findings.length > 0 ? (
            <div className="space-y-2">
              {diagnosticResults.findings.map((f, i) => {
                const isHigh = f.impactScore >= 80;
                const isMed = f.impactScore >= 50 && f.impactScore < 80;
                const cardClass = isHigh ? 'border-red-200 bg-red-50' : isMed ? 'border-amber-200 bg-amber-50' : 'border-green-200 bg-green-50';
                const badgeClass = isHigh ? 'text-red-700' : isMed ? 'text-amber-700' : 'text-green-700';
                const answerBg = isHigh ? 'bg-red-100 text-red-800' : isMed ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800';

                return (
                  <div key={i} className={`flex items-start gap-3 rounded-xl border p-3 ${cardClass}`}>
                    <div className="w-12 shrink-0 text-center">
                      <div className={`text-[9px] font-bold uppercase tracking-wider ${badgeClass}`}>
                        {isHigh ? t('impactHigh') : isMed ? t('impactMedium') : t('impactOk')}
                      </div>
                      <div className={`text-base font-bold ${badgeClass}`}>{f.timeWasteMinutes}</div>
                      <div className="text-[8px] text-gray-500">{t('minPerWeek')}</div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-800">{selectedTeam ? t(`teams.${selectedTeam.id}.name`) : f.area}</p>
                      <p className="mt-0.5 text-[10px] text-gray-500">{selectedTeam ? t(`teams.${selectedTeam.id}.questions.${f.questionIndex}.question`) : f.question}</p>
                      <span className={`mt-1.5 inline-block rounded px-2 py-0.5 text-[10px] font-medium ${answerBg}`}>
                        {selectedTeam ? t(`teams.${selectedTeam.id}.questions.${f.questionIndex}.options.${f.answerIndex}`) : f.answer}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">{t('noDiagnosticFindings')}</p>
          )}
        </div>

        {/* ═══ Section 3: Task Handover Map ═══ */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
            <ArrowLeftRight className="h-5 w-5 text-gray-600" />
            <div>
              <h3 className="text-sm font-semibold text-gray-800">{t('taskHandoverMap')}</h3>
              <p className="text-[10px] text-gray-500">{t('taskHandoverDesc')}</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {/* BSG Absorbs */}
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <h4 className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-green-800">
                <CircleCheckBig className="h-4 w-4" /> {t('bsgAbsorbs', { pct: taskHandover.bsgTotalPct, hours: taskHandover.bsgHoursPerWeek })}
              </h4>
              {taskHandover.bsgTasks.map((item, i) => (
                <div key={i} className="mb-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-gray-700">{selectedTeam ? t(`teams.${selectedTeam.id}.tasks.${item.taskId}`) : item.name}</span>
                    <span className="font-bold text-green-700">{item.pct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full rounded-full bg-green-500" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            {/* Client Retains */}
            <div className="rounded-xl border border-navy-200 bg-navy-50 p-4">
              <h4 className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-navy">
                <Building className="h-4 w-4" /> {t('clientRetains', { pct: taskHandover.clientTotalPct, hours: taskHandover.clientHoursPerWeek })}
              </h4>
              {taskHandover.clientTasks.map((item, i) => (
                <div key={i} className="mb-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-gray-700">{selectedTeam ? t(`teams.${selectedTeam.id}.tasks.${item.taskId}`) : item.name}</span>
                    <span className="font-bold text-navy">{item.pct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full rounded-full bg-navy" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-2 text-[10px] leading-relaxed text-gray-500">
            <strong>{t('noteLabel')}</strong> {t('taskHandoverNote')}
          </p>
        </div>

        {/* ═══ Section 4: Financial Impact ═══ */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Coins className="h-5 w-5 text-gray-600" />
            <div>
              <h3 className="text-sm font-semibold text-gray-800">{t('financialImpact')}</h3>
              <p className="text-[10px] text-gray-500">{t('financialImpactDesc')}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Savings Box */}
            <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-green-800">
                {r.isPositiveSavings ? t('annualSavingsLabel') : t('qualityInvestment')}
              </h4>
              <div className="text-2xl font-bold text-green-700">{formatCurrency(Math.abs(r.realSavings), c)}</div>
              <div className="mt-2 space-y-1 text-[11px] text-gray-600">
                <div>{t('currentTeamCost', { amount: formatCurrency(currentSituation.teamCost, c) })}</div>
                <div>{t('bsgPartnershipCost', { amount: formatCurrency(withBSG.bsgTotalCost, c) })}</div>
                <div>{t('savingsRange', { min: formatCurrency(r.savingsRange.min, c), max: formatCurrency(r.savingsRange.max, c) })}</div>
              </div>
            </div>
            {/* Investment Box */}
            <div className="rounded-xl border border-navy-200 bg-gradient-to-br from-navy-50 to-white p-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-navy">{t('bsgInvestment')}</h4>
              <div className="text-2xl font-bold text-navy">{formatCurrency(withBSG.bsgTotalCost, c)}</div>
              <div className="mt-2 space-y-1 text-[11px] text-gray-600">
                <div>{t('perEmployeeYr', { amount: formatCurrency(withBSG.bsgCostPerEmployee, c) })}</div>
                <div>{t('bsgRateLabel', { rate: Math.round(results.bsgRateUsed * 100) })}</div>
                <div>{t('efficiencyGuarantee', { pct: withBSG.bsgEfficiency })}</div>
              </div>
            </div>
          </div>

          {/* ROI Strip */}
          <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-gradient-to-r from-navy to-navy-dark p-3 text-center text-white sm:grid-cols-4">
            <div>
              <div className="text-sm font-bold sm:text-base">{formatCurrency(withBSG.bsgTotalCost, c)}</div>
              <div className="text-[9px] uppercase tracking-wider opacity-70 sm:text-[10px]">{t('investmentLabel')}</div>
            </div>
            <div>
              <div className="text-sm font-bold sm:text-base">{formatCurrency(Math.abs(r.realSavings), c)}</div>
              <div className="text-[9px] uppercase tracking-wider opacity-70 sm:text-[10px]">{r.isPositiveSavings ? t('savingsLabel') : t('upliftLabel')}</div>
            </div>
            <div>
              <div className="text-sm font-bold sm:text-base">{r.roi > 0 ? `${r.roi}%` : 'N/A'}</div>
              <div className="text-[9px] uppercase tracking-wider opacity-70 sm:text-[10px]">{t('roiLabel')}</div>
            </div>
            <div>
              <div className="text-sm font-bold sm:text-base">+{r.efficiencyGain}%</div>
              <div className="text-[9px] uppercase tracking-wider opacity-70 sm:text-[10px]">{t('efficiencyLabel')}</div>
            </div>
          </div>

          {/* Cost breakdown per employee */}
          <div className="mt-3">
            <p className="mb-2 text-xs font-semibold text-gray-700">{t('perEmployeeCostBreakdown', { country: t(`countries.${formData.selectedCountry}.name`) })}</p>
            <div className="grid gap-1.5 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-600">{t('baseSalary')}</span>
                  <span className="font-semibold">{formatCurrency(employeeCost.fullSalary, c)}</span>
                </div>
              </div>
              {Object.entries(employeeCost.costBreakdown).map(([key, item]) => (
                <div key={key} className="rounded-lg bg-gray-50 p-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-gray-600">{renderIcon(item.icon || '', 'h-3 w-3')} {t(`countries.${formData.selectedCountry}.costCategories.${key}.label`)}</span>
                    <span className="font-semibold">{formatCurrency(item.value, c)}</span>
                  </div>
                </div>
              ))}
              <div className="rounded-lg bg-navy-50 p-2 sm:col-span-2">
                <div className="flex justify-between text-[11px]">
                  <span className="font-semibold text-navy">{t('trueCostPerEmployee')}</span>
                  <span className="font-bold text-navy">{formatCurrency(employeeCost.trueCost, c)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Section 5: Implementation Roadmap ═══ */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Map className="h-5 w-5 text-gray-600" />
            <div>
              <h3 className="text-sm font-semibold text-gray-800">{t('implementationRoadmap')}</h3>
              <p className="text-[10px] text-gray-500">{t(`maturity.${formData.teamMaturity}.label`)} {t('maturityArrow')} {t(`maturity.${formData.teamMaturity}.recommendation`)}</p>
            </div>
          </div>
          <p className="mb-3 text-xs text-gray-600">{t(`maturity.${formData.teamMaturity}.description`)}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {roadmap.map((phase) => (
              <div key={phase.number} className="rounded-xl border border-gray-200 p-4 text-center">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-navy-100 text-sm font-bold text-navy">
                  {phase.number}
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-navy-600">{phase.monthRange}</div>
                <div className="mt-1 text-sm font-bold text-gray-800">{t(`maturity.${formData.teamMaturity}.phase${phase.number}`)}</div>
                <div className="mt-2 text-xs text-gray-500">
                  {t('accruedSavings', { amount: formatCurrency(Math.max(0, phase.accruedSavings), c) })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ Section 6: Methodology & Caveats ═══ */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
            <FileText className="h-5 w-5 text-gray-600" />
            <div>
              <h3 className="text-sm font-semibold text-gray-800">{t('methodology')}</h3>
              <p className="text-[10px] text-gray-500">{t('methodologyDesc')}</p>
            </div>
          </div>
          <div className="space-y-2 text-xs text-gray-600">
            <p><strong>{t('countryModel')}</strong> {t(`countries.${formData.selectedCountry}.methodologyNote`)}</p>
            <p>{t('bsgRateNote', { rate: Math.round(results.bsgRateUsed * 100) })}</p>
            <p>{t('inefficiencyScore', { count: diagnosticResults.findings.length })}</p>
            <p>{t('maturityAdjustment', { level: formData.teamMaturity, label: t(`maturity.${formData.teamMaturity}.label`), modifier: (4 - parseInt(formData.teamMaturity)) * 1 })}</p>
            <p>{t('savingsRangeNote')}</p>
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[10px] text-amber-800">
              <strong>{t('importantLabel')}</strong> {t('methodologyDisclaimer', { country: t(`countries.${formData.selectedCountry}.name`), currency: t(`currencies.${c}.name`) })}
            </div>
          </div>
        </div>

        {/* ═══ CTA & Actions ═══ */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm print:hidden">
          <h2 className="mb-4 text-lg font-bold text-gray-800">{t('transformOperations', { team: selectedTeam ? t(`teams.${selectedTeam.id}.name`) : '' })}</h2>

          {isSubmitting && (
            <div className="mb-4 flex items-center justify-center gap-2 text-sm text-navy">
              <Loader2 className="h-5 w-5 animate-spin" />
              {t('submittingAnalysis')}
            </div>
          )}

          {submitStatus && (
            <div className={`mb-4 rounded-lg p-3 text-sm ${
              submitStatus.type === 'success' ? 'border border-green-200 bg-green-50 text-green-700' : 'border border-red-200 bg-red-50 text-red-700'
            }`}>
              {submitStatus.message}
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3">
            <PDFDownloadLink
              document={
                <CalculatorResultsPDF
                  results={results}
                  formData={formData}
                  selectedTeam={selectedTeam}
                  roleId={roleId}
                  locale={locale}
                  translations={{
                    analysis: t('pdfAnalysis'),
                    keyMetrics: t('pdfKeyMetrics'),
                    bsgRecommends: t('pdfBsgRecommends', { narrative: t(`goals.${formData.primaryGoal}.leadNarrative`), size: results.teamSize, team: selectedTeam ? t(`teams.${selectedTeam.id}.name`).toLowerCase() : 'team' }),
                    currentEfficiency: t('pdfCurrentEfficiency', { pct: currentSituation.currentEfficiency, cost: formatCurrency(currentSituation.teamCost, c) }),
                    withBsg: t('pdfWithBsg', { pct: withBSG.bsgEfficiency, cost: formatCurrency(withBSG.bsgTotalCost, c) }),
                    saving: t('pdfSaving', { amount: formatCurrency(r.realSavings, c) }),
                    diagnosticFindings: t('diagnosticFindings'),
                    high: t('impactHigh'),
                    med: t('impactMedium'),
                    ok: t('impactOk'),
                    minPerWeek: t('minPerWeek'),
                    taskHandoverMap: t('taskHandoverMap'),
                    bsgAbsorbs: t('bsgAbsorbs', { pct: taskHandover.bsgTotalPct, hours: taskHandover.bsgHoursPerWeek }),
                    clientRetains: t('clientRetains', { pct: taskHandover.clientTotalPct, hours: taskHandover.clientHoursPerWeek }),
                    financialImpact: t('pdfFinancialImpact'),
                    financialSummary: t('pdfFinancialSummary'),
                    annualSavings: t('annualSavingsLabel'),
                    qualityInvestment: t('qualityInvestment'),
                    range: t('pdfRange', { min: formatCurrency(r.savingsRange.min, c), max: formatCurrency(r.savingsRange.max, c) }),
                    bsgInvestment: t('bsgInvestment'),
                    perEmployee: t('pdfPerEmployee', { amount: formatCurrency(withBSG.bsgCostPerEmployee, c) }),
                    investment: t('investmentLabel'),
                    savings: t('savingsLabel'),
                    uplift: t('upliftLabel'),
                    roi: t('roiLabel'),
                    efficiency: t('efficiencyLabel'),
                    costBreakdown: t('perEmployeeCostBreakdown', { country: t(`countries.${formData.selectedCountry}.name`) }),
                    baseSalary: t('baseSalary'),
                    trueCostPerEmployee: t('trueCostPerEmployee'),
                    metric: t('pdfMetric'),
                    current: t('pdfCurrent'),
                    withBSG: t('pdfWithBSG'),
                    change: t('pdfChange'),
                    annualCost: t('pdfAnnualCost'),
                    hoursWasted: t('pdfHoursWasted'),
                    implementationRoadmap: t('pdfImplementationRoadmap', { maturity: t(`maturity.${formData.teamMaturity}.label`) }),
                    savingsLabel: t('pdfSavingsLabel', { amount: '{amount}' }),
                    methodology: t('pdfMethodology'),
                    bsgRateNote: t('pdfBsgRateNote', { rate: Math.round(results.bsgRateUsed * 100) }),
                    inefficiencyCapped: t('pdfInefficiencyCapped', { level: formData.teamMaturity, label: t(`maturity.${formData.teamMaturity}.label`) }),
                    savingsRangeNote: t('pdfSavingsRangeNote', { currency: t(`currencies.${c}.name`) }),
                    disclaimer: t('pdfDisclaimer'),
                    reportGenerated: t('pdfReportGenerated', { date: new Date().toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }),
                    // Config-translated props
                    teamName: selectedTeam ? t(`teams.${selectedTeam.id}.name`) : '',
                    goalLabel: t(`goals.${formData.primaryGoal}.label`),
                    countryName: t(`countries.${formData.selectedCountry}.name`),
                    currencyName: t(`currencies.${c}.name`),
                    staffLabel: t('staff'),
                    kpiLabels: goalKPIs.map((_, i) => t(`goals.${formData.primaryGoal}.kpi${i + 1}Label`)),
                    findingTexts: diagnosticResults.findings.slice(0, 5).map(f => ({
                      area: selectedTeam ? t(`teams.${selectedTeam.id}.name`) : f.area,
                      answer: selectedTeam ? t(`teams.${selectedTeam.id}.questions.${f.questionIndex}.options.${f.answerIndex}`) : f.answer,
                    })),
                    bsgTaskNames: taskHandover.bsgTasks.slice(0, 5).map(item => selectedTeam ? t(`teams.${selectedTeam.id}.tasks.${item.taskId}`) : item.name),
                    clientTaskNames: taskHandover.clientTasks.slice(0, 5).map(item => selectedTeam ? t(`teams.${selectedTeam.id}.tasks.${item.taskId}`) : item.name),
                    costCategoryLabels: Object.fromEntries(Object.keys(employeeCost.costBreakdown).map(key => [key, t(`countries.${formData.selectedCountry}.costCategories.${key}.label`)])),
                    phaseNames: roadmap.map(phase => t(`maturity.${formData.teamMaturity}.phase${phase.number}`)),
                    maturityDescription: t(`maturity.${formData.teamMaturity}.description`),
                    countryMethodologyNote: t(`countries.${formData.selectedCountry}.methodologyNote`),
                    efficiencyRow: t('efficiencyLabel'),
                  }}
                />
              }
              fileName={`BSG-${selectedTeam ? t(`teams.${selectedTeam.id}.name`) : 'Team'}-Analysis-${formData.companyName || 'Report'}.pdf`}
              className="inline-flex items-center rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-gold-dark hover:shadow-lg"
            >
              {({ loading }) => loading ? t('preparingPDF') : t('downloadPDF')}
            </PDFDownloadLink>
            <a
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow"
            >
              <MessageSquare className="h-4 w-4" /> {t("getInTouch")}
            </a>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center rounded-lg bg-navy px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-navy-dark hover:shadow-lg"
            >
              <ArrowLeft className="h-4 w-4" /> {t("backToCalculator")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
