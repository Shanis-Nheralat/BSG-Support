import type {
  CountryCode,
  CountryProfile,
  CurrencyCode,
  GoalType,
  GoalConfig,
  MaturityLevel,
  MaturityConfig,
  TimelineOption,
} from './types';

// ── Country Profiles with Statutory Cost Models ──

export const countryProfiles: Record<CountryCode, CountryProfile> = {
  UAE: {
    name: 'United Arab Emirates',
    flag: '\u{1F1E6}\u{1F1EA}',
    currency: 'AED',
    salaries: { junior: 48000, mid: 60000, senior: 120000 },
    costCategories: {
      c1: { label: 'Visa & documentation', icon: 'Plane', description: 'Work permit, entry visa, Emirates ID', includedItems: ['Work permit fees', 'Visa processing', 'Emirates ID', 'Medical fitness test'], type: 'flat' },
      c2: { label: 'Health insurance', icon: 'Heart', description: 'Mandatory DHA/HAAD employer health cover', includedItems: ['Medical insurance', 'Dental coverage', 'Vision care', 'Family options'], type: 'flat' },
      c3: { label: 'Training & development', icon: 'GraduationCap', description: 'Onboarding, certifications, courses', includedItems: ['Initial training', 'Certifications', 'Conferences', 'Skills development'], type: 'flat' },
      c4: { label: 'Equipment & technology', icon: 'Laptop', description: 'Hardware, software, peripherals', includedItems: ['Laptop/desktop', 'Software licences', 'Mobile device', 'Office supplies'], type: 'flat' },
      c5: { label: 'Office space & utilities', icon: 'Building2', description: 'Pro-rata desk cost in UAE office', includedItems: ['Desk allocation', 'Utilities', 'Internet', 'Facilities'], type: 'flat' },
      c6: { label: 'End of service gratuity', icon: 'PiggyBank', description: 'UAE Labour Law \u2014 21 days salary per year', includedItems: ['21 days/year (Law Art.132)', 'Legal requirement', 'Auto-calculated', 'Based on base salary'], type: 'formula', formulaTag: '(salary\u00F7365)\u00D721' },
      c7: { label: 'Leave salary & flight', icon: 'PlusCircle', description: 'Leave salary (30 days) + repatriation flight', includedItems: ['Annual leave salary (30 days)', 'Repatriation flight (annual)', 'Auto-calculated', 'UAE Labour Law'], type: 'leave_flight', leaveRate: 1 / 12, flightFlat: 1500, formulaTag: 'salary\u00F712 + 1,500' },
    },
    defaults: {
      junior: { c1: 3750, c2: 1899, c3: 1500, c4: 4000, c5: 12000, c7: 0 },
      mid: { c1: 3500, c2: 1899, c3: 2000, c4: 4000, c5: 12000, c7: 0 },
      senior: { c1: 5000, c2: 4000, c3: 3000, c4: 5000, c5: 15000, c7: 0 },
    },
    bsgRates: { junior: 0.75, mid: 0.84, senior: 0.80 },
    eosFormula: (s: number) => Math.round((s / 365) * 21),
    methodologyNote: 'EOS Gratuity = (Salary\u00F7365)\u00D721 days \u2014 UAE Labour Law Article 132.',
    bannerClass: 'bg-amber-50 border-amber-300 text-amber-900',
    bannerText: '\u{1F1E6}\u{1F1EA} UAE model: flat overhead costs + formula-based EOS Gratuity. No employer social security contributions.',
  },

  DE: {
    name: 'Germany',
    flag: '\u{1F1E9}\u{1F1EA}',
    currency: 'EUR',
    salaries: { junior: 32000, mid: 52000, senior: 85000 },
    costCategories: {
      c1: { label: 'Pension insurance', icon: 'Landmark', description: 'Rentenversicherung \u2014 9.3% employer share', includedItems: ['Statutory pension', 'Disability benefits', 'Survivor benefits', 'Ceiling: \u20AC96,600/yr'], type: 'pct', rate: 0.093, ceil: 96600 },
      c2: { label: 'Health insurance', icon: 'Heart', description: 'Krankenversicherung \u2014 ~8.15%', includedItems: ['Doctor & hospital care', 'Medications', 'Maternity benefits', 'Ceiling: \u20AC66,150/yr'], type: 'pct', rate: 0.0815, ceil: 66150 },
      c3: { label: 'Unemployment insurance', icon: 'Briefcase', description: 'Arbeitslosenversicherung \u2014 1.3%', includedItems: ['Unemployment benefits', 'Retraining support', 'Ceiling: \u20AC96,600/yr', 'Via Bundesagentur'], type: 'pct', rate: 0.013, ceil: 96600 },
      c4: { label: 'Long-term care', icon: 'Handshake', description: 'Pflegeversicherung \u2014 1.7%', includedItems: ['Nursing home care', 'Home care support', 'Ceiling: \u20AC66,150/yr', 'Employer pays 1.7%'], type: 'pct', rate: 0.017, ceil: 66150 },
      c5: { label: 'Accident insurance', icon: 'HardHat', description: 'Unfallversicherung \u2014 ~1.0%', includedItems: ['Workplace accidents', 'Commuting accidents', 'Occupational illness', 'No salary ceiling'], type: 'pct', rate: 0.010, ceil: null },
      c6: { label: 'Statutory levies (U1/U2/U3)', icon: 'ClipboardList', description: 'Sick pay, maternity & insolvency levies ~2%', includedItems: ['U1: sick pay cover', 'U2: maternity pay', 'U3: insolvency fund', 'No salary ceiling'], type: 'pct', rate: 0.020, ceil: null },
      c7: { label: 'Equipment, office & training', icon: 'Laptop', description: 'Hardware, workspace, development costs', includedItems: ['Laptop & peripherals', 'Office space (~\u20AC230/mo)', 'Training & certs', 'Software licences'], type: 'flat' },
      c8: { label: 'Separation reserve (optional)', icon: 'Scale', description: 'Discretionary Abfindung \u2014 not statutory', includedItems: ['Only on redundancy', '~0.5 months/year', 'Negotiated', 'Default: \u20AC0'], type: 'custom' },
      c9: { label: 'Leave salary', icon: 'PlusCircle', description: 'Annual leave cost (30 days)', includedItems: ['Annual leave salary (30 days)', 'Statutory entitlement', 'Auto-calculated', 'German Labour Law'], type: 'leave_flight', leaveRate: 30 / 365, flightFlat: 0, formulaTag: 'salary\u00D730\u00F7365' },
    },
    defaults: {
      junior: { c7: 7500, c8: 0 },
      mid: { c7: 9000, c8: 0 },
      senior: { c7: 12000, c8: 0 },
    },
    bsgRates: { junior: 0.75, mid: 0.84, senior: 0.80 },
    eosFormula: null,
    methodologyNote: 'Germany: statutory social contributions ~22% (pension 9.3% + health 8.15% + unemployment 1.3% + care 1.7% + accident 1% + levies 2%). Ceilings apply per category.',
    bannerClass: 'bg-green-50 border-green-300 text-green-900',
    bannerText: '\u{1F1E9}\u{1F1EA} Germany model: percentage-based statutory social contributions with salary ceilings + flat overhead costs.',
  },

  UK: {
    name: 'United Kingdom',
    flag: '\u{1F1EC}\u{1F1E7}',
    currency: 'GBP',
    salaries: { junior: 26000, mid: 40000, senior: 70000 },
    costCategories: {
      c1: { label: 'Employer National Insurance', icon: 'ShieldCheck', description: '13.8% above \u00A39,100/yr threshold', includedItems: ['State pension', 'NHS contributions', 'Benefits system', 'Threshold: \u00A39,100/yr'], type: 'pct_thresh', rate: 0.138, thresh: 9100 },
      c2: { label: 'Workplace pension', icon: 'Landmark', description: 'Auto-enrolment 3% on qualifying earnings', includedItems: ['Auto-enrolment mandatory', 'Min 3% employer', 'Band: \u00A36,240\u2013\u00A350,270', 'Employee adds min 5%'], type: 'pct_band', rate: 0.03, lower: 6240, upper: 50270 },
      c3: { label: 'Training & development', icon: 'GraduationCap', description: 'Onboarding, CPD, qualifications', includedItems: ['Onboarding costs', 'Professional certs', 'CPD courses', 'Memberships'], type: 'flat' },
      c4: { label: 'Equipment & technology', icon: 'Laptop', description: 'Hardware, software, home office', includedItems: ['Laptop & hardware', 'Software licences', 'Home office', 'Mobile device'], type: 'flat' },
      c5: { label: 'Office space & utilities', icon: 'Building2', description: 'Pro-rata desk cost in UK office', includedItems: ['Desk allocation', 'Business rates', 'Utilities & internet', 'Facilities'], type: 'flat' },
      c6: { label: 'Leave salary', icon: 'PlusCircle', description: 'Annual leave cost (28 days statutory)', includedItems: ['Annual leave salary (28 days)', 'Statutory entitlement', 'Auto-calculated', 'UK Employment Rights Act'], type: 'leave_flight', leaveRate: 28 / 365, flightFlat: 0, formulaTag: 'salary\u00D728\u00F7365' },
    },
    defaults: {
      junior: { c3: 1200, c4: 2200, c5: 7200, c6: 0 },
      mid: { c3: 1800, c4: 2500, c5: 7200, c6: 0 },
      senior: { c3: 3000, c4: 3500, c5: 9600, c6: 0 },
    },
    bsgRates: { junior: 0.75, mid: 0.84, senior: 0.80 },
    eosFormula: null,
    methodologyNote: 'UK: Employer NI 13.8% on earnings above \u00A39,100 threshold + auto-enrolment pension 3% on qualifying band (\u00A36,240\u2013\u00A350,270).',
    bannerClass: 'bg-blue-50 border-blue-300 text-blue-900',
    bannerText: '\u{1F1EC}\u{1F1E7} UK model: Employer National Insurance 13.8% + auto-enrolment pension 3% + flat overhead costs.',
  },

  SA: {
    name: 'Saudi Arabia',
    flag: '\u{1F1F8}\u{1F1E6}',
    currency: 'SAR',
    salaries: { junior: 45000, mid: 65000, senior: 120000 },
    costCategories: {
      c1: { label: 'Iqama & documentation', icon: 'Plane', description: 'Residency permit, work visa, GOSI', includedItems: ['Iqama', 'Work visa fees', 'GOSI registration', 'Medical tests'], type: 'flat' },
      c2: { label: 'GOSI contribution', icon: 'ShieldCheck', description: '9% employer (Saudi) / 2% (expat)', includedItems: ['Hazards 2%', 'Annuities 7% (Saudi)', 'Expats: 2% only', 'Via GOSI portal'], type: 'flat' },
      c3: { label: 'Health insurance', icon: 'Heart', description: 'Mandatory CCHI employer cover', includedItems: ['CCHI mandatory', 'Medical insurance', 'Dental & vision', 'Family options'], type: 'flat' },
      c4: { label: 'Training & development', icon: 'GraduationCap', description: 'Onboarding, Nitaqat compliance', includedItems: ['Initial training', 'Saudisation compliance', 'Professional certs', 'Skills development'], type: 'flat' },
      c5: { label: 'Equipment & technology', icon: 'Laptop', description: 'Hardware, software, peripherals', includedItems: ['Laptop/desktop', 'Software licences', 'Mobile device', 'Office supplies'], type: 'flat' },
      c6: { label: 'Office space & utilities', icon: 'Building2', description: 'Pro-rata desk cost in KSA office', includedItems: ['Desk allocation', 'Utilities', 'Internet', 'Facilities'], type: 'flat' },
      c7: { label: 'End of service', icon: 'PiggyBank', description: 'Saudi Labour Law \u2014 15 days/year', includedItems: ['Half month/year (yr 1\u20135)', 'Full month/year (yr 5+)', 'On resignation/termination', 'Auto-calculated'], type: 'formula', formulaTag: '(salary\u00F7365)\u00D715' },
      c8: { label: 'Leave salary & flight', icon: 'PlusCircle', description: 'Leave salary (21 days) + repatriation flight', includedItems: ['Annual leave salary (21 days)', 'Repatriation flight (annual)', 'Auto-calculated', 'Saudi Labour Law'], type: 'leave_flight', leaveRate: 21 / 365, flightFlat: 1500, formulaTag: 'salary\u00D721\u00F7365 + 1,500' },
    },
    defaults: {
      junior: { c1: 3500, c2: 900, c3: 1800, c4: 1400, c5: 3800, c6: 11400, c8: 0 },
      mid: { c1: 3300, c2: 1300, c3: 1800, c4: 1900, c5: 3800, c6: 11400, c8: 0 },
      senior: { c1: 4700, c2: 2400, c3: 3800, c4: 2850, c5: 4750, c6: 14250, c8: 0 },
    },
    bsgRates: { junior: 0.75, mid: 0.84, senior: 0.80 },
    eosFormula: (s: number) => Math.round((s / 365) * 15),
    methodologyNote: 'Saudi Arabia: EOS = (Salary\u00F7365)\u00D715 days/year (first 5 years).',
    bannerClass: 'bg-amber-50 border-amber-200 text-amber-900',
    bannerText: '\u{1F1F8}\u{1F1E6} Saudi Arabia model: flat overhead + EOS Gratuity (15 days/year for first 5 years).',
  },

  QA: {
    name: 'Qatar',
    flag: '\u{1F1F6}\u{1F1E6}',
    currency: 'QAR',
    salaries: { junior: 50000, mid: 70000, senior: 130000 },
    costCategories: {
      c1: { label: 'Visa & RP documentation', icon: 'Plane', description: 'Work visa, residency permit', includedItems: ['Work visa fees', 'Residency permit (RP)', 'Medical fitness test', 'Hamad Card (optional)'], type: 'flat' },
      c2: { label: 'Health insurance', icon: 'Heart', description: 'Mandatory employer cover under QIC', includedItems: ['Medical insurance', 'Dental & vision', 'Hospital access', 'Family options'], type: 'flat' },
      c3: { label: 'Training & development', icon: 'GraduationCap', description: 'Onboarding, certifications', includedItems: ['Initial training', 'Certifications', 'Conferences', 'Skills development'], type: 'flat' },
      c4: { label: 'Equipment & technology', icon: 'Laptop', description: 'Hardware, software, peripherals', includedItems: ['Laptop/desktop', 'Software licences', 'Mobile device', 'Office supplies'], type: 'flat' },
      c5: { label: 'Office space & utilities', icon: 'Building2', description: 'Pro-rata desk cost in Qatar', includedItems: ['Desk allocation', 'Utilities', 'Internet', 'Facilities'], type: 'flat' },
      c6: { label: 'End of service gratuity', icon: 'PiggyBank', description: 'Qatar Labour Law \u2014 21 days/year', includedItems: ['3 weeks salary/year', 'Legal requirement', 'Auto-calculated', 'Based on base salary'], type: 'formula', formulaTag: '(salary\u00F7365)\u00D721' },
      c7: { label: 'Leave salary & flight', icon: 'PlusCircle', description: 'Leave salary (21 days) + repatriation flight', includedItems: ['Annual leave salary (21 days)', 'Repatriation flight (annual)', 'Auto-calculated', 'Qatar Labour Law'], type: 'leave_flight', leaveRate: 21 / 365, flightFlat: 1500, formulaTag: 'salary\u00D721\u00F7365 + 1,500' },
    },
    defaults: {
      junior: { c1: 4000, c2: 2000, c3: 1600, c4: 4200, c5: 12600, c7: 0 },
      mid: { c1: 3800, c2: 2000, c3: 2100, c4: 4200, c5: 12600, c7: 0 },
      senior: { c1: 5200, c2: 4200, c3: 3150, c4: 5250, c5: 15750, c7: 0 },
    },
    bsgRates: { junior: 0.75, mid: 0.84, senior: 0.80 },
    eosFormula: (s: number) => Math.round((s / 365) * 21),
    methodologyNote: 'Qatar: EOS Gratuity = (Salary\u00F7365)\u00D721 days per year under Qatar Labour Law.',
    bannerClass: 'bg-purple-50 border-purple-300 text-purple-900',
    bannerText: '\u{1F1F6}\u{1F1E6} Qatar model: flat overhead fees + EOS Gratuity (21 days/year).',
  },

  US: {
    name: 'United States',
    flag: '\u{1F1FA}\u{1F1F8}',
    currency: 'USD',
    salaries: { junior: 42000, mid: 70000, senior: 110000 },
    costCategories: {
      c1: { label: 'Social Security (FICA)', icon: 'ShieldCheck', description: '6.2% of salary, ceiling $176,100/yr (2025)', includedItems: ['Old-age & disability', 'Survivor benefits', 'Ceiling: $176,100/yr', 'IRS-confirmed rate'], type: 'pct', rate: 0.062, ceil: 176100 },
      c2: { label: 'Medicare (FICA)', icon: 'Hospital', description: '1.45% \u2014 no salary ceiling', includedItems: ['Hospital care (Part A)', 'No salary ceiling', 'IRS-confirmed rate', 'Employer matches employee'], type: 'pct', rate: 0.0145, ceil: null },
      c3: { label: 'Federal Unemployment (FUTA)', icon: 'ClipboardList', description: '0.6% on first $7,000 \u2014 max $42/yr', includedItems: ['Effective rate: 0.6%', 'After 5.4% state credit', 'First $7,000 wages only', 'Max $42/employee/year'], type: 'futa' },
      c4: { label: 'State Unemployment (SUTA)', icon: 'ClipboardList', description: 'Varies by state \u2014 enter your rate', includedItems: ['Rate varies by state', 'Wage base: $7K\u2013$45K+', 'Experience-rated', 'Use your state rate'], type: 'custom' },
      c5: { label: 'Health insurance', icon: 'Heart', description: 'No national mandate under 50 FTE; ~$7,500/yr avg', includedItems: ['ACA: mandate for 50+ FTE', 'Avg ~$7,500/yr single', 'Varies by plan & state', 'Employer contribution'], type: 'flat' },
      c6: { label: '401(k) employer match', icon: 'PiggyBank', description: 'Optional \u2014 default 3% of salary', includedItems: ['Not legally required', '~85% of employers offer', 'Typical: 3\u20136% of salary', 'Tax-advantaged'], type: 'pct_opt', rate: 0.03, ceil: null },
      c7: { label: 'Training, equipment & office', icon: 'Laptop', description: 'Hardware, workspace, onboarding', includedItems: ['Laptop & software', 'Office space', 'Training & onboarding', 'Mobile & peripherals'], type: 'flat' },
      c8: { label: 'Leave salary', icon: 'PlusCircle', description: 'PTO / annual leave cost (15 days avg)', includedItems: ['Paid time off (15 days avg)', 'No federal mandate', 'Auto-calculated', 'Industry average'], type: 'leave_flight', leaveRate: 15 / 365, flightFlat: 0, formulaTag: 'salary\u00D715\u00F7365' },
    },
    defaults: {
      junior: { c4: 0, c5: 6000, c7: 9500, c8: 0 },
      mid: { c4: 0, c5: 7500, c7: 11000, c8: 0 },
      senior: { c4: 0, c5: 9000, c7: 14000, c8: 0 },
    },
    bsgRates: { junior: 0.75, mid: 0.84, senior: 0.80 },
    eosFormula: null,
    methodologyNote: 'USA: FICA Social Security 6.2% (ceiling $176,100/yr 2025) + Medicare 1.45% (no ceiling) + FUTA max $42/yr.',
    bannerClass: 'bg-blue-50 border-blue-300 text-blue-900',
    bannerText: '\u{1F1FA}\u{1F1F8} US model: FICA (Social Security 6.2% + Medicare 1.45%) + FUTA + optional 401(k) match + flat overheads.',
  },

  AU: {
    name: 'Australia',
    flag: '\u{1F1E6}\u{1F1FA}',
    currency: 'AUD',
    salaries: { junior: 55000, mid: 80000, senior: 130000 },
    costCategories: {
      c1: { label: 'Superannuation Guarantee', icon: 'Landmark', description: 'Mandatory employer pension \u2014 11.5% (2024\u201325)', includedItems: ['Statutory employer pension', '11.5% of ordinary earnings', 'No salary ceiling', 'Rising to 12% July 2025'], type: 'pct', rate: 0.115, ceil: null },
      c2: { label: 'Workers Compensation', icon: 'HardHat', description: 'State-based \u2014 ~1.5% avg office roles', includedItems: ['Mandatory in all states', '~1\u20132% of payroll (office)', 'Covers workplace injury', 'Varies by state & industry'], type: 'pct', rate: 0.015, ceil: null },
      c3: { label: 'Payroll tax (state-based)', icon: 'ClipboardList', description: '~4.85\u20136.85% once payroll exceeds threshold', includedItems: ['State threshold: ~$700K\u2013$1.2M', 'Rate: 4.85\u20136.85%', 'Total payroll dependent', 'Only if threshold exceeded'], type: 'custom' },
      c4: { label: 'Training & development', icon: 'GraduationCap', description: 'Onboarding, professional development', includedItems: ['Initial training', 'Professional certs', 'CPD & conferences', 'Skills development'], type: 'flat' },
      c5: { label: 'Equipment & technology', icon: 'Laptop', description: 'Hardware, software, home office', includedItems: ['Laptop & hardware', 'Software licences', 'Home office allowance', 'Mobile device'], type: 'flat' },
      c6: { label: 'Office space & utilities', icon: 'Building2', description: 'Pro-rata desk cost in Australian office', includedItems: ['Desk allocation', 'Utilities & internet', 'Building facilities', 'Business rates'], type: 'flat' },
      c7: { label: 'Leave salary', icon: 'PlusCircle', description: 'Annual leave cost (20 days statutory)', includedItems: ['Annual leave salary (20 days)', 'Statutory 4 weeks', 'Auto-calculated', 'Fair Work Act'], type: 'leave_flight', leaveRate: 20 / 365, flightFlat: 0, formulaTag: 'salary\u00D720\u00F7365' },
    },
    defaults: {
      junior: { c3: 0, c4: 1500, c5: 2500, c6: 8000, c7: 0 },
      mid: { c3: 0, c4: 2000, c5: 3000, c6: 8000, c7: 0 },
      senior: { c3: 0, c4: 3000, c5: 4000, c6: 10000, c7: 0 },
    },
    bsgRates: { junior: 0.75, mid: 0.84, senior: 0.80 },
    eosFormula: null,
    methodologyNote: 'Australia: Superannuation Guarantee 11.5% (no ceiling) + workers compensation ~1.5%. No employer health insurance (Medicare is government-funded). No EOS Gratuity.',
    bannerClass: 'bg-yellow-50 border-yellow-300 text-yellow-900',
    bannerText: '\u{1F1E6}\u{1F1FA} Australia model: Superannuation Guarantee 11.5% + workers compensation ~1.5% + flat overheads.',
  },
};

// ── Country to Default Currency Map ──
export const countryToCurrencyMap: Record<CountryCode, CurrencyCode> = {
  UAE: 'AED',
  DE: 'EUR',
  UK: 'GBP',
  SA: 'SAR',
  QA: 'QAR',
  US: 'USD',
  AU: 'AUD',
};

// ── Goal Configurations ──
export const goalConfigs: Record<GoalType, GoalConfig> = {
  cost_reduction: {
    label: 'Cost Reduction',
    icon: 'Banknote',
    headerGradient: 'from-emerald-600 to-emerald-800',
    kpi1Label: 'Annual Savings',
    kpi2Label: 'Overhead Reduction',
    kpi3Label: 'Payback Period',
    leadNarrative: 'focused on reducing operational costs',
  },
  efficiency_boost: {
    label: 'Efficiency Boost',
    icon: 'TrendingUp',
    headerGradient: 'from-blue-600 to-blue-800',
    kpi1Label: 'Efficiency Gain',
    kpi2Label: 'Hours Reclaimed/Week',
    kpi3Label: 'Process Improvement',
    leadNarrative: 'focused on maximising operational efficiency',
  },
  quality_improvement: {
    label: 'Quality Improvement',
    icon: 'BadgeCheck',
    headerGradient: 'from-purple-600 to-purple-800',
    kpi1Label: 'Efficiency Guarantee',
    kpi2Label: 'Process Gaps Fixed',
    kpi3Label: 'Error Reduction',
    leadNarrative: 'focused on improving output quality and consistency',
  },
  scalability: {
    label: 'Scalability',
    icon: 'Layers',
    headerGradient: 'from-cyan-600 to-cyan-800',
    kpi1Label: 'Capacity Freed',
    kpi2Label: 'Team Flexibility',
    kpi3Label: 'Growth Readiness',
    leadNarrative: 'focused on building scalable operations',
  },
};

// ── Maturity Configurations ──
export const maturityConfigs: Record<MaturityLevel, MaturityConfig> = {
  '1': {
    label: 'Basic',
    recommendation: 'Foundation-first engagement',
    description: 'BSG will begin with process documentation and standardisation before optimisation.',
    phase1: 'Process Design & Documentation',
    phase2: 'Standardisation & Training',
    phase3: 'Performance Optimisation',
  },
  '2': {
    label: 'Developing',
    recommendation: 'Structure & optimise engagement',
    description: 'BSG will formalise existing processes and introduce automation where gaps exist.',
    phase1: 'Process Formalisation',
    phase2: 'Automation & Integration',
    phase3: 'Continuous Improvement',
  },
  '3': {
    label: 'Mature',
    recommendation: 'Optimisation engagement',
    description: 'BSG will directly optimise your well-defined processes for peak performance.',
    phase1: 'Rapid Transition',
    phase2: 'Performance Optimisation',
    phase3: 'Advanced Analytics',
  },
  '4': {
    label: 'Advanced',
    recommendation: 'Enhancement engagement',
    description: 'BSG will integrate seamlessly with your advanced processes and focus on marginal gains.',
    phase1: 'Seamless Integration',
    phase2: 'Marginal Gains & Automation',
    phase3: 'Strategic Reporting',
  },
};

// ── Timeline Months Mapping ──
export const timelineMonths: Record<TimelineOption, number> = {
  '3_months': 3,
  '6_months': 6,
  '12_months': 12,
};
