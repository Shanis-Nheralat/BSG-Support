import type { FormDataState } from './types';
import { teamQuestions } from './constants';

/** Check if email is a company email (not free provider) */
export function isCompanyEmail(email: string): boolean {
  if (!email || !email.trim() || !email.includes('@')) return false;
  const freeDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 'aol.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  return !!domain && !freeDomains.includes(domain);
}

/** Check if mobile number is valid */
export function isValidMobileNumber(mobile: string): boolean {
  if (!mobile || !mobile.trim()) return false;
  const cleanNumber = mobile.replace(/[\s\-()]/g, '');
  const internationalPattern = /^\+\d{1,4}\d{6,}$/;
  const domesticPattern = /^\d{6,}$/;
  return internationalPattern.test(cleanNumber) || domesticPattern.test(cleanNumber);
}

/** Validate a specific wizard step - reordered with contact info at end */
export function validateStep(
  step: number,
  formData: FormDataState,
  selectedTeam: string,
  selectedRole: string,
  totalAllocation: number,
): boolean {
  switch (step) {
    case 0: // Select Your Team
      return !!selectedTeam;
    case 1: // Role & Team Size
      return !!selectedRole && !!formData.teamSize?.trim();
    case 2: // Cost Breakdown
      return !!formData.fullSalary && parseInt(formData.fullSalary) > 0;
    case 3: // Task Allocation
      return totalAllocation >= 98 && totalAllocation <= 102;
    case 4: { // Team Diagnostics
      const questions = teamQuestions[selectedTeam] || [];
      return questions.every((_, index) => formData.diagnosticAnswers[index] !== undefined);
    }
    case 5: // Goals & Timeline
      return !!(formData.primaryGoal && formData.targetEfficiency && formData.timeline);
    case 6: // Contact Information (now at end)
      return !!(
        formData.fullName?.trim() &&
        formData.companyEmail?.trim() &&
        isCompanyEmail(formData.companyEmail) &&
        formData.companyName?.trim() &&
        formData.mobileNumber?.trim() &&
        isValidMobileNumber(formData.mobileNumber) &&
        formData.selectedCurrency
      );
    default:
      return true;
  }
}
