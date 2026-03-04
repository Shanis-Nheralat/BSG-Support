// ── Calculator Type Definitions ──

export type CurrencyCode = 'AED' | 'USD' | 'EUR' | 'GBP' | 'SAR' | 'QAR';

export interface CurrencyInfo {
  name: string;
  symbol: string;
  flag: string;
  formatting: 'standard' | 'prefix';
}

export type RoleLevelId = 'junior' | 'mid' | 'senior';

export interface OverheadDefaults {
  visaCosts: number;
  insurance: number;
  training: number;
  equipment: number;
  officeSpace: number;
  annualFlight: number;
}

export interface RoleLevel {
  name: string;
  salaries: Record<CurrencyCode, number>;
  overheads: Record<CurrencyCode, OverheadDefaults>;
  bsgRate: number;
  gradient: string;
  bgColor: string;
}

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

export interface FormDataState {
  selectedCurrency: CurrencyCode;
  fullName: string;
  companyEmail: string;
  companyName: string;
  mobileNumber: string;
  teamSize: string;
  fullSalary: string;
  visaCosts: string;
  visaCostsCustom: boolean;
  insurance: string;
  insuranceCustom: boolean;
  training: string;
  trainingCustom: boolean;
  equipment: string;
  equipmentCustom: boolean;
  officeSpace: string;
  officeSpaceCustom: boolean;
  leaveSalary: string;
  leaveSalaryCustom: boolean;
  annualFlight: string;
  annualFlightCustom: boolean;
  eosGratuity: string;
  eosGratuityCustom: boolean;
  otherCosts: string;
  teamMaturity: string;
  diagnosticAnswers: Record<number, number>;
  primaryGoal: string;
  targetEfficiency: string;
  timeline: string;
}

export interface EmployeeCostResult {
  fullSalary: number;
  totalOverheads: number;
  trueCost: number;
  autoEosGratuity: number;
  autoLeaveSalary: number;
  // Individual overhead breakdown
  visaCosts: number;
  insurance: number;
  training: number;
  equipment: number;
  officeSpace: number;
  leaveSalary: number;
  annualFlight: number;
  eosGratuity: number;
  otherCosts: number;
}

export interface KeyIssue {
  area: string;
  impact: 'High' | 'Moderate';
}

export interface DiagnosticResult {
  inefficiencyPercent: number;
  timeWasteHours: number;
  keyIssues: KeyIssue[];
}

export interface CalculationResults {
  employeeCost: EmployeeCostResult;
  teamSize: number;
  diagnosticResults: DiagnosticResult;
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
