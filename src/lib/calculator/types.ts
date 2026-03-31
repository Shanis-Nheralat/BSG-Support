// ── Calculator Type Definitions (V5 Enhanced) ──

// ── Country & Currency Codes ──
export type CountryCode = 'UAE' | 'DE' | 'UK' | 'SA' | 'QA' | 'US' | 'AU';
export type CurrencyCode = 'AED' | 'USD' | 'EUR' | 'GBP' | 'SAR' | 'QAR' | 'AUD';

export interface CurrencyInfo {
  name: string;
  symbol: string;
  flag: string;
  formatting: 'standard' | 'prefix';
}

// ── Goal & Configuration Types ──
export type GoalType = 'cost_reduction' | 'efficiency_boost' | 'quality_improvement' | 'scalability';
export type MaturityLevel = '1' | '2' | '3' | '4';
export type TimelineOption = '3_months' | '6_months' | '12_months';
export type EfficiencyTarget = '95' | '97' | '99';

export interface GoalConfig {
  label: string;
  icon: string;
  headerGradient: string;
  kpi1Label: string;
  kpi2Label: string;
  kpi3Label: string;
  leadNarrative: string;
}

export interface MaturityConfig {
  label: string;
  recommendation: string;
  description: string;
  phase1: string;
  phase2: string;
  phase3: string;
}

// ── Cost Category Types (Polymorphic Cost Engine) ──
export type CostCategoryType = 'flat' | 'pct' | 'pct_thresh' | 'pct_band' | 'pct_opt' | 'formula' | 'futa' | 'custom' | 'leave_flight';

export interface CostCategory {
  label: string;
  icon: string;
  description: string;
  includedItems: string[];
  type: CostCategoryType;
  rate?: number;
  ceil?: number | null;
  thresh?: number;
  lower?: number;
  upper?: number;
  formulaTag?: string;
  leaveRate?: number;
  flightFlat?: number;
}

// ── Country Profile ──
export interface CountryProfile {
  name: string;
  flag: string;
  currency: CurrencyCode;
  salaries: Record<RoleLevelId, number>;
  costCategories: Record<string, CostCategory>;
  defaults: Record<RoleLevelId, Record<string, number>>;
  bsgRates: Record<RoleLevelId, number>;
  eosFormula: ((salary: number) => number) | null;
  methodologyNote: string;
  bannerClass: string;
  bannerText: string;
}

// ── Role Levels ──
export type RoleLevelId = 'junior' | 'mid' | 'senior';

export interface RoleLevel {
  name: string;
  subtitle: string;
  gradient: string;
  bgColor: string;
}

// ── Team Definitions ──
export interface TaskDefinition {
  id: string;
  name: string;
  default: number;
}

export interface TeamDefinition {
  id: string;
  name: string;
  iconName: string;
  description: string;
  gradient: string;
  bgColor: string;
  borderColor: string;
  bsgServices: string[];
  tasks: TaskDefinition[];
}

// ── Diagnostic Questions ──
export interface QuestionOption {
  label: string;
  inefficiency: number;
  time_loss: number;
}

export interface TeamQuestion {
  question: string;
  weight: number;
  options: QuestionOption[];
}

// ── Form Data State ──
export interface FormDataState {
  // Contact
  fullName: string;
  companyEmail: string;
  companyName: string;
  mobileNumber: string;
  // Country & Currency
  selectedCountry: CountryCode;
  selectedCurrency: CurrencyCode;
  // Team & Role
  teamSize: string;
  fullSalary: string;
  // Cost overrides (keyed by cost category ID: c1, c2, etc.)
  costOverrides: Record<string, string>;
  costCustomFlags: Record<string, boolean>;
  otherCosts: string;
  // Maturity
  teamMaturity: MaturityLevel;
  // Diagnostics
  diagnosticAnswers: Record<number, number>;
  // Goals
  primaryGoal: GoalType;
  targetEfficiency: EfficiencyTarget;
  timeline: TimelineOption;
}

// ── Calculation Results ──
export interface CostBreakdownItem {
  label: string;
  value: number;
  icon?: string;
  type?: CostCategoryType;
}

export interface EmployeeCostResult {
  fullSalary: number;
  totalOverheads: number;
  trueCost: number;
  costBreakdown: Record<string, CostBreakdownItem>;
  otherCosts: number;
}

export interface DiagnosticFinding {
  question: string;
  answer: string;
  impactScore: number;
  timeWasteMinutes: number;
  weight: number;
  area: string;
  questionIndex: number;
  answerIndex: number;
}

export interface KeyIssue {
  area: string;
  impact: 'High' | 'Moderate';
}

export interface DiagnosticResult {
  inefficiencyPercent: number;
  timeWasteHours: number;
  keyIssues: KeyIssue[];
  findings: DiagnosticFinding[];
}

export interface TaskHandoverItem {
  name: string;
  pct: number;
  taskId: string;
}

export interface TaskHandoverResult {
  bsgTasks: TaskHandoverItem[];
  clientTasks: TaskHandoverItem[];
  bsgTotalPct: number;
  clientTotalPct: number;
  bsgHoursPerWeek: number;
  clientHoursPerWeek: number;
}

export interface RoadmapPhase {
  number: number;
  monthRange: string;
  name: string;
  accruedSavings: number;
}

export interface GoalKPI {
  value: string;
  label: string;
}

export interface CalculationResults {
  employeeCost: EmployeeCostResult;
  teamSize: number;
  diagnosticResults: DiagnosticResult;
  overheadRatio: number;
  bsgRateUsed: number;
  currentSituation: {
    teamCost: number;
    trueCostPerEmployee: number;
    productivityLoss: number;
    currentEfficiency: number;
  };
  withBSG: {
    bsgCostPerEmployee: number;
    bsgTotalCost: number;
    bsgEfficiency: number;
  };
  results: {
    realSavings: number;
    roi: number;
    hoursReclaimed: number;
    efficiencyGain: number;
    savingsRange: { min: number; max: number };
    roiRange: { min: number; max: number };
    isPositiveSavings: boolean;
  };
}
