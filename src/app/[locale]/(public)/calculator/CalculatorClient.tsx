'use client';

import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import type { CountryCode, RoleLevelId, FormDataState, MaturityLevel, GoalType, EfficiencyTarget, TimelineOption } from '@/lib/calculator/types';
import {
  roleDefaults,
  teams,
  teamQuestions,
  initialFormData,
} from '@/lib/calculator/constants';
import { countryProfiles, countryToCurrencyMap, goalConfigs, maturityConfigs } from '@/lib/calculator/countries';
import {
  formatCurrency,
  calculateEmployeeCost,
  calculateEfficiency,
} from '@/lib/calculator/calculations';
import { validateStep } from '@/lib/calculator/validation';
import { renderIcon } from '@/lib/calculator/icons';
import { Check, CheckCircle, AlertTriangle, ArrowLeft, ArrowRight, Sprout, Leaf, TreePine, Star, Zap, Calendar, Target } from 'lucide-react';
import CalculatorResults from './CalculatorResults';

const TOTAL_STEPS = 7;

const COUNTRY_OPTIONS: { code: CountryCode; name: string; flag: string }[] = [
  { code: 'UAE', name: 'UAE', flag: '\u{1F1E6}\u{1F1EA}' },
  { code: 'DE', name: 'Germany', flag: '\u{1F1E9}\u{1F1EA}' },
  { code: 'UK', name: 'UK', flag: '\u{1F1EC}\u{1F1E7}' },
  { code: 'SA', name: 'Saudi', flag: '\u{1F1F8}\u{1F1E6}' },
  { code: 'QA', name: 'Qatar', flag: '\u{1F1F6}\u{1F1E6}' },
  { code: 'US', name: 'USA', flag: '\u{1F1FA}\u{1F1F8}' },
  { code: 'AU', name: 'Australia', flag: '\u{1F1E6}\u{1F1FA}' },
];

export default function CalculatorClient() {
  const t = useTranslations('Calculator');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormDataState>(initialFormData);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleLevelId | ''>('');
  const [taskAllocations, setTaskAllocations] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const currentTeam = useMemo(() => teams.find((t) => t.id === selectedTeam), [selectedTeam]);
  const currentProfile = useMemo(() => countryProfiles[formData.selectedCountry], [formData.selectedCountry]);

  const totalAllocation = useMemo(
    () => Object.values(taskAllocations).reduce((sum, v) => sum + v, 0),
    [taskAllocations],
  );

  const employeeCost = useMemo(
    () => selectedRole ? calculateEmployeeCost(formData, currentProfile, selectedRole) : null,
    [formData, currentProfile, selectedRole],
  );

  const updateField = useCallback(
    <K extends keyof FormDataState>(field: K, value: FormDataState[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleCountryChange = useCallback((code: CountryCode) => {
    const profile = countryProfiles[code];
    const cur = countryToCurrencyMap[code];
    setFormData((prev) => {
      const next = { ...prev, selectedCountry: code, selectedCurrency: cur };
      next.costOverrides = {};
      next.costCustomFlags = {};
      if (selectedRole) {
        next.fullSalary = String(profile.salaries[selectedRole]);
      }
      return next;
    });
  }, [selectedRole]);

  const handleRoleChange = useCallback((roleId: RoleLevelId) => {
    setSelectedRole(roleId);
    const profile = countryProfiles[formData.selectedCountry];
    setFormData((prev) => ({
      ...prev,
      fullSalary: String(profile.salaries[roleId]),
      costOverrides: {},
      costCustomFlags: {},
    }));
  }, [formData.selectedCountry]);

  const handleTeamSelect = useCallback((teamId: string) => {
    setSelectedTeam(teamId);
    const team = teams.find((t) => t.id === teamId);
    if (team) {
      const allocs: Record<string, number> = {};
      team.tasks.forEach((t) => { allocs[t.id] = t.default; });
      setTaskAllocations(allocs);
      setFormData((prev) => ({ ...prev, diagnosticAnswers: {} }));
    }
  }, []);

  const handleNext = () => {
    if (!validateStep(currentStep, formData, selectedTeam, selectedRole, totalAllocation)) {
      setErrors([t('requiredFields')]);
      return;
    }
    setErrors([]);
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    setErrors([]);
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  if (showResults && selectedRole) {
    const results = calculateEfficiency(formData, currentTeam, selectedRole);
    return (
      <CalculatorResults
        results={results}
        formData={formData}
        selectedTeam={currentTeam}
        roleId={selectedRole}
        taskAllocations={taskAllocations}
        onBack={() => setShowResults(false)}
      />
    );
  }

  return (
    <>
      {/* ═══ Step 0: Full-Width Navy Hero ═══ */}
      {currentStep === 0 && (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-navy via-navy-dark to-navy">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Top bar */}
            <div className="py-6">
              <h1 className="font-poppins text-lg font-bold text-white">
                {t('pageTitle')}
              </h1>
            </div>

            {/* Two-column hero */}
            <div className="flex flex-col items-center gap-12 pb-16 pt-4 lg:flex-row lg:items-start lg:gap-16">

              {/* Left column - Marketing copy */}
              <div className="flex-1 text-white lg:pt-8">
                <h2 className="font-poppins text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                  {t('heroTitle1')}<br />
                  <span className="text-gold">{t('heroTitle2')}</span><br />
                  {t('heroTitle3')}
                </h2>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/80">
                  {t('heroDesc')}
                </p>

                {/* Trust badges */}
                <div className="mt-8 flex flex-wrap gap-3">
                  {[t('badgeQuick'), t('badgeFree'), t('badgeNoCommit')].map((label) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm"
                    >
                      <CheckCircle className="h-4 w-4 text-gold" />
                      <span className="text-sm font-medium text-white">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="mt-10 grid grid-cols-3 gap-6">
                  <div>
                    <p className="font-poppins text-3xl font-bold text-gold">40%</p>
                    <p className="mt-1 text-xs text-white/60">{t('statSavings')}</p>
                  </div>
                  <div>
                    <p className="font-poppins text-3xl font-bold text-gold">500+</p>
                    <p className="mt-1 text-xs text-white/60">{t('statClients')}</p>
                  </div>
                  <div>
                    <p className="font-poppins text-3xl font-bold text-gold">7</p>
                    <p className="mt-1 text-xs text-white/60">{t('statCountries')}</p>
                  </div>
                </div>
              </div>

              {/* Right column - Team selector card */}
              <div className="w-full max-w-md lg:flex-shrink-0">
                <div className="rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
                  <h3 className="font-poppins text-lg font-bold text-gray-900">{t('getStarted')}</h3>
                  <p className="mt-1 text-sm text-gray-500">{t('getStartedDesc')}</p>

                  {errors.length > 0 && (
                    <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      {errors.map((e, i) => (<span key={i}>{e}</span>))}
                    </div>
                  )}

                  {/* Country Dropdown */}
                  <div className="mt-5">
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {t('selectCountry')}
                    </label>
                    <select
                      value={formData.selectedCountry}
                      onChange={(e) => handleCountryChange(e.target.value as CountryCode)}
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                    >
                      {COUNTRY_OPTIONS.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {t(`countryOptions.${c.code}`)} ({countryToCurrencyMap[c.code]})
                        </option>
                      ))}
                    </select>
                    <p className="mt-1.5 text-[11px] text-gray-400">
                      {t('currencyAutoSet')} <strong className="text-navy">{formData.selectedCurrency}</strong>
                    </p>
                  </div>

                  {/* Team Selector - 2-col grid */}
                  <div className="mt-5">
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {t('selectTeam')}
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {teams.map((team) => {
                        const isSelected = selectedTeam === team.id;
                        return (
                          <button
                            key={team.id}
                            type="button"
                            onClick={() => handleTeamSelect(team.id)}
                            className={`relative rounded-xl border-2 p-3 text-center transition-all duration-200 ${
                              isSelected
                                ? 'border-gold bg-gold-50 shadow-sm'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gold hover:bg-gray-50'
                            }`}
                          >
                            <span className={`block text-lg ${isSelected ? 'text-gold-dark' : ''}`}>
                              {renderIcon(team.iconName, 'h-5 w-5')}
                            </span>
                            <h4 className={`mt-1 text-xs font-bold ${isSelected ? 'text-navy' : 'text-gray-700'}`}>
                              {t(`teams.${team.id}.name`)}
                            </h4>
                            {isSelected && (
                              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold">
                                <Check className="h-2.5 w-2.5 text-white" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* BSG Services preview */}
                  {currentTeam && (
                    <div className="mt-4 rounded-lg border border-navy-100 bg-navy-50/50 p-3">
                      <p className="text-xs font-semibold text-navy">{t('bsgServicesFor', { team: t(`teams.${currentTeam.id}.name`) })}</p>
                      <div className="mt-1.5 grid grid-cols-2 gap-1">
                        {currentTeam.bsgServices.slice(0, 4).map((_, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-navy-600">
                            <span className="h-1 w-1 rounded-full bg-gold" />
                            {t(`teams.${currentTeam.id}.bsgServices.${i}`)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gold CTA */}
                  <button
                    type="button"
                    onClick={handleNext}
                    className="mt-6 w-full rounded-xl bg-gold py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-gold-dark hover:shadow-xl"
                  >
                    {t('startCalculating')} <ArrowRight className="ml-1 inline-block h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ Steps 1–6: Card Layout ═══ */}
      {currentStep > 0 && (
      <section className="min-h-screen bg-navy-50 py-8 sm:py-12">
        <div className="mx-auto max-w-[940px] overflow-hidden rounded-2xl bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.07),0_20px_50px_-12px_rgba(0,0,0,0.12)]">

          {/* ═══ Navy Header Bar ═══ */}
          <div className="bg-navy px-7 py-5 text-center">
            <h1 className="font-poppins text-xl font-bold tracking-tight text-white">
              {t('pageTitle')}
            </h1>
            <p className="mt-1 text-sm text-white/80">
              {t(`sub${currentStep}` as 'sub0')}
            </p>
          </div>

          {/* ═══ Progress Bar ═══ */}
          <div className="relative h-2.5 bg-gray-200">
            <div
              className="absolute left-0 top-0 h-full rounded-r bg-gradient-to-r from-navy via-navy-600 to-gold transition-all duration-500"
              style={{ width: `${((currentStep + 1) / TOTAL_STEPS) * 100}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-gray-600">
              {t('stepOf', { current: currentStep + 1, total: TOTAL_STEPS })}
            </span>
          </div>

          {/* ═══ Body Content ═══ */}
          <div className="px-6 py-6 sm:px-7 sm:py-7">

            {/* Step Title */}
            <div className="mb-4 flex items-center gap-3">
              <h2 className="font-poppins text-lg font-bold text-gray-900">
                {t(`step${currentStep}` as 'step0')}
              </h2>
            </div>

            {errors.length > 0 && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {errors.map((e, i) => (<span key={i}>{e}</span>))}
              </div>
            )}

          {/* ── Step 1: Role, Team Size & Maturity ── */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Role Selection */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">{t('selectRoleLevel')}</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {(Object.keys(roleDefaults) as RoleLevelId[]).map((id) => {
                    const role = roleDefaults[id];
                    const salary = currentProfile.salaries[id];
                    const bsgRate = currentProfile.bsgRates[id];
                    const isSelected = selectedRole === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handleRoleChange(id)}
                        className={`relative rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                          isSelected
                            ? `bg-gradient-to-r ${role.gradient} border-transparent text-white shadow-lg scale-[1.03]`
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gold hover:-translate-y-0.5'
                        }`}
                      >
                        <h4 className="text-sm font-bold">{t(`roles.${id}.name`)}</h4>
                        <p className={`text-xs ${isSelected ? 'opacity-80' : 'text-gray-500'}`}>{t(`roles.${id}.subtitle`)}</p>
                        <p className={`mt-2 text-sm font-bold ${isSelected ? '' : 'text-navy'}`}>
                          {formatCurrency(salary, formData.selectedCurrency)}{t('perYear')}
                        </p>
                        <p className={`text-[10px] ${isSelected ? 'opacity-70' : 'text-gray-400'}`}>
                          {t('bsgRate', { rate: Math.round(bsgRate * 100) })}
                        </p>
                        {isSelected && (
                          <span className="absolute right-2 top-2"><Check className="h-3 w-3" /></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Team Size */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">{t("teamSize")}</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={formData.teamSize}
                  onChange={(e) => updateField('teamSize', e.target.value)}
                  className="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  placeholder="e.g. 10"
                />
              </div>

              {/* Team Process Maturity */}
              <div className="rounded-xl border border-navy-200 bg-navy-50 p-4">
                <h3 className="text-sm font-semibold text-navy">{t("teamMaturity")}</h3>
                <p className="mb-3 text-[10px] text-navy-600">{t("maturityDesc")}</p>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.entries(maturityConfigs) as [MaturityLevel, typeof maturityConfigs[MaturityLevel]][]).map(([key]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => updateField('teamMaturity', key as MaturityLevel)}
                      className={`flex flex-col items-center rounded-lg border-2 p-2 text-center transition-all ${
                        formData.teamMaturity === key
                          ? 'border-navy bg-white'
                          : 'border-navy-200 bg-white hover:border-navy-400'
                      }`}
                    >
                      <span className="text-lg">
                        {key === '1' ? <Sprout className="h-5 w-5" /> : key === '2' ? <Leaf className="h-5 w-5" /> : key === '3' ? <TreePine className="h-5 w-5" /> : <Star className="h-5 w-5" />}
                      </span>
                      <span className="text-xs font-semibold text-navy">{t(`maturity.${key}.label`)}</span>
                      <span className="text-[9px] text-navy-400">{t(`maturity.${key}.recommendation`)}</span>
                    </button>
                  ))}
                </div>
                {formData.teamMaturity && maturityConfigs[formData.teamMaturity] && (
                  <p className="mt-2 rounded-md bg-white p-2 text-[10px] text-gray-600">
                    {t(`maturity.${formData.teamMaturity}.description`)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── Step 2: Cost Breakdown ── */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {/* Country banner */}
              <div className={`rounded-lg border p-3 text-xs leading-relaxed ${currentProfile.bannerClass}`}>
                {t(`countries.${formData.selectedCountry}.bannerText`)}
              </div>

              {/* Salary */}
              <div className="rounded-xl border border-navy-200 bg-navy-50 p-4">
                <h3 className="text-sm font-semibold text-navy">{t("annualSalary")}</h3>
                <input
                  type="number"
                  value={formData.fullSalary}
                  onChange={(e) => updateField('fullSalary', e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  placeholder="Annual salary"
                />
                <p className="mt-1 text-[10px] text-navy-600">
                  {t('defaultFor', { role: selectedRole ? t(`roles.${selectedRole}.name`) : t('noRole'), country: t(`countries.${formData.selectedCountry}.name`) })}
                </p>
              </div>

              {/* Dynamic Cost Category Cards */}
              <div className="grid gap-2.5 sm:grid-cols-2">
                {Object.entries(currentProfile.costCategories).map(([key, cat]) => {
                  const isCustom = formData.costCustomFlags[key] || false;
                  const salary = parseInt(formData.fullSalary) || (selectedRole ? currentProfile.salaries[selectedRole] : 0);

                  let autoVal = 0;
                  if (cat.type === 'pct') autoVal = Math.round(Math.min(salary, cat.ceil || salary) * (cat.rate || 0));
                  else if (cat.type === 'pct_thresh') autoVal = Math.round(Math.max(0, salary - (cat.thresh || 0)) * (cat.rate || 0));
                  else if (cat.type === 'pct_band') autoVal = Math.round(Math.max(0, Math.min(salary, cat.upper || 999999) - (cat.lower || 0)) * (cat.rate || 0));
                  else if (cat.type === 'pct_opt') autoVal = Math.round(Math.min(salary, cat.ceil || salary) * (cat.rate || 0));
                  else if (cat.type === 'formula' && currentProfile.eosFormula) autoVal = currentProfile.eosFormula(salary);
                  else if (cat.type === 'futa') autoVal = 42;
                  else if (cat.type === 'leave_flight') autoVal = Math.round(salary * (cat.leaveRate || 0)) + (cat.flightFlat || 0);
                  else if (cat.type === 'flat' || cat.type === 'custom') autoVal = (selectedRole ? (currentProfile.defaults[selectedRole]?.[key] || 0) : 0);

                  const displayVal = isCustom ? (formData.costOverrides[key] || '') : String(autoVal);
                  const isAutoCalc = !isCustom && (cat.type === 'pct' || cat.type === 'pct_thresh' || cat.type === 'pct_band' || cat.type === 'pct_opt' || cat.type === 'formula' || cat.type === 'futa' || cat.type === 'leave_flight');

                  const typeBadge = cat.type === 'pct' ? `${((cat.rate || 0) * 100).toFixed(1)}%${cat.ceil ? t('costBadge.capped') : ''}`
                    : cat.type === 'pct_thresh' ? `${((cat.rate || 0) * 100).toFixed(1)}% ${t('costBadge.aboveThreshold')}`
                    : cat.type === 'pct_band' ? `${((cat.rate || 0) * 100).toFixed(1)}% ${t('costBadge.onBand')}`
                    : cat.type === 'pct_opt' ? `${((cat.rate || 0) * 100).toFixed(1)}% ${t('costBadge.optional')}`
                    : cat.type === 'formula' ? cat.formulaTag || t('costBadge.formula')
                    : cat.type === 'futa' ? t('costBadge.fixedFuta')
                    : cat.type === 'leave_flight' ? cat.formulaTag || t('costBadge.leaveFlight')
                    : cat.type === 'custom' ? t('costBadge.userEntered')
                    : t('costBadge.flatAmount');

                  return (
                    <div key={key} className="rounded-xl border border-gray-200 bg-white p-3 transition-shadow hover:shadow-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-base text-gray-500">{renderIcon(cat.icon, 'h-4 w-4')}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-800">{t(`countries.${formData.selectedCountry}.costCategories.${key}.label`)}</span>
                            <span className="rounded bg-navy-100 px-1.5 py-0.5 text-[8px] font-bold text-navy">{typeBadge}</span>
                          </div>
                          <p className="text-[10px] text-gray-500">{t(`countries.${formData.selectedCountry}.costCategories.${key}.description`)}</p>
                        </div>
                      </div>

                      <div className="mt-2 rounded-md bg-gray-50 p-2">
                        <p className="mb-1 text-[8px] font-semibold uppercase tracking-wider text-gray-500">{t("includes")}</p>
                        {cat.includedItems.map((_, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[10px] text-gray-500">
                            <span className="h-1 w-1 rounded-full bg-navy-400" />
                            {t(`countries.${formData.selectedCountry}.costCategories.${key}.includedItems.${i}`)}
                          </div>
                        ))}
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <label className="flex items-center gap-1 text-[10px] text-gray-500">
                          <input
                            type="checkbox"
                            checked={isCustom}
                            onChange={(e) => {
                              updateField('costCustomFlags', { ...formData.costCustomFlags, [key]: e.target.checked });
                            }}
                            className="rounded border-gray-300 text-navy focus:ring-navy"
                          />
                          {t("custom")}
                        </label>
                        <input
                          type="number"
                          value={displayVal}
                          onChange={(e) => {
                            if (!isCustom) {
                              updateField('costCustomFlags', { ...formData.costCustomFlags, [key]: true });
                            }
                            updateField('costOverrides', { ...formData.costOverrides, [key]: e.target.value });
                          }}
                          disabled={isAutoCalc}
                          className="w-24 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-900 focus:border-navy focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Other Costs */}
              <div className="rounded-xl border border-gray-200 p-3">
                <label className="text-xs font-semibold text-gray-700">{t("otherCosts")}</label>
                <input
                  type="number"
                  value={formData.otherCosts}
                  onChange={(e) => updateField('otherCosts', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-navy focus:outline-none"
                />
              </div>

              {/* Cost Summary */}
              {employeeCost && (
                <div className="rounded-xl bg-[#0f172a] p-4 text-white">
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div>
                      <p className="text-sm font-bold">{formatCurrency(employeeCost.fullSalary, formData.selectedCurrency)}</p>
                      <p className="text-[9px] uppercase tracking-wider text-gray-400">{t("baseSalary")}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-amber-400">{formatCurrency(employeeCost.totalOverheads, formData.selectedCurrency)}</p>
                      <p className="text-[9px] uppercase tracking-wider text-gray-400">{t("totalOverheads")}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-green-400">{formatCurrency(employeeCost.trueCost, formData.selectedCurrency)}</p>
                      <p className="text-[9px] uppercase tracking-wider text-gray-400">{t("trueCost")}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gold-light">{employeeCost.totalOverheads > 0 ? Math.round((employeeCost.totalOverheads / employeeCost.trueCost) * 100) : 0}%</p>
                      <p className="text-[9px] uppercase tracking-wider text-gray-400">{t("overheadRatio")}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Task Allocation ── */}
          {currentStep === 3 && currentTeam && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {t("taskAllocDesc", { team: t(`teams.${currentTeam.id}.name`) })}
              </p>
              {currentTeam.tasks.map((task) => (
                <div key={task.id} className="border-b border-gray-100 pb-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">{t(`teams.${currentTeam.id}.tasks.${task.id}`)}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={taskAllocations[task.id] ?? task.default}
                        onChange={(e) =>
                          setTaskAllocations((prev) => ({ ...prev, [task.id]: Number(e.target.value) }))
                        }
                        className="w-14 rounded border border-gray-300 px-2 py-1 text-center text-sm font-semibold text-navy focus:border-navy focus:outline-none"
                      />
                      <span className="text-sm font-semibold text-gray-500">%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={taskAllocations[task.id] ?? task.default}
                    onChange={(e) =>
                      setTaskAllocations((prev) => ({ ...prev, [task.id]: Number(e.target.value) }))
                    }
                    className="mt-2 w-full accent-navy"
                  />
                </div>
              ))}
              <div
                className={`rounded-lg border px-3 py-2 text-center text-sm font-semibold ${
                  totalAllocation >= 98 && totalAllocation <= 102
                    ? 'border-green-300 bg-green-50 text-green-700'
                    : 'border-red-300 bg-red-50 text-red-700'
                }`}
              >
                {t('total', { pct: totalAllocation })}{' '}
                {totalAllocation >= 98 && totalAllocation <= 102 ? <span className="inline-flex items-center gap-1"><Check className="h-3 w-3" /> {t('valid')}</span> : t('adjustTo100')}
              </div>
            </div>
          )}

          {/* ── Step 4: Diagnostics ── */}
          {currentStep === 4 && currentTeam && (() => {
            const questions = teamQuestions[currentTeam.id] || [];
            const answeredCount = Object.keys(formData.diagnosticAnswers).length;
            return (
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-4 rounded-lg bg-gray-50 px-4 py-2">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" /> {t('bestPractice')}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> {t('mixed')}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> {t('needsWork')}
                  </span>
                </div>

                {questions.map((q, qIdx) => {
                  const isAnswered = formData.diagnosticAnswers[qIdx] !== undefined;
                  return (
                    <div
                      key={qIdx}
                      className={`rounded-lg border border-gray-100 p-3 transition-all ${
                        isAnswered ? 'bg-gray-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold leading-snug text-gray-800">
                          <span className="mr-2 rounded bg-navy-100 px-1.5 py-0.5 text-[10px] font-bold text-navy">
                            Q{qIdx + 1}
                          </span>
                          {t(`teams.${currentTeam.id}.questions.${qIdx}.question`)}
                        </p>
                        {isAnswered && (
                          <span className="shrink-0 text-green-600"><Check className="h-3 w-3" /></span>
                        )}
                      </div>
                      <div className="mt-3 space-y-1.5">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = formData.diagnosticAnswers[qIdx] === oIdx;
                          const selectedColors =
                            oIdx === 0
                              ? 'border-green-500 bg-green-50 text-green-800'
                              : oIdx === 1
                                ? 'border-amber-400 bg-amber-50 text-amber-800'
                                : 'border-red-400 bg-red-50 text-red-800';
                          const dotColor = oIdx === 0 ? 'bg-green-500' : oIdx === 1 ? 'bg-amber-400' : 'bg-red-500';
                          const badge = oIdx === 0 ? 'bg-green-100 text-green-700' : oIdx === 1 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';
                          const badgeText = oIdx === 0 ? t('best') : oIdx === 1 ? t('mixed') : t('risk');

                          return (
                            <label
                              key={oIdx}
                              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-xs transition-all ${
                                isSelected
                                  ? `${selectedColors} font-medium`
                                  : 'border-gray-200 text-gray-600 hover:border-gold hover:bg-gray-50'
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
                              <span className={`h-2 w-2 shrink-0 rounded-full ${dotColor} ${isSelected ? 'opacity-100' : 'opacity-40'}`} />
                              <span className="flex-1">{t(`teams.${currentTeam.id}.questions.${qIdx}.options.${oIdx}`)}</span>
                              <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold ${badge}`}>{badgeText}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-xs text-gray-500">{t('answeredOf', { answered: answeredCount, total: questions.length })}</span>
                  <div className="h-1.5 w-32 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-navy to-gold transition-all"
                      style={{ width: `${(answeredCount / Math.max(1, questions.length)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ── Step 5: Goals, Efficiency & Timeline ── */}
          {currentStep === 5 && (() => {
            const goalsCompleted = [
              formData.primaryGoal,
              formData.targetEfficiency,
              formData.timeline,
            ].filter(Boolean).length;

            return (
              <div className="space-y-3">
                {/* Primary Goal */}
                <div className="rounded-lg border border-gray-100 p-3">
                  <p className="mb-2 text-sm font-semibold text-gray-800">{t("primaryGoal")}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.entries(goalConfigs) as [GoalType, typeof goalConfigs[GoalType]][]).map(([key, cfg]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => updateField('primaryGoal', key)}
                        className={`flex items-center gap-2 rounded-lg border p-2.5 text-left text-xs transition-all ${
                          formData.primaryGoal === key
                            ? 'border-navy bg-navy-50 font-medium'
                            : 'border-gray-200 text-gray-600 hover:border-gold'
                        }`}
                      >
                        <span className="text-base">{renderIcon(cfg.icon, 'h-4 w-4')}</span>
                        <div>
                          <span className="font-semibold text-gray-800">{t(`goals.${key}.label`)}</span>
                          <p className="text-[10px] text-gray-500">{t(`goals.${key}.leadNarrative`)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Efficiency Target */}
                <div className="rounded-lg border border-gray-100 p-3">
                  <p className="mb-2 text-sm font-semibold text-gray-800">{t("targetEfficiency")}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(['95', '97', '99'] as EfficiencyTarget[]).map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => updateField('targetEfficiency', val)}
                        className={`flex flex-col items-center rounded-lg border p-2.5 text-center transition-all ${
                          formData.targetEfficiency === val
                            ? 'border-navy bg-navy-50'
                            : 'border-gray-200 hover:border-gold'
                        }`}
                      >
                        <span className="text-xl font-bold text-navy">{val}%</span>
                        <span className="text-[10px] text-gray-500">
                          {val === '95' ? t('standard') : val === '97' ? t('highPerformance') : t('premium')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="rounded-lg border border-gray-100 p-3">
                  <p className="mb-2 text-sm font-semibold text-gray-800">{t("implTimeline")}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { key: '3_months' as TimelineOption, icon: <Zap className="h-5 w-5" />, label: t('threeMonths'), sub: t('fastTrack') },
                      { key: '6_months' as TimelineOption, icon: <Calendar className="h-5 w-5" />, label: t('sixMonths'), sub: t('standardTimeline') },
                      { key: '12_months' as TimelineOption, icon: <Target className="h-5 w-5" />, label: t('twelveMonths'), sub: t('comprehensive') },
                    ]).map((tl) => (
                      <button
                        key={tl.key}
                        type="button"
                        onClick={() => updateField('timeline', tl.key)}
                        className={`flex flex-col items-center rounded-lg border p-2.5 text-center transition-all ${
                          formData.timeline === tl.key
                            ? 'border-navy bg-navy-50'
                            : 'border-gray-200 hover:border-gold'
                        }`}
                      >
                        <span className="text-lg">{tl.icon}</span>
                        <span className="text-sm font-semibold text-gray-800">{tl.label}</span>
                        <span className="text-[10px] text-gray-500">{tl.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress Footer */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-xs text-gray-500">{t('completedOf', { done: goalsCompleted })}</span>
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

          {/* ── Step 6: Contact Information (LAST) ── */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {t("contactDesc")}
              </p>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">{t("fullName")}</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">{t("companyEmail")}</label>
                  <input
                    type="email"
                    value={formData.companyEmail}
                    onChange={(e) => updateField('companyEmail', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                    placeholder="john@company.com"
                  />
                  <p className="mt-0.5 text-[10px] text-gray-400">{t("companyEmailHint")}</p>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">{t("companyName")}</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => updateField('companyName', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                    placeholder="Acme Corp"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">{t("mobileNumber")}</label>
                  <input
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) => updateField('mobileNumber', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                    placeholder="+971 50 123 4567"
                  />
                </div>
              </div>

              {/* Summary preview */}
              <div className="rounded-xl bg-navy-50 p-4">
                <p className="text-xs font-semibold text-navy">{t("analysisSummary")}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-navy-600">
                  <span>{currentProfile.flag} {t(`countries.${formData.selectedCountry}.name`)}</span>
                  <span>{currentTeam ? t(`teams.${currentTeam.id}.name`) : t('noTeamSelected')}</span>
                  <span>{selectedRole ? t(`roles.${selectedRole}.name`) : t('noRole')} / {formData.teamSize || '0'} {t('staff')}</span>
                  <span>{t('currency')}: {formData.selectedCurrency}</span>
                </div>
              </div>
            </div>
          )}

          {/* ═══ Navigation Row ═══ */}
          <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-1 rounded-lg border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ArrowLeft className="h-4 w-4" /> {t("previous")}
            </button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full transition-all ${
                    i < currentStep ? 'bg-gold' : i === currentStep ? 'scale-[1.35] bg-navy shadow-[0_0_0_3px_rgba(6,39,103,0.2)]' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleNext}
              className={`flex items-center gap-1 rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg ${
                currentStep === TOTAL_STEPS - 1
                  ? 'bg-gold hover:bg-gold-dark'
                  : 'bg-navy hover:bg-navy-dark'
              }`}
            >
              {currentStep === TOTAL_STEPS - 1 ? t('calculateResults') : t('next')} <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>
    </section>
      )}
    </>
  );
}
