import type {
  CurrencyCode,
  FormDataState,
  EmployeeCostResult,
  DiagnosticResult,
  CalculationResults,
  RoleLevel,
  TeamDefinition,
} from './types';
import { currencies, teamQuestions } from './constants';

/** Format a currency amount using the correct symbol/prefix */
export function formatCurrency(amount: number, currency: CurrencyCode = 'AED'): string {
  const data = currencies[currency];
  const formatted = Math.round(amount).toLocaleString();
  return data.formatting === 'prefix' ? `${data.symbol}${formatted}` : `${data.symbol} ${formatted}`;
}

/** Calculate the true cost of a single employee */
export function calculateEmployeeCost(
  formData: FormDataState,
  currentRoleDefaults: RoleLevel | undefined,
): EmployeeCostResult {
  try {
    const currency = formData.selectedCurrency;
    const roleData = currentRoleDefaults;

    const fullSalary = parseInt(formData.fullSalary) || (roleData ? roleData.salaries[currency] : 0);
    const autoEosGratuity = fullSalary > 0 ? Math.round((fullSalary / 365) * 21) : 0;
    // Leave Salary = salary / 12
    const autoLeaveSalary = fullSalary > 0 ? Math.round(fullSalary / 12) : 0;

    const defaults = roleData ? roleData.overheads[currency] : undefined;
    const visaCosts = formData.visaCostsCustom ? (parseInt(formData.visaCosts) || 0) : (defaults?.visaCosts ?? 0);
    const insurance = formData.insuranceCustom ? (parseInt(formData.insurance) || 0) : (defaults?.insurance ?? 0);
    const training = formData.trainingCustom ? (parseInt(formData.training) || 0) : (defaults?.training ?? 0);
    const equipment = formData.equipmentCustom ? (parseInt(formData.equipment) || 0) : (defaults?.equipment ?? 0);
    const officeSpace = formData.officeSpaceCustom ? (parseInt(formData.officeSpace) || 0) : (defaults?.officeSpace ?? 0);
    const leaveSalary = formData.leaveSalaryCustom ? (parseInt(formData.leaveSalary) || 0) : autoLeaveSalary;
    const annualFlight = formData.annualFlightCustom ? (parseInt(formData.annualFlight) || 0) : (defaults?.annualFlight ?? 0);
    const eosGratuity = formData.eosGratuityCustom ? (parseInt(formData.eosGratuity) || 0) : autoEosGratuity;
    const otherCosts = parseInt(formData.otherCosts) || 0;

    const totalOverheads = visaCosts + insurance + training + equipment + officeSpace + leaveSalary + annualFlight + eosGratuity + otherCosts;
    const trueCost = fullSalary + totalOverheads;

    return {
      fullSalary: Math.max(0, fullSalary),
      totalOverheads: Math.max(0, Math.round(totalOverheads)),
      trueCost: Math.max(0, Math.round(trueCost)),
      autoEosGratuity: Math.max(0, autoEosGratuity),
      autoLeaveSalary: Math.max(0, autoLeaveSalary),
      // Individual overhead breakdown
      visaCosts: Math.max(0, visaCosts),
      insurance: Math.max(0, insurance),
      training: Math.max(0, training),
      equipment: Math.max(0, equipment),
      officeSpace: Math.max(0, officeSpace),
      leaveSalary: Math.max(0, leaveSalary),
      annualFlight: Math.max(0, annualFlight),
      eosGratuity: Math.max(0, eosGratuity),
      otherCosts: Math.max(0, otherCosts),
    };
  } catch {
    return { fullSalary: 0, totalOverheads: 0, trueCost: 0, autoEosGratuity: 0, autoLeaveSalary: 0, visaCosts: 0, insurance: 0, training: 0, equipment: 0, officeSpace: 0, leaveSalary: 0, annualFlight: 0, eosGratuity: 0, otherCosts: 0 };
  }
}

/** Calculate diagnostic inefficiency results */
export function calculateDiagnosticResults(
  formData: FormDataState,
  currentTeam: TeamDefinition | undefined,
): DiagnosticResult {
  try {
    if (!currentTeam || !teamQuestions[currentTeam.id]) {
      return { inefficiencyPercent: 0, timeWasteHours: 0, keyIssues: [] };
    }

    const questions = teamQuestions[currentTeam.id];
    let totalScore = 0;
    let totalWeight = 0;
    let totalTimeWaste = 0;
    const keyIssues: DiagnosticResult['keyIssues'] = [];

    questions.forEach((question, index) => {
      const answerIndex = formData.diagnosticAnswers[index];
      if (answerIndex !== undefined && question.options[answerIndex]) {
        const selectedOption = question.options[answerIndex];
        const weightedScore = (selectedOption.inefficiency / 100) * question.weight;
        totalScore += weightedScore;
        totalWeight += question.weight;
        totalTimeWaste += selectedOption.time_loss;

        if (selectedOption.inefficiency >= 50) {
          keyIssues.push({
            area: question.question.split('?')[0] || 'Process Issue',
            impact: selectedOption.inefficiency >= 80 ? 'High' : 'Moderate',
          });
        }
      }
    });

    const inefficiencyPercent = totalWeight > 0 ? (totalScore / totalWeight) * 0.20 : 0;
    const timeWasteHours = totalTimeWaste / 60;

    return {
      inefficiencyPercent: Math.round(inefficiencyPercent * 100) / 100,
      timeWasteHours: Math.round(timeWasteHours * 10) / 10,
      keyIssues: keyIssues.slice(0, 3),
    };
  } catch {
    return { inefficiencyPercent: 0, timeWasteHours: 0, keyIssues: [] };
  }
}

/** Main efficiency calculation */
export function calculateEfficiency(
  formData: FormDataState,
  currentTeam: TeamDefinition | undefined,
  currentRoleDefaults: RoleLevel | undefined,
): CalculationResults {
  try {
    const teamSize = Math.max(1, parseInt(formData.teamSize) || 1);
    const employeeCost = calculateEmployeeCost(formData, currentRoleDefaults);
    const { fullSalary, trueCost } = employeeCost;
    const diagnosticResults = calculateDiagnosticResults(formData, currentTeam);

    const safeTrueCost = Math.max(1000, trueCost);
    const safeFullSalary = Math.max(1000, fullSalary);

    let productivityLoss = Math.max(0, Math.min(0.20, diagnosticResults.inefficiencyPercent));
    const teamMaturity = Math.max(1, Math.min(4, parseInt(formData.teamMaturity) || 2));
    const maturityModifier = (4 - teamMaturity) * 0.01;
    productivityLoss += maturityModifier;
    productivityLoss = Math.min(productivityLoss, 0.20);

    const bsgRate = currentRoleDefaults ? currentRoleDefaults.bsgRate : 0.80;
    const bsgMinimumAnnual = 42000; // AED 3,500/month minimum
    const bsgCostPerEmployee = Math.max(bsgMinimumAnnual, safeFullSalary * bsgRate);

    const currentTeamCost = teamSize * safeTrueCost;
    const bsgTotalCost = teamSize * bsgCostPerEmployee;

    const realSavings = currentTeamCost - bsgTotalCost;
    const currentEfficiency = Math.max(0, Math.min(100, 100 - (productivityLoss * 100)));
    const bsgMinimumEfficiency = Math.max(currentEfficiency + 1, 96);
    const efficiencyGain = Math.max(0, bsgMinimumEfficiency - currentEfficiency);

    const roi = bsgTotalCost > 0 && realSavings > 0 ? (realSavings / bsgTotalCost) * 100 : 0;
    const hoursReclaimed = diagnosticResults.timeWasteHours * teamSize;

    const savingsRange = { min: Math.round(realSavings * 0.90), max: Math.round(realSavings * 1.10) };
    const roiRange = { min: Math.max(0, Math.round(roi * 0.90)), max: Math.round(roi * 1.10) };

    return {
      employeeCost,
      teamSize,
      diagnosticResults,
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
        hoursReclaimed: Math.round(hoursReclaimed * 10) / 10,
        efficiencyGain: Math.round(efficiencyGain),
        savingsRange,
        roiRange,
        isPositiveSavings: realSavings > 0,
      },
    };
  } catch {
    return {
      employeeCost: { fullSalary: 0, totalOverheads: 0, trueCost: 0, autoEosGratuity: 0, autoLeaveSalary: 0, visaCosts: 0, insurance: 0, training: 0, equipment: 0, officeSpace: 0, leaveSalary: 0, annualFlight: 0, eosGratuity: 0, otherCosts: 0 },
      teamSize: 1,
      diagnosticResults: { inefficiencyPercent: 0, timeWasteHours: 0, keyIssues: [] },
      currentSituation: { teamCost: 0, trueCostPerEmployee: 0, productivityLoss: 0, currentEfficiency: 95 },
      withBSG: { bsgCostPerEmployee: 0, bsgTotalCost: 0, bsgEfficiency: 96 },
      results: { realSavings: 0, roi: 0, hoursReclaimed: 0, efficiencyGain: 1, savingsRange: { min: 0, max: 0 }, roiRange: { min: 0, max: 0 }, isPositiveSavings: false },
    };
  }
}
