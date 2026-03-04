'use client';

import { useState, useMemo, useCallback } from 'react';
import type { CurrencyCode, RoleLevelId, FormDataState } from '@/lib/calculator/types';
import {
  currencies,
  roleDefaults,
  teams,
  teamQuestions,
  initialFormData,
} from '@/lib/calculator/constants';
import {
  formatCurrency,
  calculateEmployeeCost,
  calculateEfficiency,
} from '@/lib/calculator/calculations';
import { validateStep } from '@/lib/calculator/validation';
import CalculatorResults from './CalculatorResults';

const STEP_TITLES = [
  'Select Your Team',
  'Role & Team Size',
  'Cost Breakdown',
  'Task Allocation',
  'Team Diagnostics',
  'Goals & Timeline',
  'Contact Information',
];

export default function CalculatorClient() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormDataState>(initialFormData);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleLevelId | ''>('');
  const [taskAllocations, setTaskAllocations] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const currentTeam = useMemo(() => teams.find((t) => t.id === selectedTeam), [selectedTeam]);
  const currentRoleDefaults = useMemo(
    () => (selectedRole ? roleDefaults[selectedRole] : undefined),
    [selectedRole],
  );

  const totalAllocation = useMemo(
    () => Object.values(taskAllocations).reduce((sum, v) => sum + v, 0),
    [taskAllocations],
  );

  const employeeCost = useMemo(
    () => calculateEmployeeCost(formData, currentRoleDefaults),
    [formData, currentRoleDefaults],
  );

  const updateField = useCallback(
    (field: keyof FormDataState, value: string | boolean | Record<number, number>) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleCurrencyChange = useCallback(
    (code: CurrencyCode) => {
      setFormData((prev) => {
        const next = { ...prev, selectedCurrency: code };
        if (selectedRole) {
          const rd = roleDefaults[selectedRole];
          next.fullSalary = String(rd.salaries[code]);
          if (!prev.visaCostsCustom) next.visaCosts = String(rd.overheads[code].visaCosts);
          if (!prev.insuranceCustom) next.insurance = String(rd.overheads[code].insurance);
          if (!prev.trainingCustom) next.training = String(rd.overheads[code].training);
          if (!prev.equipmentCustom) next.equipment = String(rd.overheads[code].equipment);
          if (!prev.officeSpaceCustom) next.officeSpace = String(rd.overheads[code].officeSpace);
          if (!prev.annualFlightCustom) next.annualFlight = String(rd.overheads[code].annualFlight);
        }
        return next;
      });
    },
    [selectedRole],
  );

  const handleRoleChange = useCallback(
    (roleId: RoleLevelId) => {
      setSelectedRole(roleId);
      const rd = roleDefaults[roleId];
      const c = formData.selectedCurrency;
      setFormData((prev) => ({
        ...prev,
        fullSalary: String(rd.salaries[c]),
        visaCosts: String(rd.overheads[c].visaCosts),
        insurance: String(rd.overheads[c].insurance),
        training: String(rd.overheads[c].training),
        equipment: String(rd.overheads[c].equipment),
        officeSpace: String(rd.overheads[c].officeSpace),
        annualFlight: String(rd.overheads[c].annualFlight),
      }));
    },
    [formData.selectedCurrency],
  );

  const handleTeamSelect = useCallback((teamId: string) => {
    setSelectedTeam(teamId);
    const team = teams.find((t) => t.id === teamId);
    if (team) {
      const allocs: Record<string, number> = {};
      team.tasks.forEach((t) => {
        allocs[t.id] = t.default;
      });
      setTaskAllocations(allocs);
    }
  }, []);

  const handleNext = () => {
    if (!validateStep(currentStep, formData, selectedTeam, selectedRole, totalAllocation)) {
      setErrors(['Please complete all required fields before proceeding.']);
      return;
    }
    setErrors([]);
    if (currentStep < STEP_TITLES.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    setErrors([]);
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  if (showResults) {
    const results = calculateEfficiency(formData, currentTeam, currentRoleDefaults);
    return (
      <CalculatorResults
        results={results}
        formData={formData}
        selectedTeam={currentTeam}
        selectedRole={currentRoleDefaults}
        onBack={() => setShowResults(false)}
      />
    );
  }

  // Hero layout for Step 0, standard layout for other steps
  const isHeroStep = currentStep === 0;

  return (
    <section className={isHeroStep ? 'min-h-screen bg-navy' : 'bg-gray-50 py-12 text-gray-900'}>
      {isHeroStep ? (
        /* ═══════════════════════════════════════════════════════════════════
           HERO LAYOUT - Two Column Split (Step 0 Only)
           ═══════════════════════════════════════════════════════════════════ */
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: Headline & Value Proposition */}
            <div className="text-center lg:text-left">
              <h1 className="font-poppins text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                Calculate Your Cost Savings in{' '}
                <span className="text-gold">1 Minute</span>
              </h1>
              <p className="mt-4 text-lg text-white/70 md:text-xl">
                See exactly how much you can save by outsourcing to{' '}
                <span className="font-semibold text-white">Backsure Global Support</span>
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
                <div className="flex items-center gap-2 text-white/60">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-gold">
                    ✓
                  </span>
                  <span className="text-sm">Quick & Easy</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-gold">
                    ✓
                  </span>
                  <span className="text-sm">Free Analysis</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-gold">
                    ✓
                  </span>
                  <span className="text-sm">No Commitment</span>
                </div>
              </div>
            </div>

            {/* Right: Floating Form Card */}
            <div className="relative">
              <div className="rounded-2xl bg-white p-6 shadow-2xl md:p-8">
                <h2 className="mb-2 font-poppins text-xl font-semibold text-navy">
                  {STEP_TITLES[currentStep]}
                </h2>
                <p className="mb-6 text-sm text-gray-500">
                  Select your team type to get started with your personalized cost analysis
                </p>

                {/* Errors */}
                {errors.length > 0 && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {errors.map((e, i) => (
                      <p key={i}>{e}</p>
                    ))}
                  </div>
                )}

                {/* Step 0: Team Selection */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {teams.map((team) => (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => handleTeamSelect(team.id)}
                      className={`rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${
                        selectedTeam === team.id
                          ? 'border-navy bg-navy-50 shadow-md'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gold'
                      }`}
                    >
                      <h3 className="font-poppins text-sm font-bold text-navy">{team.name}</h3>
                      <p className="mt-1 text-xs text-gray-500">{team.description}</p>
                      {selectedTeam === team.id && (
                        <span className="mt-2 inline-block rounded-full bg-navy px-2 py-0.5 text-[10px] font-semibold text-white">
                          Selected
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!selectedTeam}
                  className="mt-6 w-full rounded-lg bg-gold px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-gold-dark hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Start Calculating →
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ═══════════════════════════════════════════════════════════════════
           STANDARD LAYOUT - Steps 1-6
           ═══════════════════════════════════════════════════════════════════ */
        <div className="mx-auto max-w-4xl px-4">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="font-poppins text-2xl font-bold text-navy md:text-3xl">
              Team Efficiency Calculator
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Step {currentStep + 1} of {STEP_TITLES.length}
            </p>
          </div>

          {/* Simplified Progress Bar */}
          <div className="mb-8">
            <div className="relative h-2 rounded-full bg-gray-200">
              <div
                className="absolute left-0 top-0 h-2 rounded-full bg-gradient-to-r from-navy to-gold transition-all duration-500"
                style={{ width: `${((currentStep + 1) / STEP_TITLES.length) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-center text-xs text-gray-500">
              {STEP_TITLES[currentStep]}
            </p>
          </div>

          {/* Step Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg md:p-8">
            <h2 className="mb-6 font-poppins text-xl font-semibold text-navy">
              {STEP_TITLES[currentStep]}
            </h2>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {errors.map((e, i) => (
                  <p key={i}>{e}</p>
                ))}
              </div>
            )}

            {/* ── Step 1: Role & Team Size ── */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Select Role Level</label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {(Object.keys(roleDefaults) as RoleLevelId[]).map((id) => {
                      const role = roleDefaults[id];
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => handleRoleChange(id)}
                          className={`rounded-xl border-2 p-4 text-left transition-all ${
                            selectedRole === id
                              ? 'border-navy bg-navy-50 shadow-md'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gold'
                          }`}
                        >
                          <h4 className="font-poppins text-sm font-bold text-navy">{role.name}</h4>
                          <p className="mt-1 text-xs text-gold-dark">
                            {formatCurrency(role.salaries[formData.selectedCurrency], formData.selectedCurrency)}/yr
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Team Size *</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={formData.teamSize}
                    onChange={(e) => updateField('teamSize', e.target.value)}
                    className="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-navy focus:ring-1 focus:ring-navy"
                    placeholder="e.g. 10"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Team Maturity (1-4)
                  </label>
                  <select
                    value={formData.teamMaturity}
                    onChange={(e) => updateField('teamMaturity', e.target.value)}
                    className="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-navy focus:ring-1 focus:ring-navy"
                  >
                    <option value="">Select maturity level</option>
                    <option value="1">1 - Newly formed team</option>
                    <option value="2">2 - Developing processes</option>
                    <option value="3">3 - Established team</option>
                    <option value="4">4 - High-performing team</option>
                  </select>
                </div>
              </div>
            )}

            {/* ── Step 2: Cost Breakdown ── */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="rounded-lg border border-navy-100 bg-navy-50 p-4">
                  <h3 className="text-sm font-semibold text-navy">Annual Salary</h3>
                  <input
                    type="number"
                    value={formData.fullSalary}
                    onChange={(e) => updateField('fullSalary', e.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-navy focus:ring-1 focus:ring-navy"
                    placeholder="Annual salary"
                  />
                </div>

                <h3 className="font-poppins text-sm font-semibold text-navy">
                  Overhead Costs (Annual)
                </h3>
                {[
                  { key: 'visaCosts', label: 'Visa & Work Permit Costs' },
                  { key: 'insurance', label: 'Health Insurance' },
                  { key: 'training', label: 'Training & Development' },
                  { key: 'equipment', label: 'Equipment & Software' },
                  { key: 'officeSpace', label: 'Office Space & Utilities' },
                  { key: 'leaveSalary', label: 'Leave Salary' },
                  { key: 'annualFlight', label: 'Annual Flight Charges' },
                  { key: 'eosGratuity', label: 'End of Service Gratuity' },
                ].map(({ key, label }) => {
                  const customKey = `${key}Custom` as keyof FormDataState;
                  const isCustom = formData[customKey] as boolean;
                  const isAutoCalc = (key === 'eosGratuity' || key === 'leaveSalary') && !isCustom;
                  const fieldVal = key === 'eosGratuity' && !isCustom
                    ? String(employeeCost.autoEosGratuity)
                    : key === 'leaveSalary' && !isCustom
                      ? String(employeeCost.autoLeaveSalary)
                      : (formData[key as keyof FormDataState] as string);
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
                        <input
                          type="number"
                          value={fieldVal}
                          onChange={(e) => {
                            updateField(key as keyof FormDataState, e.target.value);
                            if (!isCustom) updateField(customKey, true);
                          }}
                          disabled={isAutoCalc}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-navy focus:ring-1 focus:ring-navy disabled:bg-gray-100 disabled:text-gray-500"
                        />
                      </div>
                      <label className="flex items-center gap-1 pt-5 text-xs text-gray-500">
                        <input
                          type="checkbox"
                          checked={isCustom}
                          onChange={(e) => updateField(customKey, e.target.checked)}
                          className="rounded border-gray-300 text-navy focus:ring-navy"
                        />
                        Custom
                      </label>
                    </div>
                  );
                })}
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Other Costs</label>
                  <input
                    type="number"
                    value={formData.otherCosts}
                    onChange={(e) => updateField('otherCosts', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-navy focus:ring-1 focus:ring-navy"
                  />
                </div>

                {/* Cost Summary */}
                <div className="mt-4 rounded-xl bg-gradient-to-r from-navy to-navy-dark p-4 text-white">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-white/60">Salary</p>
                      <p className="font-poppins text-sm font-bold">
                        {formatCurrency(employeeCost.fullSalary, formData.selectedCurrency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Overheads</p>
                      <p className="font-poppins text-sm font-bold text-gold">
                        {formatCurrency(employeeCost.totalOverheads, formData.selectedCurrency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60">True Cost</p>
                      <p className="font-poppins text-sm font-bold text-gold-light">
                        {formatCurrency(employeeCost.trueCost, formData.selectedCurrency)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 3: Task Allocation ── */}
            {currentStep === 3 && currentTeam && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Adjust task time allocation for your <strong>{currentTeam.name}</strong>. Total should be ~100%.
                </p>
                {currentTeam.tasks.map((task) => (
                  <div key={task.id}>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">{task.name}</label>
                      <span className="text-sm font-bold text-navy">{taskAllocations[task.id] ?? task.default}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={taskAllocations[task.id] ?? task.default}
                      onChange={(e) =>
                        setTaskAllocations((prev) => ({ ...prev, [task.id]: Number(e.target.value) }))
                      }
                      className="mt-1 w-full accent-navy"
                    />
                  </div>
                ))}
                <div
                  className={`rounded-lg p-3 text-center text-sm font-semibold ${
                    totalAllocation >= 98 && totalAllocation <= 102
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  Total: {totalAllocation}%{' '}
                  {totalAllocation >= 98 && totalAllocation <= 102 ? '(Valid)' : '(Adjust to ~100%)'}
                </div>
              </div>
            )}

            {/* ── Step 4: Diagnostics ── */}
            {currentStep === 4 && currentTeam && (() => {
              const questions = teamQuestions[currentTeam.id] || [];
              const answeredCount = Object.keys(formData.diagnosticAnswers).length;
              return (
                <div className="space-y-3">
                  {/* Legend Bar */}
                  <div className="flex flex-wrap items-center gap-4 rounded-lg bg-gray-50 px-4 py-2">
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className="h-2.5 w-2.5 rounded-full bg-green-500" /> Best Practice
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Mixed
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Needs Work
                    </span>
                  </div>

                  {/* Questions */}
                  {questions.map((q, qIdx) => {
                    const isAnswered = formData.diagnosticAnswers[qIdx] !== undefined;
                    return (
                      <div
                        key={qIdx}
                        className={`rounded-lg border p-3 transition-all ${
                          isAnswered ? 'border-gray-100 bg-gray-50/30' : 'border-gray-200'
                        }`}
                      >
                        {/* Question header with number badge and checkmark */}
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-snug text-navy">
                            <span className="mr-2 rounded bg-navy/10 px-1.5 py-0.5 text-[10px] font-bold text-navy">
                              Q{qIdx + 1}
                            </span>
                            {q.question}
                          </p>
                          {isAnswered && (
                            <span className="shrink-0 text-xs font-medium text-green-600">✓</span>
                          )}
                        </div>

                        {/* Desktop: Horizontal 3-column */}
                        <div className="mt-2 hidden gap-1.5 md:grid md:grid-cols-3">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = formData.diagnosticAnswers[qIdx] === oIdx;
                            const selectedColors =
                              oIdx === 0
                                ? 'border-green-500 bg-green-50 text-green-800'
                                : oIdx === 1
                                  ? 'border-amber-400 bg-amber-50 text-amber-800'
                                  : 'border-red-400 bg-red-50 text-red-800';
                            const dotColor =
                              oIdx === 0 ? 'bg-green-500' : oIdx === 1 ? 'bg-amber-400' : 'bg-red-500';

                            return (
                              <label
                                key={oIdx}
                                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-all focus-within:ring-2 focus-within:ring-navy focus-within:ring-offset-1 ${
                                  isSelected
                                    ? `${selectedColors} font-medium`
                                    : 'border-gray-200 text-gray-600 hover:border-gold'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`q-${qIdx}`}
                                  checked={isSelected}
                                  onChange={() =>
                                    updateField('diagnosticAnswers', {
                                      ...formData.diagnosticAnswers,
                                      [qIdx]: oIdx,
                                    })
                                  }
                                  className="sr-only"
                                />
                                <span
                                  className={`h-2 w-2 shrink-0 rounded-full ${dotColor} ${
                                    isSelected ? 'opacity-100' : 'opacity-40'
                                  }`}
                                />
                                <span className="line-clamp-2">{opt.label}</span>
                              </label>
                            );
                          })}
                        </div>

                        {/* Mobile: Stacked */}
                        <div className="mt-2 flex flex-col gap-1 md:hidden">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = formData.diagnosticAnswers[qIdx] === oIdx;
                            const selectedColors =
                              oIdx === 0
                                ? 'border-green-500 bg-green-50 text-green-800'
                                : oIdx === 1
                                  ? 'border-amber-400 bg-amber-50 text-amber-800'
                                  : 'border-red-400 bg-red-50 text-red-800';
                            const dotColor =
                              oIdx === 0 ? 'bg-green-500' : oIdx === 1 ? 'bg-amber-400' : 'bg-red-500';

                            return (
                              <label
                                key={oIdx}
                                className={`flex min-h-[44px] cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-xs transition-all ${
                                  isSelected
                                    ? `${selectedColors} font-medium`
                                    : 'border-gray-200 text-gray-600 hover:border-gold'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`q-mobile-${qIdx}`}
                                  checked={isSelected}
                                  onChange={() =>
                                    updateField('diagnosticAnswers', {
                                      ...formData.diagnosticAnswers,
                                      [qIdx]: oIdx,
                                    })
                                  }
                                  className="sr-only"
                                />
                                <span
                                  className={`h-2 w-2 shrink-0 rounded-full ${dotColor} ${
                                    isSelected ? 'opacity-100' : 'opacity-40'
                                  }`}
                                />
                                <span>{opt.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* Progress Footer */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-xs text-gray-500">{answeredCount} of 5 answered</span>
                    <div className="h-1.5 w-32 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-navy to-gold transition-all"
                        style={{ width: `${(answeredCount / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ── Step 5: Goals ── */}
            {currentStep === 5 && (() => {
              const goalsCompleted = [
                formData.primaryGoal,
                formData.targetEfficiency,
                formData.timeline,
              ].filter(Boolean).length;

              const goalOptions = [
                { value: 'Reduce operational costs', icon: '💰' },
                { value: 'Improve team productivity', icon: '📈' },
                { value: 'Scale operations efficiently', icon: '🚀' },
                { value: 'Enhance service quality', icon: '⭐' },
              ];

              const efficiencyOptions = [
                { value: '5-10%', label: '5-10%' },
                { value: '10-20%', label: '10-20%' },
                { value: '20-30%', label: '20-30%' },
                { value: '30%+', label: '30%+' },
              ];

              const timelineOptions = [
                { value: 'Immediate', label: '1-2 months' },
                { value: 'Short-term', label: '3-6 months' },
                { value: 'Medium-term', label: '6-12 months' },
                { value: 'Long-term', label: '12+ months' },
              ];

              return (
                <div className="space-y-3">
                  {/* 1. Primary Goal */}
                  <div
                    className={`rounded-lg border p-3 transition-all ${
                      formData.primaryGoal ? 'border-gray-100 bg-gray-50/30' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug text-navy">
                        <span className="mr-2 rounded bg-navy/10 px-1.5 py-0.5 text-[10px] font-bold text-navy">
                          1
                        </span>
                        What is your primary goal?
                      </p>
                      {formData.primaryGoal && (
                        <span className="shrink-0 text-xs font-medium text-green-600">✓</span>
                      )}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-1.5">
                      {goalOptions.map((goal) => (
                        <button
                          key={goal.value}
                          type="button"
                          onClick={() => updateField('primaryGoal', goal.value)}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-all ${
                            formData.primaryGoal === goal.value
                              ? 'border-navy bg-navy-50 font-medium text-navy'
                              : 'border-gray-200 text-gray-600 hover:border-gold'
                          }`}
                        >
                          <span>{goal.icon}</span>
                          <span className="line-clamp-1">{goal.value}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Target Efficiency */}
                  <div
                    className={`rounded-lg border p-3 transition-all ${
                      formData.targetEfficiency ? 'border-gray-100 bg-gray-50/30' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug text-navy">
                        <span className="mr-2 rounded bg-navy/10 px-1.5 py-0.5 text-[10px] font-bold text-navy">
                          2
                        </span>
                        Target efficiency improvement
                      </p>
                      {formData.targetEfficiency && (
                        <span className="shrink-0 text-xs font-medium text-green-600">✓</span>
                      )}
                    </div>
                    <div className="mt-2 grid grid-cols-4 gap-1.5">
                      {efficiencyOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => updateField('targetEfficiency', opt.value)}
                          className={`rounded-lg border px-3 py-2 text-center text-xs transition-all ${
                            formData.targetEfficiency === opt.value
                              ? 'border-gold bg-gold/10 font-medium text-gold-dark'
                              : 'border-gray-200 text-gray-600 hover:border-gold'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Implementation Timeline */}
                  <div
                    className={`rounded-lg border p-3 transition-all ${
                      formData.timeline ? 'border-gray-100 bg-gray-50/30' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug text-navy">
                        <span className="mr-2 rounded bg-navy/10 px-1.5 py-0.5 text-[10px] font-bold text-navy">
                          3
                        </span>
                        Implementation timeline
                      </p>
                      {formData.timeline && (
                        <span className="shrink-0 text-xs font-medium text-green-600">✓</span>
                      )}
                    </div>
                    <div className="mt-2 grid grid-cols-4 gap-1.5">
                      {timelineOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => updateField('timeline', opt.value)}
                          className={`rounded-lg border px-3 py-2 text-center text-xs transition-all ${
                            formData.timeline === opt.value
                              ? 'border-navy bg-navy-50 font-medium text-navy'
                              : 'border-gray-200 text-gray-600 hover:border-gold'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Progress Footer */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-xs text-gray-500">{goalsCompleted} of 3 completed</span>
                    <div className="h-1.5 w-32 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-navy to-gold transition-all"
                        style={{ width: `${(goalsCompleted / 3) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ── Step 6: Contact Info (Now at end) ── */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Almost done! Enter your details to receive your personalized efficiency report.
                </p>
                {/* Currency */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Currency</label>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {(Object.keys(currencies) as CurrencyCode[]).map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleCurrencyChange(code)}
                        className={`rounded-lg border px-3 py-2 text-center text-xs font-medium transition-all ${
                          formData.selectedCurrency === code
                            ? 'border-navy bg-navy text-white'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-navy'
                        }`}
                      >
                        {currencies[code].flag} {code}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Full Name *</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-navy focus:ring-1 focus:ring-navy"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Company Email *</label>
                    <input
                      type="email"
                      value={formData.companyEmail}
                      onChange={(e) => updateField('companyEmail', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-navy focus:ring-1 focus:ring-navy"
                      placeholder="john@company.com"
                    />
                    <p className="mt-1 text-xs text-gray-400">Company email required (no Gmail, Yahoo, etc.)</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Company Name *</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => updateField('companyName', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-navy focus:ring-1 focus:ring-navy"
                      placeholder="Acme Corp"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Mobile Number *</label>
                    <input
                      type="tel"
                      value={formData.mobileNumber}
                      onChange={(e) => updateField('mobileNumber', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-navy focus:ring-1 focus:ring-navy"
                      placeholder="+971 50 123 4567"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
              <button
                type="button"
                onClick={handleBack}
                className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="rounded-lg bg-gradient-to-r from-navy to-navy-dark px-8 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
              >
                {currentStep === STEP_TITLES.length - 1 ? 'Calculate Results' : 'Next Step'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
