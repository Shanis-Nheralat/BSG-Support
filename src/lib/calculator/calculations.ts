import type {
  CurrencyCode,
  FormDataState,
  EmployeeCostResult,
  DiagnosticResult,
  DiagnosticFinding,
  CalculationResults,
  CountryProfile,
  CostBreakdownItem,
  TeamDefinition,
  TaskHandoverResult,
  TaskHandoverItem,
  RoadmapPhase,
  GoalKPI,
  GoalType,
  MaturityLevel,
  TimelineOption,
  RoleLevelId,
} from './types';
import { currencies, teamQuestions } from './constants';
import { countryProfiles, goalConfigs, maturityConfigs, timelineMonths } from './countries';

/** Format a currency amount using the correct symbol/prefix */
export function formatCurrency(amount: number, currency: CurrencyCode = 'AED'): string {
  const data = currencies[currency];
  const formatted = Math.round(amount).toLocaleString();
  return data.formatting === 'prefix' ? `${data.symbol}${formatted}` : `${data.symbol} ${formatted}`;
}

/** Calculate a single cost category value using the polymorphic cost engine */
function calculateCostCategoryValue(
  categoryKey: string,
  salary: number,
  profile: CountryProfile,
  roleId: RoleLevelId,
  formData: FormDataState,
): number {
  const category = profile.costCategories[categoryKey];
  if (!category) return 0;

  // If user has overridden this category, use their value
  if (formData.costCustomFlags[categoryKey]) {
    return parseFloat(formData.costOverrides[categoryKey]) || 0;
  }

  switch (category.type) {
    case 'flat': {
      // Flat costs come from the country defaults table
      const defaults = profile.defaults[roleId] || {};
      return defaults[categoryKey] || 0;
    }
    case 'pct': {
      // Percentage of salary, with optional ceiling
      const base = category.ceil ? Math.min(salary, category.ceil) : salary;
      return Math.round(base * (category.rate || 0));
    }
    case 'pct_thresh': {
      // Percentage on earnings ABOVE a threshold
      return Math.round(Math.max(0, salary - (category.thresh || 0)) * (category.rate || 0));
    }
    case 'pct_band': {
      // Percentage on earnings within a band (lower..upper)
      const lo = category.lower || 0;
      const hi = category.upper || 999999;
      return Math.round(Math.max(0, Math.min(salary, hi) - lo) * (category.rate || 0));
    }
    case 'pct_opt': {
      // Optional percentage (e.g. 401k match) — same calc as pct
      const base = category.ceil ? Math.min(salary, category.ceil) : salary;
      return Math.round(base * (category.rate || 0));
    }
    case 'formula': {
      // Formula-based (e.g. EOS gratuity) — use the country's eosFormula
      return profile.eosFormula ? profile.eosFormula(salary) : 0;
    }
    case 'futa': {
      // FUTA — fixed $42/employee/year
      return 42;
    }
    case 'leave_flight': {
      // Leave salary (fraction of annual salary) + flat flight allowance
      return Math.round(salary * (category.leaveRate || 0)) + (category.flightFlat || 0);
    }
    case 'custom': {
      // Custom/user-entered — default from country defaults or 0
      const defaults = profile.defaults[roleId] || {};
      return defaults[categoryKey] || 0;
    }
    default:
      return 0;
  }
}

/** Calculate the true cost of a single employee using country-specific statutory model */
export function calculateEmployeeCost(
  formData: FormDataState,
  profile: CountryProfile,
  roleId: RoleLevelId,
): EmployeeCostResult {
  try {
    const fullSalary = parseInt(formData.fullSalary) || profile.salaries[roleId] || 0;
    const costBreakdown: Record<string, CostBreakdownItem> = {};
    let totalOverheads = 0;

    // Calculate each cost category from the country profile
    for (const [key, category] of Object.entries(profile.costCategories)) {
      const value = calculateCostCategoryValue(key, fullSalary, profile, roleId, formData);
      costBreakdown[key] = {
        label: category.label,
        value: Math.max(0, Math.round(value)),
        icon: category.icon,
        type: category.type,
      };
      totalOverheads += value;
    }

    const otherCosts = parseInt(formData.otherCosts) || 0;
    totalOverheads = Math.round(totalOverheads);
    const trueCost = fullSalary + totalOverheads;

    return {
      fullSalary: Math.max(0, fullSalary),
      totalOverheads: Math.max(0, totalOverheads),
      trueCost: Math.max(0, Math.round(trueCost)),
      costBreakdown,
      otherCosts: Math.max(0, otherCosts),
    };
  } catch {
    return {
      fullSalary: 0,
      totalOverheads: 0,
      trueCost: 0,
      costBreakdown: {},
      otherCosts: 0,
    };
  }
}

/** Calculate diagnostic inefficiency results with detailed findings */
export function calculateDiagnosticResults(
  formData: FormDataState,
  currentTeam: TeamDefinition | undefined,
): DiagnosticResult {
  try {
    if (!currentTeam || !teamQuestions[currentTeam.id]) {
      return { inefficiencyPercent: 0, timeWasteHours: 0, keyIssues: [], findings: [] };
    }

    const questions = teamQuestions[currentTeam.id];
    let totalScore = 0;
    let totalWeight = 0;
    let totalTimeWaste = 0;
    const keyIssues: DiagnosticResult['keyIssues'] = [];
    const findings: DiagnosticFinding[] = [];

    questions.forEach((question, index) => {
      const answerIndex = formData.diagnosticAnswers[index];
      if (answerIndex !== undefined && question.options[answerIndex]) {
        const selectedOption = question.options[answerIndex];
        const weightedScore = (selectedOption.inefficiency / 100) * question.weight;
        totalScore += weightedScore;
        totalWeight += question.weight;
        totalTimeWaste += selectedOption.time_loss;

        // Build detailed finding
        findings.push({
          question: question.question,
          answer: selectedOption.label,
          impactScore: selectedOption.inefficiency,
          timeWasteMinutes: selectedOption.time_loss,
          weight: question.weight,
          area: question.question.split('?')[0] || 'Process Issue',
          questionIndex: index,
          answerIndex,
        });

        if (selectedOption.inefficiency >= 50) {
          keyIssues.push({
            area: question.question.split('?')[0] || 'Process Issue',
            impact: selectedOption.inefficiency >= 80 ? 'High' : 'Moderate',
          });
        }
      }
    });

    const inefficiencyPercent = totalWeight > 0 ? Math.round((totalScore / totalWeight) * 0.20 * 100) / 100 : 0;
    const timeWasteHours = Math.round((totalTimeWaste / 60) * 10) / 10;

    // Sort findings by impact (highest first)
    findings.sort((a, b) => b.impactScore - a.impactScore);

    return {
      inefficiencyPercent,
      timeWasteHours,
      keyIssues: keyIssues.slice(0, 5),
      findings,
    };
  } catch {
    return { inefficiencyPercent: 0, timeWasteHours: 0, keyIssues: [], findings: [] };
  }
}

/** Calculate task handover split between BSG and client */
export function calculateTaskHandover(
  currentTeam: TeamDefinition | undefined,
  diagnosticResults: DiagnosticResult,
): TaskHandoverResult {
  if (!currentTeam) {
    return { bsgTasks: [], clientTasks: [], bsgTotalPct: 0, clientTotalPct: 0, bsgHoursPerWeek: 0, clientHoursPerWeek: 0 };
  }

  const bsgTasks: TaskHandoverItem[] = [];
  const clientTasks: TaskHandoverItem[] = [];
  const inefficiency = diagnosticResults.inefficiencyPercent;

  // Higher inefficiency = more tasks BSG absorbs
  // Tasks with lower default % (admin-type) go to BSG first, then expand
  const sortedTasks = [...currentTeam.tasks].sort((a, b) => a.default - b.default);

  let bsgTotalPct = 0;
  let clientTotalPct = 0;

  sortedTasks.forEach((task) => {
    // Admin tasks and lower-weight tasks go to BSG; strategic tasks stay with client
    // Scale: at 0% inefficiency, BSG takes ~30% of admin tasks. At 20%, BSG takes ~70%
    const bsgAbsorption = task.default <= 15
      ? Math.min(90, 40 + inefficiency * 250) // Admin/small tasks: 40-90% to BSG
      : task.default <= 25
        ? Math.min(60, 20 + inefficiency * 200) // Medium tasks: 20-60% to BSG
        : Math.min(30, 5 + inefficiency * 125); // Strategic tasks: 5-30% to BSG

    const bsgPct = Math.round(task.default * (bsgAbsorption / 100));
    const clientPct = task.default - bsgPct;

    if (bsgPct > 0) {
      bsgTasks.push({ name: task.name, pct: bsgPct, taskId: task.id });
      bsgTotalPct += bsgPct;
    }
    if (clientPct > 0) {
      clientTasks.push({ name: task.name, pct: clientPct, taskId: task.id });
      clientTotalPct += clientPct;
    }
  });

  const totalHoursPerWeek = 40;
  const bsgHoursPerWeek = Math.round((bsgTotalPct / 100) * totalHoursPerWeek * 10) / 10;
  const clientHoursPerWeek = Math.round((clientTotalPct / 100) * totalHoursPerWeek * 10) / 10;

  return {
    bsgTasks: bsgTasks.sort((a, b) => b.pct - a.pct),
    clientTasks: clientTasks.sort((a, b) => b.pct - a.pct),
    bsgTotalPct,
    clientTotalPct,
    bsgHoursPerWeek,
    clientHoursPerWeek,
  };
}

/** Calculate implementation roadmap phases */
export function calculateRoadmap(
  maturity: MaturityLevel,
  timeline: TimelineOption,
  annualSavings: number,
): RoadmapPhase[] {
  const matConfig = maturityConfigs[maturity];
  const months = timelineMonths[timeline];

  // Split timeline into 3 phases
  const phase1End = Math.max(1, Math.round(months * 0.3));
  const phase2End = Math.max(phase1End + 1, Math.round(months * 0.7));
  const phase3End = months;

  // Savings accrue progressively: 10% in phase 1, 40% through phase 2, 100% by phase 3
  const monthlySavings = annualSavings / 12;

  return [
    {
      number: 1,
      monthRange: `Month 1\u2013${phase1End}`,
      name: matConfig.phase1,
      accruedSavings: Math.round(monthlySavings * phase1End * 0.1),
    },
    {
      number: 2,
      monthRange: `Month ${phase1End + 1}\u2013${phase2End}`,
      name: matConfig.phase2,
      accruedSavings: Math.round(monthlySavings * phase2End * 0.4),
    },
    {
      number: 3,
      monthRange: `Month ${phase2End + 1}\u2013${phase3End}`,
      name: matConfig.phase3,
      accruedSavings: Math.round(monthlySavings * phase3End),
    },
  ];
}

/** Calculate goal-aligned KPIs */
export function calculateGoalKPIs(
  goal: GoalType,
  results: CalculationResults,
  currency: CurrencyCode,
): GoalKPI[] {
  const config = goalConfigs[goal];

  switch (goal) {
    case 'cost_reduction': {
      const paybackMonths = results.withBSG.bsgTotalCost > 0 && results.results.realSavings > 0
        ? Math.round((results.withBSG.bsgTotalCost / results.results.realSavings) * 12)
        : 0;
      return [
        { value: formatCurrency(results.results.realSavings, currency), label: config.kpi1Label },
        { value: `${results.overheadRatio}%`, label: config.kpi2Label },
        { value: paybackMonths > 0 ? `${paybackMonths} months` : 'Immediate', label: config.kpi3Label },
      ];
    }
    case 'efficiency_boost':
      return [
        { value: `+${results.results.efficiencyGain}%`, label: config.kpi1Label },
        { value: `${results.results.hoursReclaimed}h`, label: config.kpi2Label },
        { value: `${results.diagnosticResults.keyIssues.length} areas`, label: config.kpi3Label },
      ];
    case 'quality_improvement':
      return [
        { value: `${results.withBSG.bsgEfficiency}%`, label: config.kpi1Label },
        { value: `${results.diagnosticResults.findings.filter(f => f.impactScore >= 50).length} found`, label: config.kpi2Label },
        { value: `${Math.round(results.results.efficiencyGain * 1.5)}%`, label: config.kpi3Label },
      ];
    case 'scalability':
      return [
        { value: `${results.results.hoursReclaimed}h/wk`, label: config.kpi1Label },
        { value: `${results.teamSize} staff`, label: config.kpi2Label },
        { value: `${results.withBSG.bsgEfficiency}%`, label: config.kpi3Label },
      ];
    default:
      return [];
  }
}

/** Main efficiency calculation */
export function calculateEfficiency(
  formData: FormDataState,
  currentTeam: TeamDefinition | undefined,
  roleId: RoleLevelId,
): CalculationResults {
  try {
    const profile = countryProfiles[formData.selectedCountry];
    const teamSize = Math.max(1, parseInt(formData.teamSize) || 1);
    const employeeCost = calculateEmployeeCost(formData, profile, roleId);
    const { fullSalary, trueCost } = employeeCost;
    const diagnosticResults = calculateDiagnosticResults(formData, currentTeam);

    const safeTrueCost = Math.max(1000, trueCost);
    const safeFullSalary = Math.max(1000, fullSalary);

    // Overhead ratio (what % of true cost is overheads)
    const overheadRatio = safeTrueCost > 0 ? Math.round((employeeCost.totalOverheads / safeTrueCost) * 100) : 0;

    // Productivity loss from diagnostic + maturity
    let productivityLoss = Math.max(0, Math.min(0.20, diagnosticResults.inefficiencyPercent));
    const teamMaturity = Math.max(1, Math.min(4, parseInt(formData.teamMaturity) || 2));
    const maturityModifier = (4 - teamMaturity) * 0.01;
    productivityLoss = Math.min(productivityLoss + maturityModifier, 0.20);

    // BSG rate from country profile
    const bsgRate = profile.bsgRates[roleId] || 0.80;
    const bsgCostPerEmployee = safeFullSalary * bsgRate;

    const currentTeamCost = teamSize * safeTrueCost;
    const bsgTotalCost = teamSize * bsgCostPerEmployee;

    const realSavings = currentTeamCost - bsgTotalCost;
    const currentEfficiency = Math.max(0, Math.min(100, 100 - (productivityLoss * 100)));
    const bsgMinimumEfficiency = Math.max(currentEfficiency + 1, 96);
    const efficiencyGain = Math.max(0, bsgMinimumEfficiency - currentEfficiency);

    const roi = bsgTotalCost > 0 && realSavings > 0 ? (realSavings / bsgTotalCost) * 100 : 0;
    const hoursReclaimed = Math.round(diagnosticResults.timeWasteHours * teamSize * 10) / 10;

    const savingsRange = { min: Math.round(realSavings * 0.90), max: Math.round(realSavings * 1.10) };
    const roiRange = { min: Math.max(0, Math.round(roi * 0.90)), max: Math.round(roi * 1.10) };

    return {
      employeeCost,
      teamSize,
      diagnosticResults,
      overheadRatio,
      bsgRateUsed: bsgRate,
      currentSituation: {
        teamCost: Math.round(currentTeamCost),
        trueCostPerEmployee: Math.round(safeTrueCost),
        productivityLoss: Math.round(productivityLoss * 100),
        currentEfficiency: Math.round(currentEfficiency),
      },
      withBSG: {
        bsgCostPerEmployee: Math.round(bsgCostPerEmployee),
        bsgTotalCost: Math.round(bsgTotalCost),
        bsgEfficiency: Math.round(bsgMinimumEfficiency),
      },
      results: {
        realSavings: Math.round(realSavings),
        roi: Math.round(roi),
        hoursReclaimed,
        efficiencyGain: Math.round(efficiencyGain),
        savingsRange,
        roiRange,
        isPositiveSavings: realSavings > 0,
      },
    };
  } catch {
    return {
      employeeCost: { fullSalary: 0, totalOverheads: 0, trueCost: 0, costBreakdown: {}, otherCosts: 0 },
      teamSize: 1,
      diagnosticResults: { inefficiencyPercent: 0, timeWasteHours: 0, keyIssues: [], findings: [] },
      overheadRatio: 0,
      bsgRateUsed: 0.80,
      currentSituation: { teamCost: 0, trueCostPerEmployee: 0, productivityLoss: 0, currentEfficiency: 95 },
      withBSG: { bsgCostPerEmployee: 0, bsgTotalCost: 0, bsgEfficiency: 96 },
      results: { realSavings: 0, roi: 0, hoursReclaimed: 0, efficiencyGain: 1, savingsRange: { min: 0, max: 0 }, roiRange: { min: 0, max: 0 }, isPositiveSavings: false },
    };
  }
}
