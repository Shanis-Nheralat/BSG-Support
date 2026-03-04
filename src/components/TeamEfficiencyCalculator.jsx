import React, { useState } from 'react';
import { 
  ChevronRight, CheckCircle, AlertCircle, Download, 
  Users, DollarSign, Clock, TrendingUp, Info, Building, User, Target, 
  Settings, Shield, Headphones, Calculator, FileText, AlertTriangle,
  X, Check, Mail, CreditCard, Briefcase, Heart, GraduationCap, 
  Laptop, Home, PiggyBank, Plane, ChevronDown
} from 'lucide-react';

const TeamEfficiencyCalculator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [taskAllocations, setTaskAllocations] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    // Currency selection
    selectedCurrency: 'AED',
    // Contact fields
    fullName: '', 
    companyEmail: '', 
    companyName: '', 
    mobileNumber: '', 
    teamSize: '',
    // Cost fields
    fullSalary: '', 
    visaCosts: '', 
    visaCostsCustom: false, 
    insurance: '', 
    insuranceCustom: false,
    training: '', 
    trainingCustom: false, 
    equipment: '', 
    equipmentCustom: false,
    officeSpace: '', 
    officeSpaceCustom: false, 
    eosGratuity: '', 
    eosGratuityCustom: false,
    otherCosts: '0', 
    // Assessment fields
    teamMaturity: '', 
    diagnosticAnswers: {}, 
    primaryGoal: '', 
    targetEfficiency: '', 
    timeline: ''
  });
  
  const totalSteps = 7;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  // Currency definitions with flags and symbols
  const currencies = {
    AED: { name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪', formatting: 'standard' },
    USD: { name: 'US Dollar', symbol: '$', flag: '🇺🇸', formatting: 'prefix' },
    EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺', formatting: 'prefix' },
    GBP: { name: 'British Pound', symbol: '£', flag: '🇬🇧', formatting: 'prefix' },
    SAR: { name: 'Saudi Riyal', symbol: 'SAR', flag: '🇸🇦', formatting: 'standard' },
    QAR: { name: 'Qatari Riyal', symbol: 'QAR', flag: '🇶🇦', formatting: 'standard' }
  };

  // Currency-specific role defaults
  const roleDefaults = {
    junior: { 
      name: 'Junior-Level (Admin, Support Staff)', 
      salaries: { AED: 48000, USD: 35000, EUR: 32000, GBP: 28000, SAR: 45000, QAR: 50000 },
      overheads: { 
        AED: { visaCosts: 3750, insurance: 1899, training: 1500, equipment: 4000, officeSpace: 12000 },
        USD: { visaCosts: 1000, insurance: 2400, training: 1200, equipment: 3200, officeSpace: 9600 },
        EUR: { visaCosts: 900, insurance: 2200, training: 1100, equipment: 3000, officeSpace: 9000 },
        GBP: { visaCosts: 800, insurance: 1900, training: 1000, equipment: 2800, officeSpace: 8400 },
        SAR: { visaCosts: 3500, insurance: 1800, training: 1400, equipment: 3800, officeSpace: 11400 },
        QAR: { visaCosts: 4000, insurance: 2000, training: 1600, equipment: 4200, officeSpace: 12600 }
      },
      bsgRate: 0.75, 
      gradient: 'from-green-400 to-emerald-600', 
      bgColor: 'bg-green-50' 
    },
    mid: { 
      name: 'Mid-Level (Accountant, HR Executive)', 
      salaries: { AED: 60000, USD: 55000, EUR: 50000, GBP: 42000, SAR: 65000, QAR: 70000 },
      overheads: { 
        AED: { visaCosts: 3500, insurance: 1899, training: 2000, equipment: 4000, officeSpace: 12000 },
        USD: { visaCosts: 950, insurance: 2400, training: 1600, equipment: 3200, officeSpace: 9600 },
        EUR: { visaCosts: 850, insurance: 2200, training: 1500, equipment: 3000, officeSpace: 9000 },
        GBP: { visaCosts: 750, insurance: 1900, training: 1300, equipment: 2800, officeSpace: 8400 },
        SAR: { visaCosts: 3300, insurance: 1800, training: 1900, equipment: 3800, officeSpace: 11400 },
        QAR: { visaCosts: 3800, insurance: 2000, training: 2100, equipment: 4200, officeSpace: 12600 }
      },
      bsgRate: 0.84, 
      gradient: 'from-navy-400 to-navy-700', 
      bgColor: 'bg-navy-50' 
    },
    senior: { 
      name: 'Senior-Level (Finance Manager, Operations Head)', 
      salaries: { AED: 120000, USD: 95000, EUR: 85000, GBP: 75000, SAR: 120000, QAR: 130000 },
      overheads: { 
        AED: { visaCosts: 5000, insurance: 4000, training: 3000, equipment: 5000, officeSpace: 15000 },
        USD: { visaCosts: 1400, insurance: 3200, training: 2400, equipment: 4000, officeSpace: 12000 },
        EUR: { visaCosts: 1200, insurance: 2900, training: 2200, equipment: 3700, officeSpace: 11100 },
        GBP: { visaCosts: 1100, insurance: 2600, training: 2000, equipment: 3500, officeSpace: 10500 },
        SAR: { visaCosts: 4700, insurance: 3800, training: 2850, equipment: 4750, officeSpace: 14250 },
        QAR: { visaCosts: 5200, insurance: 4200, training: 3150, equipment: 5250, officeSpace: 15750 }
      },
      bsgRate: 0.80, 
      gradient: 'from-gold-400 to-gold-700', 
      bgColor: 'bg-gold-50' 
    }
  };
  
  // Complete diagnostic questions for ALL 6 teams (5 questions each)
  const teamQuestions = {
    sales: [
      { 
        question: "How often do follow-ups get missed or delayed?", 
        weight: 25, 
        options: [
          { label: "Never - Automated systems", inefficiency: 0, time_loss: 0 }, 
          { label: "Sometimes - Manual tracking", inefficiency: 50, time_loss: 45 }, 
          { label: "Often - No systematic approach", inefficiency: 100, time_loss: 90 }
        ] 
      },
      { 
        question: "Are proposals created from templates or from scratch?", 
        weight: 20, 
        options: [
          { label: "Always use templates", inefficiency: 0, time_loss: 0 }, 
          { label: "Somewhat templated", inefficiency: 50, time_loss: 30 }, 
          { label: "Created manually each time", inefficiency: 100, time_loss: 60 }
        ] 
      },
      { 
        question: "Is CRM data entry automated or manual?", 
        weight: 20, 
        options: [
          { label: "Fully automated", inefficiency: 0, time_loss: 0 }, 
          { label: "Mixed approach", inefficiency: 50, time_loss: 30 }, 
          { label: "Completely manual", inefficiency: 100, time_loss: 60 }
        ] 
      },
      { 
        question: "How often do meetings need rescheduling due to conflicts?", 
        weight: 15, 
        options: [
          { label: "Rarely - Good coordination", inefficiency: 0, time_loss: 0 }, 
          { label: "Sometimes - Manual scheduling", inefficiency: 50, time_loss: 15 }, 
          { label: "Often - Poor coordination", inefficiency: 100, time_loss: 30 }
        ] 
      },
      { 
        question: "Are client communications tracked systematically?", 
        weight: 20, 
        options: [
          { label: "Always tracked automatically", inefficiency: 0, time_loss: 0 }, 
          { label: "Mixed tracking", inefficiency: 50, time_loss: 30 }, 
          { label: "Not systematically tracked", inefficiency: 100, time_loss: 60 }
        ] 
      }
    ],
    underwriting: [
      { 
        question: "How often do risk assessments get delayed due to missing information?", 
        weight: 25, 
        options: [
          { label: "Never - Complete data upfront", inefficiency: 0, time_loss: 0 }, 
          { label: "Sometimes - Minor delays", inefficiency: 50, time_loss: 45 }, 
          { label: "Often - Major delays", inefficiency: 100, time_loss: 90 }
        ] 
      },
      { 
        question: "Is policy data input automated or manual?", 
        weight: 20, 
        options: [
          { label: "Fully automated systems", inefficiency: 0, time_loss: 0 }, 
          { label: "Partially automated", inefficiency: 50, time_loss: 30 }, 
          { label: "Completely manual entry", inefficiency: 100, time_loss: 60 }
        ] 
      },
      { 
        question: "How often do you reassess the same risks multiple times?", 
        weight: 20, 
        options: [
          { label: "Never - Clear guidelines", inefficiency: 0, time_loss: 0 }, 
          { label: "Sometimes - Unclear cases", inefficiency: 50, time_loss: 30 }, 
          { label: "Often - No clear standards", inefficiency: 100, time_loss: 60 }
        ] 
      },
      { 
        question: "Are policy notes and decisions clearly documented?", 
        weight: 15, 
        options: [
          { label: "Always - Standardized format", inefficiency: 0, time_loss: 0 }, 
          { label: "Usually - Some gaps", inefficiency: 50, time_loss: 15 }, 
          { label: "Poorly documented", inefficiency: 100, time_loss: 30 }
        ] 
      },
      { 
        question: "How smooth are handoffs between underwriting and other teams?", 
        weight: 20, 
        options: [
          { label: "Seamless - Clear process", inefficiency: 0, time_loss: 0 }, 
          { label: "Some friction", inefficiency: 50, time_loss: 30 }, 
          { label: "Frequent miscommunication", inefficiency: 100, time_loss: 60 }
        ] 
      }
    ],
    claims: [
      { 
        question: "How often do required documents go missing or get delayed?", 
        weight: 25, 
        options: [
          { label: "Never - Digital tracking", inefficiency: 0, time_loss: 0 }, 
          { label: "Sometimes - Manual tracking", inefficiency: 50, time_loss: 45 }, 
          { label: "Often - Poor documentation", inefficiency: 100, time_loss: 90 }
        ] 
      },
      { 
        question: "Are claim status updates automated or manual?", 
        weight: 20, 
        options: [
          { label: "Fully automated", inefficiency: 0, time_loss: 0 }, 
          { label: "Partially automated", inefficiency: 50, time_loss: 30 }, 
          { label: "Completely manual", inefficiency: 100, time_loss: 60 }
        ] 
      },
      { 
        question: "How often do customers call asking for claim updates?", 
        weight: 15, 
        options: [
          { label: "Rarely - Proactive updates", inefficiency: 0, time_loss: 0 }, 
          { label: "Sometimes", inefficiency: 50, time_loss: 20 }, 
          { label: "Very often - Poor communication", inefficiency: 100, time_loss: 40 }
        ] 
      },
      { 
        question: "Is document verification done manually or automated?", 
        weight: 20, 
        options: [
          { label: "Automated verification", inefficiency: 0, time_loss: 0 }, 
          { label: "Semi-automated", inefficiency: 50, time_loss: 30 }, 
          { label: "Completely manual", inefficiency: 100, time_loss: 60 }
        ] 
      },
      { 
        question: "How often do claims get delayed due to missing information?", 
        weight: 20, 
        options: [
          { label: "Rarely - Complete submissions", inefficiency: 0, time_loss: 0 }, 
          { label: "Sometimes", inefficiency: 50, time_loss: 30 }, 
          { label: "Frequently - Poor initial review", inefficiency: 100, time_loss: 60 }
        ] 
      }
    ],
    customer_service: [
      { 
        question: "How quickly do you respond to customer inquiries?", 
        weight: 25, 
        options: [
          { label: "Immediately - Automated responses", inefficiency: 0, time_loss: 0 }, 
          { label: "Within hours - Manual tracking", inefficiency: 50, time_loss: 45 }, 
          { label: "Days - No systematic approach", inefficiency: 100, time_loss: 90 }
        ] 
      },
      { 
        question: "Is complaint tracking automated or manual?", 
        weight: 20, 
        options: [
          { label: "Fully automated system", inefficiency: 0, time_loss: 0 }, 
          { label: "Partially tracked", inefficiency: 50, time_loss: 30 }, 
          { label: "Manual spreadsheets", inefficiency: 100, time_loss: 60 }
        ] 
      },
      { 
        question: "How are policy changes processed?", 
        weight: 20, 
        options: [
          { label: "Automated workflow", inefficiency: 0, time_loss: 0 }, 
          { label: "Semi-automated", inefficiency: 50, time_loss: 30 }, 
          { label: "Completely manual", inefficiency: 100, time_loss: 60 }
        ] 
      },
      { 
        question: "How often do customers repeat the same information to different agents?", 
        weight: 15, 
        options: [
          { label: "Never - Shared system", inefficiency: 0, time_loss: 0 }, 
          { label: "Sometimes", inefficiency: 50, time_loss: 15 }, 
          { label: "Often - No information sharing", inefficiency: 100, time_loss: 30 }
        ] 
      },
      { 
        question: "Are customer interactions logged systematically?", 
        weight: 20, 
        options: [
          { label: "Always - Automated logging", inefficiency: 0, time_loss: 0 }, 
          { label: "Usually - Manual notes", inefficiency: 50, time_loss: 30 }, 
          { label: "Inconsistent logging", inefficiency: 100, time_loss: 60 }
        ] 
      }
    ],
    finance: [
      { 
        question: "How often do account reconciliations require manual intervention?", 
        weight: 25, 
        options: [
          { label: "Never - Fully automated", inefficiency: 0, time_loss: 0 }, 
          { label: "Sometimes - Semi-automated", inefficiency: 50, time_loss: 45 }, 
          { label: "Often - Mostly manual", inefficiency: 100, time_loss: 90 }
        ] 
      },
      { 
        question: "Are financial reports generated automatically or manually?", 
        weight: 20, 
        options: [
          { label: "Fully automated", inefficiency: 0, time_loss: 0 }, 
          { label: "Partially automated", inefficiency: 50, time_loss: 30 }, 
          { label: "Manual compilation", inefficiency: 100, time_loss: 60 }
        ] 
      },
      { 
        question: "How often do payment follow-ups get missed?", 
        weight: 20, 
        options: [
          { label: "Never - Automated reminders", inefficiency: 0, time_loss: 0 }, 
          { label: "Sometimes - Manual tracking", inefficiency: 50, time_loss: 30 }, 
          { label: "Often - No systematic follow-up", inefficiency: 100, time_loss: 60 }
        ] 
      },
      { 
        question: "How frequently do invoice errors occur?", 
        weight: 15, 
        options: [
          { label: "Rarely - Automated validation", inefficiency: 0, time_loss: 0 }, 
          { label: "Sometimes", inefficiency: 50, time_loss: 15 }, 
          { label: "Often - Manual processes", inefficiency: 100, time_loss: 30 }
        ] 
      },
      { 
        question: "Is expense tracking automated or manual?", 
        weight: 20, 
        options: [
          { label: "Fully automated", inefficiency: 0, time_loss: 0 }, 
          { label: "Semi-automated", inefficiency: 50, time_loss: 30 }, 
          { label: "Manual spreadsheets", inefficiency: 100, time_loss: 60 }
        ] 
      }
    ],
    compliance: [
      { 
        question: "How much time is spent preparing for audits?", 
        weight: 25, 
        options: [
          { label: "Minimal - Always audit-ready", inefficiency: 0, time_loss: 0 }, 
          { label: "Moderate preparation needed", inefficiency: 50, time_loss: 45 }, 
          { label: "Extensive preparation required", inefficiency: 100, time_loss: 90 }
        ] 
      },
      { 
        question: "Are compliance logs maintained automatically?", 
        weight: 20, 
        options: [
          { label: "Fully automated logging", inefficiency: 0, time_loss: 0 }, 
          { label: "Partially automated", inefficiency: 50, time_loss: 30 }, 
          { label: "Manual record keeping", inefficiency: 100, time_loss: 60 }
        ] 
      },
      { 
        question: "How often do policy updates get missed or delayed?", 
        weight: 20, 
        options: [
          { label: "Never - Automated alerts", inefficiency: 0, time_loss: 0 }, 
          { label: "Sometimes - Manual monitoring", inefficiency: 50, time_loss: 30 }, 
          { label: "Often - Poor tracking", inefficiency: 100, time_loss: 60 }
        ] 
      },
      { 
        question: "Do you experience alert fatigue from compliance systems?", 
        weight: 15, 
        options: [
          { label: "No - Smart filtering", inefficiency: 0, time_loss: 0 }, 
          { label: "Sometimes - Too many alerts", inefficiency: 50, time_loss: 15 }, 
          { label: "Often - Information overload", inefficiency: 100, time_loss: 30 }
        ] 
      },
      { 
        question: "Is regulatory reporting automated or manual?", 
        weight: 20, 
        options: [
          { label: "Fully automated", inefficiency: 0, time_loss: 0 }, 
          { label: "Semi-automated", inefficiency: 50, time_loss: 30 }, 
          { label: "Manual compilation", inefficiency: 100, time_loss: 60 }
        ] 
      }
    ]
  };
  
  // Complete team definitions - ALL 6 TEAMS
  const teams = [
    { 
      id: 'sales', 
      name: 'Sales Team', 
      icon: <DollarSign className="h-6 w-6" />, 
      description: 'Lead generation, client meetings, proposal creation', 
      gradient: 'from-green-400 to-emerald-600', 
      bgColor: 'bg-green-50', 
      borderColor: 'border-green-500', 
      bsgServices: ['Lead follow-up scheduling', 'Proposal formatting', 'CRM updates', 'Meeting coordination'], 
      tasks: [
        { id: 'lead_generation', name: 'Lead Generation & Prospecting', default: 25 }, 
        { id: 'client_meetings', name: 'Client Meetings & Presentations', default: 30 }, 
        { id: 'proposal_creation', name: 'Proposal Creation & Documentation', default: 20 }, 
        { id: 'follow_up', name: 'Follow-up & Relationship Management', default: 15 }, 
        { id: 'admin_sales', name: 'Administrative Tasks', default: 10 }
      ] 
    },
    { 
      id: 'underwriting', 
      name: 'Underwriting Team', 
      icon: <Shield className="h-6 w-6" />, 
      description: 'Risk assessment, policy evaluation, decision making', 
      gradient: 'from-navy-400 to-navy-700', 
      bgColor: 'bg-navy-50', 
      borderColor: 'border-navy', 
      bsgServices: ['Document collection', 'Risk data compilation', 'Policy template prep', 'Stakeholder coordination'], 
      tasks: [
        { id: 'risk_assessment', name: 'Risk Assessment & Analysis', default: 35 }, 
        { id: 'policy_review', name: 'Policy Review & Evaluation', default: 25 }, 
        { id: 'documentation', name: 'Documentation & Reporting', default: 20 }, 
        { id: 'stakeholder_communication', name: 'Stakeholder Communication', default: 10 }, 
        { id: 'admin_underwriting', name: 'Administrative Tasks', default: 10 }
      ] 
    },
    { 
      id: 'claims', 
      name: 'Claims Team', 
      icon: <FileText className="h-6 w-6" />, 
      description: 'Claims processing, investigation, settlement', 
      gradient: 'from-orange-400 to-red-600', 
      bgColor: 'bg-orange-50', 
      borderColor: 'border-orange-500', 
      bsgServices: ['Claim documentation', 'Customer coordination', 'Document verification', 'Settlement paperwork'], 
      tasks: [
        { id: 'claim_processing', name: 'Claim Processing & Investigation', default: 40 }, 
        { id: 'customer_communication', name: 'Customer Communication', default: 20 }, 
        { id: 'documentation_claims', name: 'Documentation & Record Keeping', default: 15 }, 
        { id: 'settlement_processing', name: 'Settlement Processing', default: 15 }, 
        { id: 'admin_claims', name: 'Administrative Tasks', default: 10 }
      ] 
    },
    { 
      id: 'customer_service', 
      name: 'Customer Service', 
      icon: <Headphones className="h-6 w-6" />, 
      description: 'Customer inquiries, policy changes, renewals', 
      gradient: 'from-gold-400 to-gold-700', 
      bgColor: 'bg-gold-50', 
      borderColor: 'border-gold-500', 
      bsgServices: ['Inquiry handling', 'Policy documentation', 'Renewal coordination', 'Complaint tracking'], 
      tasks: [
        { id: 'customer_inquiries', name: 'Customer Inquiries & Support', default: 40 }, 
        { id: 'policy_changes', name: 'Policy Changes & Updates', default: 20 }, 
        { id: 'renewals', name: 'Policy Renewals', default: 15 }, 
        { id: 'complaint_handling', name: 'Complaint Handling', default: 15 }, 
        { id: 'admin_cs', name: 'Administrative Tasks', default: 10 }
      ] 
    },
    { 
      id: 'finance', 
      name: 'Finance Team', 
      icon: <Calculator className="h-6 w-6" />, 
      description: 'Accounting, reporting, billing, financial analysis', 
      gradient: 'from-teal-400 to-cyan-600', 
      bgColor: 'bg-teal-50', 
      borderColor: 'border-teal-500', 
      bsgServices: ['Invoice processing', 'Bookkeeping support', 'Report preparation', 'Payment follow-up'], 
      tasks: [
        { id: 'accounting', name: 'Accounting & Bookkeeping', default: 30 }, 
        { id: 'financial_reporting', name: 'Financial Reporting', default: 20 }, 
        { id: 'billing_collections', name: 'Billing & Collections', default: 15 }, 
        { id: 'financial_analysis', name: 'Financial Analysis', default: 15 }, 
        { id: 'regulatory_reporting', name: 'Regulatory Reporting', default: 20 }
      ] 
    },
    { 
      id: 'compliance', 
      name: 'Compliance Team', 
      icon: <Settings className="h-6 w-6" />, 
      description: 'Regulatory reporting, risk monitoring, audit support', 
      gradient: 'from-navy-500 to-navy-700', 
      bgColor: 'bg-navy-50', 
      borderColor: 'border-navy-500', 
      bsgServices: ['Document compilation', 'Compliance tracking', 'Audit preparation', 'Policy coordination'], 
      tasks: [
        { id: 'regulatory_monitoring', name: 'Regulatory Monitoring', default: 25 }, 
        { id: 'compliance_reporting', name: 'Compliance Reporting', default: 25 }, 
        { id: 'audit_support', name: 'Audit Support', default: 20 }, 
        { id: 'policy_updates', name: 'Policy & Procedure Updates', default: 15 }, 
        { id: 'training_compliance', name: 'Training & Communication', default: 15 }
      ] 
    }
  ];
  
  const currentTeam = teams.find(team => team.id === selectedTeam);
  const currentRoleDefaults = roleDefaults[selectedRole];
  const selectedCurrency = formData.selectedCurrency;
  const currencyInfo = currencies[selectedCurrency];
  
  // Currency formatting helper
  const formatCurrency = (amount, currency = selectedCurrency) => {
    const currencyData = currencies[currency];
    const formattedAmount = Math.round(amount).toLocaleString();
    
    if (currencyData.formatting === 'prefix') {
      return `${currencyData.symbol}${formattedAmount}`;
    } else {
      return `${currencyData.symbol} ${formattedAmount}`;
    }
  };
  
  // Validation functions
  const isCompanyEmail = (email) => {
    if (!email || !email.trim() || !email.includes('@')) return false;
    const gmailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 'aol.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    return domain && !gmailDomains.includes(domain);
  };

  const isValidMobileNumber = (mobile) => {
    if (!mobile || !mobile.trim()) return false;
    const cleanNumber = mobile.replace(/[\s\-\(\)]/g, '');
    const internationalPattern = /^\+\d{1,4}\d{6,}$/;
    const domesticPattern = /^\d{6,}$/;
    return internationalPattern.test(cleanNumber) || domesticPattern.test(cleanNumber);
  };
  
  // Currency-aware calculation functions
  const calculateEmployeeCost = () => {
    try {
      const currency = formData.selectedCurrency;
      const roleData = currentRoleDefaults;
      
      const fullSalary = parseInt(formData.fullSalary) || (roleData ? roleData.salaries[currency] : 0);
      const autoEosGratuity = fullSalary > 0 ? Math.round((fullSalary / 365) * 21) : 0;
      
      const defaults = roleData ? roleData.overheads[currency] : {};
      const visaCosts = formData.visaCostsCustom ? (parseInt(formData.visaCosts) || 0) : (defaults.visaCosts || 0);
      const insurance = formData.insuranceCustom ? (parseInt(formData.insurance) || 0) : (defaults.insurance || 0);
      const training = formData.trainingCustom ? (parseInt(formData.training) || 0) : (defaults.training || 0);
      const equipment = formData.equipmentCustom ? (parseInt(formData.equipment) || 0) : (defaults.equipment || 0);
      const officeSpace = formData.officeSpaceCustom ? (parseInt(formData.officeSpace) || 0) : (defaults.officeSpace || 0);
      const eosGratuity = formData.eosGratuityCustom ? (parseInt(formData.eosGratuity) || 0) : autoEosGratuity;
      const otherCosts = parseInt(formData.otherCosts) || 0;
      
      const totalOverheads = visaCosts + insurance + training + equipment + officeSpace + eosGratuity + otherCosts;
      const trueCost = fullSalary + totalOverheads;
      
      return { 
        fullSalary: Math.max(0, fullSalary), 
        totalOverheads: Math.max(0, Math.round(totalOverheads)), 
        trueCost: Math.max(0, Math.round(trueCost)), 
        autoEosGratuity: Math.max(0, autoEosGratuity) 
      };
    } catch (error) {
      return { fullSalary: 0, totalOverheads: 0, trueCost: 0, autoEosGratuity: 0 };
    }
  };
  
  // Diagnostic calculation
  const calculateDiagnosticResults = () => {
    try {
      if (!currentTeam || !teamQuestions[currentTeam.id]) return { inefficiencyPercent: 0, timeWasteHours: 0, keyIssues: [] };
      
      const questions = teamQuestions[currentTeam.id];
      let totalScore = 0; 
      let totalWeight = 0; 
      let totalTimeWaste = 0; 
      const keyIssues = [];
      
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
              impact: selectedOption.inefficiency >= 80 ? 'High' : 'Moderate' 
            });
          }
        }
      });
      
      const inefficiencyPercent = totalWeight > 0 ? (totalScore / totalWeight) * 0.20 : 0;
      const timeWasteHours = totalTimeWaste / 60;
      
      return { 
        inefficiencyPercent: Math.round(inefficiencyPercent * 100) / 100, 
        timeWasteHours: Math.round(timeWasteHours * 10) / 10, 
        keyIssues: keyIssues.slice(0, 3) 
      };
    } catch (error) {
      return { inefficiencyPercent: 0, timeWasteHours: 0, keyIssues: [] };
    }
  };
  
  // Main efficiency calculation
  const calculateEfficiency = () => {
    try {
      const teamSize = Math.max(1, parseInt(formData.teamSize) || 1);
      const employeeCost = calculateEmployeeCost();
      const { fullSalary, trueCost } = employeeCost;
      const diagnosticResults = calculateDiagnosticResults();
      
      const safeTrueCost = Math.max(1000, trueCost);
      const safeFullSalary = Math.max(1000, fullSalary);
      
      let productivityLoss = Math.max(0, Math.min(0.20, diagnosticResults.inefficiencyPercent));
      const teamMaturity = Math.max(1, Math.min(4, parseInt(formData.teamMaturity) || 2));
      const maturityModifier = (4 - teamMaturity) * 0.01;
      productivityLoss += maturityModifier;
      productivityLoss = Math.min(productivityLoss, 0.20);
      
      const bsgRate = currentRoleDefaults ? currentRoleDefaults.bsgRate : 0.80;
      const bsgCostPerEmployee = safeFullSalary * bsgRate;
      
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
          currentEfficiency: Math.round(currentEfficiency) 
        },
        withBSG: { 
          bsgCostPerEmployee: Math.round(bsgCostPerEmployee), 
          bsgTotalCost: Math.round(bsgTotalCost), 
          bsgEfficiency: Math.round(bsgMinimumEfficiency) 
        },
        results: { 
          realSavings: Math.round(realSavings), 
          roi: Math.round(roi), 
          hoursReclaimed: Math.round(hoursReclaimed * 10) / 10, 
          efficiencyGain: Math.round(efficiencyGain), 
          savingsRange, 
          roiRange, 
          isPositiveSavings: realSavings > 0 
        }
      };
    } catch (error) {
      return { 
        employeeCost: { fullSalary: 0, totalOverheads: 0, trueCost: 0, autoEosGratuity: 0 }, 
        teamSize: 1, 
        diagnosticResults: { inefficiencyPercent: 0, timeWasteHours: 0, keyIssues: [] }, 
        currentSituation: { teamCost: 0, trueCostPerEmployee: 0, productivityLoss: 0, currentEfficiency: 95 }, 
        withBSG: { bsgCostPerEmployee: 0, bsgTotalCost: 0, bsgEfficiency: 96 }, 
        results: { realSavings: 0, roi: 0, hoursReclaimed: 0, efficiencyGain: 1, savingsRange: { min: 0, max: 0 }, roiRange: { min: 0, max: 0 }, isPositiveSavings: false } 
      };
    }
  };

  // DIAGNOSTIC TEST FUNCTIONS - Added for calculation verification
  const runDiagnosticTest = () => {
    console.log("🔍 RUNNING CALCULATION DIAGNOSTIC TEST");
    
    // Test Case 1: Basic Employee Cost Calculation
    console.log("\n📊 TEST 1: Employee Cost Calculation");
    const testEmployeeCost = calculateEmployeeCost();
    console.log("Full Salary:", testEmployeeCost.fullSalary);
    console.log("Total Overheads:", testEmployeeCost.totalOverheads);
    console.log("True Cost:", testEmployeeCost.trueCost);
    console.log("Auto EOS Gratuity:", testEmployeeCost.autoEosGratuity);
    
    // Verify EOS calculation: (salary/365)*21 days
    const expectedEOS = testEmployeeCost.fullSalary > 0 ? Math.round((testEmployeeCost.fullSalary / 365) * 21) : 0;
    console.log("Expected EOS:", expectedEOS, "| Actual EOS:", testEmployeeCost.autoEosGratuity);
    console.log("✅ EOS Calculation:", expectedEOS === testEmployeeCost.autoEosGratuity ? "CORRECT" : "❌ ERROR");
    
    // Test Case 2: Diagnostic Results
    console.log("\n📊 TEST 2: Diagnostic Results");
    const testDiagnostic = calculateDiagnosticResults();
    console.log("Inefficiency Percent:", testDiagnostic.inefficiencyPercent);
    console.log("Time Waste Hours:", testDiagnostic.timeWasteHours);
    console.log("Key Issues Count:", testDiagnostic.keyIssues.length);
    
    // Test Case 3: Full Efficiency Calculation
    console.log("\n📊 TEST 3: Full Efficiency Calculation");
    const testEfficiency = calculateEfficiency();
    console.log("Current Team Cost:", testEfficiency.currentSituation.teamCost);
    console.log("BSG Total Cost:", testEfficiency.withBSG.bsgTotalCost);
    console.log("Real Savings:", testEfficiency.results.realSavings);
    console.log("ROI:", testEfficiency.results.roi);
    
    // Verify key calculations
    const teamSize = Math.max(1, parseInt(formData.teamSize) || 1);
    const expectedCurrentCost = teamSize * testEmployeeCost.trueCost;
    const bsgRate = currentRoleDefaults ? currentRoleDefaults.bsgRate : 0.80;
    const expectedBsgCost = teamSize * (testEmployeeCost.fullSalary * bsgRate);
    const expectedSavings = expectedCurrentCost - expectedBsgCost;
    
    console.log("\n🔬 VERIFICATION:");
    console.log("Expected Current Cost:", Math.round(expectedCurrentCost), "| Actual:", testEfficiency.currentSituation.teamCost);
    console.log("Expected BSG Cost:", Math.round(expectedBsgCost), "| Actual:", testEfficiency.withBSG.bsgTotalCost);
    console.log("Expected Savings:", Math.round(expectedSavings), "| Actual:", testEfficiency.results.realSavings);
    
    // Test edge cases
    console.log("\n⚠️ EDGE CASE TESTS:");
    
    // Test with zero salary
    const originalSalary = formData.fullSalary;
    handleInputChange('fullSalary', '0');
    const zeroSalaryTest = calculateEmployeeCost();
    console.log("Zero Salary Test - True Cost:", zeroSalaryTest.trueCost, "| EOS:", zeroSalaryTest.autoEosGratuity);
    handleInputChange('fullSalary', originalSalary); // Reset
    
    // Test efficiency bounds
    const testEfficiencyBounds = calculateEfficiency();
    console.log("Current Efficiency (should be 0-100):", testEfficiencyBounds.currentSituation.currentEfficiency);
    console.log("BSG Efficiency (should be 96+):", testEfficiencyBounds.withBSG.bsgEfficiency);
    console.log("Productivity Loss (should be 0-20):", testEfficiencyBounds.currentSituation.productivityLoss);
    
    // Test with different team sizes
    const originalTeamSize = formData.teamSize;
    handleInputChange('teamSize', '1');
    const singlePersonTest = calculateEfficiency();
    handleInputChange('teamSize', '10');
    const largeTeamTest = calculateEfficiency();
    handleInputChange('teamSize', originalTeamSize); // Reset
    
    console.log("Single Person Cost:", singlePersonTest.currentSituation.teamCost);
    console.log("Large Team Cost:", largeTeamTest.currentSituation.teamCost);
    console.log("Cost scales correctly:", largeTeamTest.currentSituation.teamCost === singlePersonTest.currentSituation.teamCost * 10 ? "✅ YES" : "❌ NO");
    
    console.log("\n🎯 DIAGNOSTIC COMPLETE");
  };

  // TEST CALCULATION ACCURACY WITH SAMPLE DATA
  const testCalculationAccuracy = () => {
    console.log("\n🧮 TESTING WITH SAMPLE DATA");
    
    // Sample test data
    const currency = formData.selectedCurrency;
    const sampleData = {
      fullSalary: 60000,
      teamSize: 5,
      teamMaturity: 2,
      visaCosts: currentRoleDefaults?.overheads[currency]?.visaCosts || 3500,
      insurance: currentRoleDefaults?.overheads[currency]?.insurance || 1899,
      training: currentRoleDefaults?.overheads[currency]?.training || 2000,
      equipment: currentRoleDefaults?.overheads[currency]?.equipment || 4000,
      officeSpace: currentRoleDefaults?.overheads[currency]?.officeSpace || 12000,
      eosGratuity: Math.round((60000 / 365) * 21), // Should be ~3452
      otherCosts: 1000
    };
    
    console.log("Sample Data:", sampleData);
    
    // Calculate expected results manually
    const expectedTotalOverheads = sampleData.visaCosts + sampleData.insurance + sampleData.training + 
                                  sampleData.equipment + sampleData.officeSpace + sampleData.eosGratuity + sampleData.otherCosts;
    const expectedTrueCost = sampleData.fullSalary + expectedTotalOverheads;
    const expectedTeamCost = sampleData.teamSize * expectedTrueCost;
    
    console.log("Expected Overheads:", expectedTotalOverheads);
    console.log("Expected True Cost per Employee:", expectedTrueCost);
    console.log("Expected Team Cost:", expectedTeamCost);
    
    // Test BSG calculation
    const bsgRate = 0.84; // Mid-level default
    const expectedBsgCostPerEmployee = sampleData.fullSalary * bsgRate;
    const expectedBsgTeamCost = sampleData.teamSize * expectedBsgCostPerEmployee;
    const expectedSavings = expectedTeamCost - expectedBsgTeamCost;
    const expectedROI = (expectedSavings / expectedBsgTeamCost) * 100;
    
    console.log("Expected BSG Cost per Employee:", expectedBsgCostPerEmployee);
    console.log("Expected BSG Team Cost:", expectedBsgTeamCost);
    console.log("Expected Savings:", expectedSavings);
    console.log("Expected ROI:", expectedROI);
    
    return {
      sample: sampleData,
      expected: {
        totalOverheads: expectedTotalOverheads,
        trueCost: expectedTrueCost,
        teamCost: expectedTeamCost,
        bsgCostPerEmployee: expectedBsgCostPerEmployee,
        bsgTeamCost: expectedBsgTeamCost,
        savings: expectedSavings,
        roi: expectedROI
      }
    };
  };

  // IDENTIFY POTENTIAL CALCULATION ISSUES
  const identifyCalculationIssues = () => {
    console.log("\n🔍 IDENTIFYING POTENTIAL ISSUES");
    
    const issues = [];
    
    // Check if diagnostic multiplier might be too aggressive
    const diagnostic = calculateDiagnosticResults();
    if (diagnostic.inefficiencyPercent > 0.15) {
      issues.push("⚠️ High inefficiency detected - may need validation");
    }
    
    // Check efficiency bounds
    const efficiency = calculateEfficiency();
    if (efficiency.currentSituation.currentEfficiency < 80) {
      issues.push("⚠️ Very low current efficiency - verify diagnostic scoring");
    }
    
    if (efficiency.withBSG.bsgEfficiency < 96) {
      issues.push("❌ BSG efficiency below guaranteed 96%");
    }
    
    // Check cost reasonableness
    const costRatio = efficiency.withBSG.bsgTotalCost / efficiency.currentSituation.teamCost;
    if (costRatio > 1.2) {
      issues.push("⚠️ BSG cost significantly higher than current - verify BSG rates");
    }
    
    if (costRatio < 0.5) {
      issues.push("⚠️ BSG cost suspiciously low - verify calculations");
    }
    
    // Check time waste reasonableness
    const hoursPerPerson = efficiency.results.hoursReclaimed / efficiency.teamSize;
    if (hoursPerPerson > 20) {
      issues.push("⚠️ Extremely high time waste per person - verify diagnostic");
    }
    
    console.log("Issues Found:", issues.length);
    issues.forEach(issue => console.log(issue));
    
    return issues;
  };
  
  // Handler functions with currency support
  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  
  const handleCurrencyChange = (currency) => {
    setFormData(prev => ({ ...prev, selectedCurrency: currency }));
    // Reset role-specific values when currency changes
    if (selectedRole) {
      const defaults = roleDefaults[selectedRole];
      if (defaults) {
        const newSalary = defaults.salaries[currency];
        const newOverheads = defaults.overheads[currency];
        setFormData(prev => ({ 
          ...prev, 
          fullSalary: newSalary.toString(),
          visaCosts: newOverheads.visaCosts.toString(),
          insurance: newOverheads.insurance.toString(),
          training: newOverheads.training.toString(),
          equipment: newOverheads.equipment.toString(),
          officeSpace: newOverheads.officeSpace.toString(),
          eosGratuity: Math.round((newSalary / 365) * 21).toString(),
          visaCostsCustom: false,
          insuranceCustom: false,
          trainingCustom: false,
          equipmentCustom: false,
          officeSpaceCustom: false,
          eosGratuityCustom: false
        }));
      }
    }
  };
  
  const handleTeamSelection = (teamId) => {
    if (selectedTeam === teamId) {
      setSelectedTeam(''); 
      setTaskAllocations({}); 
      setFormData(prev => ({ ...prev, diagnosticAnswers: {} }));
    } else {
      setSelectedTeam(teamId);
      const team = teams.find(t => t.id === teamId);
      if (team) {
        const initialAllocations = {}; 
        team.tasks.forEach(task => { 
          initialAllocations[task.id] = task.default; 
        });
        setTaskAllocations(initialAllocations); 
        setFormData(prev => ({ ...prev, diagnosticAnswers: {} }));
      }
    }
  };
  
  const handleRoleSelection = (roleId) => {
    if (selectedRole === roleId) {
      setSelectedRole(''); 
      setFormData(prev => ({ 
        ...prev, 
        selectedRole: '', 
        fullSalary: '', 
        visaCosts: '', 
        visaCostsCustom: false, 
        insurance: '', 
        insuranceCustom: false, 
        training: '', 
        trainingCustom: false, 
        equipment: '', 
        equipmentCustom: false, 
        officeSpace: '', 
        officeSpaceCustom: false, 
        eosGratuity: '', 
        eosGratuityCustom: false, 
        otherCosts: '0' 
      }));
    } else {
      setSelectedRole(roleId); 
      const defaults = roleDefaults[roleId];
      const currency = formData.selectedCurrency;
      if (defaults && currency) {
        const salary = defaults.salaries[currency];
        const overheads = defaults.overheads[currency];
        setFormData(prev => ({ 
          ...prev, 
          selectedRole: roleId, 
          fullSalary: salary.toString(), 
          visaCosts: overheads.visaCosts.toString(), 
          visaCostsCustom: false, 
          insurance: overheads.insurance.toString(), 
          insuranceCustom: false, 
          training: overheads.training.toString(), 
          trainingCustom: false, 
          equipment: overheads.equipment.toString(), 
          equipmentCustom: false, 
          officeSpace: overheads.officeSpace.toString(), 
          officeSpaceCustom: false, 
          eosGratuity: Math.round((salary / 365) * 21).toString(), 
          eosGratuityCustom: false, 
          otherCosts: '0' 
        }));
      }
    }
  };
  
  // Task and diagnostic handlers
  const handleTaskAllocation = (taskId, value) => {
    const numericValue = parseInt(value) || 0; 
    const clampedValue = Math.max(0, Math.min(100, numericValue));
    setTaskAllocations(prev => ({ ...prev, [taskId]: clampedValue }));
  };
  
  const handleDiagnosticAnswer = (questionIndex, optionIndex) => {
    setFormData(prev => ({ 
      ...prev, 
      diagnosticAnswers: { 
        ...prev.diagnosticAnswers, 
        [questionIndex]: optionIndex 
      } 
    }));
  };
  
  const totalAllocation = Object.values(taskAllocations).reduce((sum, val) => sum + val, 0);
  
  // Validation logic
  const validateStep = (step) => {
    switch (step) {
      case 0: 
        return formData.fullName?.trim() && 
               formData.companyEmail?.trim() && 
               isCompanyEmail(formData.companyEmail) && 
               formData.companyName?.trim() && 
               formData.mobileNumber?.trim() && 
               isValidMobileNumber(formData.mobileNumber) && 
               formData.selectedCurrency;
      case 1: 
        return selectedTeam && selectedTeam !== '';
      case 2: 
        return selectedRole && selectedRole !== '' && formData.teamSize?.trim();
      case 3: 
        return formData.fullSalary && parseInt(formData.fullSalary) > 0;
      case 4: 
        return totalAllocation >= 98 && totalAllocation <= 102;
      case 5: 
        const questions = teamQuestions[selectedTeam] || []; 
        return questions.every((_, index) => formData.diagnosticAnswers[index] !== undefined);
      case 6: 
        return formData.primaryGoal && formData.targetEfficiency && formData.timeline;
      default: 
        return true;
    }
  };
  
  const nextStep = () => { 
    if (validateStep(currentStep) && currentStep < totalSteps - 1) setCurrentStep(currentStep + 1); 
  };
  
  const prevStep = () => { 
    if (currentStep > 0) setCurrentStep(currentStep - 1); 
  };
  
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (!validateStep(currentStep)) throw new Error('Please complete all required fields.');
      if (!currentTeam || !currentRoleDefaults) throw new Error('Please select both a team and role level.');
      
      // 🔍 RUN DIAGNOSTIC TESTS BEFORE CALCULATION
      console.log("🚀 Starting Team Efficiency Calculation with Diagnostics");
      runDiagnosticTest();
      const testResults = testCalculationAccuracy();
      const issues = identifyCalculationIssues();
      
      // Log comprehensive test results
      console.log("\n📋 CALCULATION VERIFICATION SUMMARY:");
      console.log("=".repeat(50));
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      const calculatedResults = calculateEfficiency();
      
      // Compare with expected values
      console.log("\n🔬 ACTUAL vs EXPECTED COMPARISON:");
      if (testResults.expected) {
        const actualEmployeeCost = calculatedResults.employeeCost;
        const actualTeamCost = calculatedResults.currentSituation.teamCost;
        const actualBsgCost = calculatedResults.withBSG.bsgTotalCost;
        const actualSavings = calculatedResults.results.realSavings;
        
        console.log("Employee True Cost - Expected:", testResults.expected.trueCost, "| Actual:", actualEmployeeCost.trueCost);
        console.log("Team Cost - Expected:", testResults.expected.teamCost, "| Actual:", actualTeamCost);
        console.log("BSG Cost - Expected:", Math.round(testResults.expected.bsgTeamCost), "| Actual:", actualBsgCost);
        console.log("Savings - Expected:", Math.round(testResults.expected.savings), "| Actual:", actualSavings);
        
        // Calculate accuracy percentages
        const costAccuracy = Math.abs(actualTeamCost - testResults.expected.teamCost) / testResults.expected.teamCost * 100;
        const savingsAccuracy = Math.abs(actualSavings - testResults.expected.savings) / Math.abs(testResults.expected.savings) * 100;
        
        console.log("Cost Calculation Accuracy:", (100 - costAccuracy).toFixed(2) + "%");
        console.log("Savings Calculation Accuracy:", (100 - savingsAccuracy).toFixed(2) + "%");
      }
      
      // Validation checks
      console.log("\n✅ VALIDATION CHECKS:");
      console.log("Current Efficiency Range (0-100%):", calculatedResults.currentSituation.currentEfficiency >= 0 && calculatedResults.currentSituation.currentEfficiency <= 100 ? "✅ PASS" : "❌ FAIL");
      console.log("BSG Efficiency ≥ 96%:", calculatedResults.withBSG.bsgEfficiency >= 96 ? "✅ PASS" : "❌ FAIL");
      console.log("Productivity Loss ≤ 20%:", calculatedResults.currentSituation.productivityLoss <= 20 ? "✅ PASS" : "❌ FAIL");
      console.log("Team Cost > 0:", calculatedResults.currentSituation.teamCost > 0 ? "✅ PASS" : "❌ FAIL");
      console.log("BSG Cost > 0:", calculatedResults.withBSG.bsgTotalCost > 0 ? "✅ PASS" : "❌ FAIL");
      
      // ROI validation
      if (calculatedResults.results.isPositiveSavings) {
        const roiCheck = calculatedResults.results.roi === Math.round((calculatedResults.results.realSavings / calculatedResults.withBSG.bsgTotalCost) * 100);
        console.log("ROI Calculation Accuracy:", roiCheck ? "✅ PASS" : "❌ FAIL");
      }
      
      // Time calculation validation
      const expectedTimeReclaimed = calculatedResults.diagnosticResults.timeWasteHours * calculatedResults.teamSize;
      const timeCalcCheck = Math.abs(calculatedResults.results.hoursReclaimed - expectedTimeReclaimed) < 0.1;
      console.log("Time Calculation Accuracy:", timeCalcCheck ? "✅ PASS" : "❌ FAIL");
      
      console.log("\n🎯 DIAGNOSTIC COMPLETE - Proceeding with Results");
      console.log("=".repeat(50));
      
      // Alert user of any critical issues
      if (issues.length > 0) {
        console.warn("⚠️ CALCULATION WARNINGS DETECTED:", issues);
      }
      
      setResults(calculatedResults); 
      setShowResults(true);
    } catch (error) {
      console.error("❌ CALCULATION ERROR:", error);
      alert(`Error: ${error.message || 'An unexpected error occurred.'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // UI Components
  const Tooltip = ({ text }) => (
    <div className="relative group inline-block ml-1">
      <Info className="h-4 w-4 text-blue-500 cursor-help" />
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 w-64">
        {text}
      </div>
    </div>
  );
  
  // Currency Selector Component
  const CurrencySelector = ({ value, onChange, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className={`relative ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left bg-white hover:border-navy focus:ring-2 focus:ring-navy focus:border-navy transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{currencies[value].flag}</span>
              <div>
                <div className="font-semibold text-gray-900">{currencies[value].symbol}</div>
                <div className="text-sm text-gray-600">{currencies[value].name}</div>
              </div>
            </div>
            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {Object.entries(currencies).map(([code, data]) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  onChange(code);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-navy-50 transition-colors ${
                  value === code ? 'bg-navy-50 border-l-4 border-navy' : ''
                }`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{data.flag}</span>
                  <div>
                    <div className="font-semibold text-gray-900">{data.symbol}</div>
                    <div className="text-sm text-gray-600">{data.name}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  const TeamCard = ({ team, isSelected, onClick }) => (
    <div 
      className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
        isSelected ? 
          `bg-gradient-to-br ${team.gradient} text-white ${team.borderColor} shadow-lg scale-105` : 
          `border-gray-200 hover:border-navy-300 ${team.bgColor} hover:shadow-md`
      }`} 
      onClick={onClick}
    >
      <div className={`${isSelected ? 'text-white' : 'text-navy'} mb-3 flex justify-center`}>
        {team.icon}
      </div>
      <h3 className={`font-semibold mb-2 text-center ${isSelected ? 'text-white' : 'text-gray-900'}`}>
        {team.name}
      </h3>
      <p className={`text-sm text-center ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
        {team.description}
      </p>
      {isSelected && (
        <div className="absolute top-4 right-4">
          <CheckCircle className="h-6 w-6 text-white" />
        </div>
      )}
    </div>
  );
  
  // Role Card with currency support
  const RoleCard = ({ roleId, roleData, isSelected, onClick }) => {
    const currency = formData.selectedCurrency;
    const salary = roleData.salaries[currency];
    
    return (
      <div 
        className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
          isSelected ? 
            `border-navy bg-gradient-to-br ${roleData.gradient} text-white shadow-lg scale-105` : 
            `border-gray-200 hover:border-navy-300 ${roleData.bgColor} hover:shadow-md`
        }`} 
        onClick={onClick}
      >
        <h3 className={`font-semibold mb-2 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
          {roleData.name}
        </h3>
        <div className={`text-sm space-y-1 ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
          <div>Salary: {formatCurrency(salary)}</div>
          <div>BSG Rate: {Math.round(roleData.bsgRate * 100)}% of salary</div>
        </div>
        {isSelected && (
          <div className="absolute top-0 right-0">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
        )}
      </div>
    );
  };
  
  const TaskSlider = ({ task, value, onChange }) => {
    const numericValue = parseInt(value) || 0; 
    const clampedValue = Math.max(0, Math.min(100, numericValue));
    
    return (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <label className="font-medium text-gray-700 flex items-center flex-1">
            {task.name}
            <Tooltip text={`Percentage of weekly work time spent on ${task.name.toLowerCase()}`} />
          </label>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <input 
              type="number" 
              value={value || ''} 
              onChange={(e) => onChange(task.id, e.target.value)} 
              min="0" 
              max="100" 
              step="1" 
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center font-semibold text-navy" 
            />
            <span className="text-navy font-semibold">%</span>
          </div>
        </div>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={clampedValue} 
          onChange={(e) => onChange(task.id, e.target.value)} 
          className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer" 
        />
        <div className="bg-gray-200 rounded-full h-1 mt-2">
          <div 
            className="bg-navy h-1 rounded-full transition-all duration-300" 
            style={{ width: `${clampedValue}%` }} 
          />
        </div>
      </div>
    );
  };

  // Cost Category Card with currency support
  const CostCategoryCard = ({ icon, title, description, detailedItems, isCustom, defaultValue, customValue, onToggle, onValueChange }) => (
    <div className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start mb-3">
        <div className="flex-shrink-0 mr-3">
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1 flex items-center">
            {title} 
            <Tooltip text={description} />
          </h4>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-700 mb-2">Typically includes:</p>
            <div className="grid grid-cols-1 gap-1">
              {detailedItems.map((item, index) => (
                <div key={index} className="flex items-center text-xs text-gray-600">
                  <div className="w-1 h-1 bg-navy-500 rounded-full mr-2 flex-shrink-0"></div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <label className="flex items-center">
          <input 
            type="radio" 
            checked={!isCustom} 
            onChange={() => onToggle(false)} 
            className="mr-2" 
          />
          <span className="text-sm">Default: {formatCurrency(defaultValue || 0)}</span>
        </label>
        <label className="flex items-center">
          <input 
            type="radio" 
            checked={isCustom} 
            onChange={() => onToggle(true)} 
            className="mr-2" 
          />
          <span className="text-sm">Custom:</span>
          <input 
            type="number" 
            value={isCustom ? customValue : ''} 
            onChange={(e) => onValueChange(e.target.value)} 
            placeholder={defaultValue?.toString()} 
            disabled={!isCustom} 
            className={`ml-2 w-32 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-navy ${
              !isCustom ? 'bg-gray-100' : ''
            }`} 
            min="0" 
            step="1" 
          />
        </label>
      </div>
    </div>
  );

  // PROFESSIONAL RESULTS SECTION with currency support
  if (showResults && results) {
    const currency = formData.selectedCurrency;
    
    return (
      <div className="min-h-screen" style={{ 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif"
      }}>
        <style jsx>{`
          .professional-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 24px;
          }
          
          .professional-header {
            text-align: center;
            background: linear-gradient(135deg, #062767 0%, #0a3a8f 50%, #1e4f9a 100%);
            color: white;
            padding: 48px 32px;
            border-radius: 16px;
            margin-bottom: 32px;
            box-shadow: 0 20px 40px rgba(6, 39, 103, 0.2);
            position: relative;
            overflow: hidden;
          }
          
          .professional-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%);
            pointer-events: none;
          }
          
          .professional-header h1 {
            font-size: 2.75rem;
            margin-bottom: 12px;
            font-weight: 700;
            letter-spacing: -0.025em;
            position: relative;
          }
          
          .professional-header p {
            font-size: 1.25rem;
            opacity: 0.9;
            font-weight: 300;
            position: relative;
          }
          
          .professional-section {
            background: white;
            border-radius: 16px;
            padding: 32px;
            margin-bottom: 24px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
            position: relative;
          }
          
          .professional-section:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            transform: translateY(-2px);
          }
          
          .professional-section::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: #062767;
            border-radius: 0 2px 2px 0;
          }
          
          .professional-section.problem::before {
            background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
          }
          
          .professional-section.solution::before {
            background: linear-gradient(180deg, #10b981 0%, #059669 100%);
          }
          
          .professional-section h3 {
            color: #062767;
            margin-bottom: 28px;
            font-size: 1.5rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            letter-spacing: -0.025em;
          }
          
          .professional-icon {
            margin-right: 12px;
            width: 24px;
            height: 24px;
            color: #b19763;
            stroke-width: 2;
          }
          
          .problem .professional-icon {
            color: #ef4444;
          }
          
          .solution .professional-icon {
            color: #10b981;
          }
          
          .executive-summary {
            background: white;
            border-radius: 16px;
            padding: 32px;
            margin-bottom: 32px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
            position: relative;
          }
          
          .executive-summary::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #b19763 0%, #9a824f 100%);
            border-radius: 16px 16px 0 0;
          }
          
          .summary-header {
            text-align: center;
            margin-bottom: 28px;
            color: #062767;
          }
          
          .summary-header h2 {
            font-size: 1.875rem;
            font-weight: 700;
            letter-spacing: -0.025em;
          }
          
          .summary-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
          
          .summary-item {
            padding: 24px;
            border-radius: 12px;
            border: 2px solid #e5e7eb;
            position: relative;
            transition: all 0.3s ease;
          }
          
          .summary-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          }
          
          .summary-item.current {
            background: linear-gradient(135deg, #fef2f2 0%, #fef7f7 100%);
            border-color: #fecaca;
          }
          
          .summary-item.future {
            background: linear-gradient(135deg, #f0fdf4 0%, #f7fef7 100%);
            border-color: #bbf7d0;
          }
          
          .summary-item h3 {
            margin-bottom: 12px;
            font-size: 1.125rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            letter-spacing: -0.025em;
          }
          
          .summary-item .professional-icon {
            width: 20px;
            height: 20px;
            margin-right: 8px;
          }
          
          .summary-item.current .professional-icon {
            color: #ef4444;
          }
          
          .summary-item.future .professional-icon {
            color: #10b981;
          }
          
          .summary-item p {
            color: #4b5563;
            font-size: 0.95rem;
            line-height: 1.6;
          }
          
          .company-box {
            background: linear-gradient(135deg, #062767 0%, #0a3a8f 100%);
            color: white;
            padding: 32px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 28px;
            box-shadow: 0 10px 25px rgba(30, 41, 59, 0.2);
            position: relative;
            overflow: hidden;
          }
          
          .company-box::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            opacity: 0.3;
          }
          
          .company-box h2 {
            position: relative;
            z-index: 1;
            font-size: 1.5rem;
            font-weight: 600;
          }
          
          .company-box p {
            position: relative;
            z-index: 1;
            font-size: 1.125rem;
            margin-top: 8px;
            opacity: 0.9;
          }
          
          .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 20px;
            margin: 28px 0;
          }
          
          .metric-card {
            background: white;
            border: 2px solid #fef2f2;
            color: #062767;
            padding: 28px 24px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          
          .metric-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
          }
          
          .metric-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          }
          
          .metric-card.solution {
            border-color: #f0fdf4;
          }
          
          .metric-card.solution::before {
            background: linear-gradient(90deg, #10b981 0%, #059669 100%);
          }
          
          .metric-value {
            font-size: 2.25rem;
            font-weight: 800;
            margin-bottom: 8px;
            color: #ef4444;
            letter-spacing: -0.025em;
          }
          
          .metric-card.solution .metric-value {
            color: #10b981;
          }
          
          .metric-label {
            font-size: 0.875rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #6b7280;
          }
          
          .comparison-table {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            margin: 28px 0;
            border: 1px solid #e5e7eb;
          }
          
          .comparison-table table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .comparison-table th {
            background: linear-gradient(135deg, #062767 0%, #0a3a8f 100%);
            color: white;
            padding: 20px 16px;
            text-align: center;
            font-weight: 600;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          
          .comparison-table td {
            padding: 20px 16px;
            text-align: center;
            border-bottom: 1px solid #f3f4f6;
            font-weight: 500;
            font-size: 0.95rem;
          }
          
          .comparison-table tr:nth-child(even) {
            background: #fafafa;
          }
          
          .comparison-table tr:hover {
            background: #e8eef8;
          }
          
          .cost-breakdown {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            margin: 28px 0;
          }
          
          .cost-box {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            padding: 28px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(239, 68, 68, 0.25);
            position: relative;
            overflow: hidden;
          }
          
          .cost-box h4 {
            margin-bottom: 20px;
            font-size: 1.125rem;
            font-weight: 600;
            display: flex;
            align-items: center;
          }
          
          .cost-box .professional-icon {
            color: white;
            margin-right: 8px;
            width: 20px;
            height: 20px;
          }
          
          .cost-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding: 8px 0;
            border-bottom: 1px solid rgba(255,255,255,0.2);
            font-size: 0.9rem;
          }
          
          .cost-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }
          
          .benefit-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin: 28px 0;
          }
          
          .benefit-card {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 28px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.25);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          
          .benefit-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
            pointer-events: none;
          }
          
          .benefit-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 30px rgba(16, 185, 129, 0.3);
          }
          
          .benefit-card h4 {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
            font-size: 1rem;
            font-weight: 600;
            position: relative;
            z-index: 1;
          }
          
          .benefit-card .professional-icon {
            color: white;
            margin-right: 8px;
            width: 20px;
            height: 20px;
          }
          
          .benefit-value {
            font-size: 2rem;
            font-weight: 800;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
            letter-spacing: -0.025em;
          }
          
          .benefit-label {
            font-size: 0.875rem;
            opacity: 0.9;
            position: relative;
            z-index: 1;
          }
          
          .roi-section {
            background: linear-gradient(135deg, #062767 0%, #051f52 100%);
            color: white;
            padding: 28px;
            border-radius: 12px;
            margin-top: 24px;
            box-shadow: 0 8px 25px rgba(6, 39, 103, 0.25);
            position: relative;
            overflow: hidden;
          }
          
          .roi-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%);
            pointer-events: none;
          }
          
          .roi-section h4 {
            position: relative;
            z-index: 1;
          }
          
          .roi-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 16px;
            margin-top: 20px;
          }
          
          .roi-item {
            padding: 20px;
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            text-align: center;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
            position: relative;
            z-index: 1;
          }
          
          .final-cta {
            text-align: center;
            margin: 48px 0;
            background: white;
            padding: 40px 32px;
            border-radius: 16px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
          }
          
          .final-cta h2 {
            margin-bottom: 24px;
            color: #062767;
            font-size: 1.875rem;
            font-weight: 700;
            letter-spacing: -0.025em;
          }
          
          .cta-button {
            background: linear-gradient(135deg, #062767 0%, #051f52 100%);
            color: white;
            padding: 16px 32px;
            border: none;
            border-radius: 50px;
            font-size: 1.125rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 8px 25px rgba(177, 151, 99, 0.3);
            margin: 12px;
            letter-spacing: -0.025em;
          }
          
          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 30px rgba(177, 151, 99, 0.4);
          }
          
          .print-button {
            background: white;
            color: #062767;
            padding: 16px 32px;
            border: 2px solid #062767;
            border-radius: 50px;
            font-size: 1.125rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 12px;
            letter-spacing: -0.025em;
          }
          
          .print-button:hover {
            background: #e8eef8;
            transform: translateY(-2px);
          }
          
          @media (max-width: 768px) {
            .cost-breakdown, .summary-content {
              grid-template-columns: 1fr;
            }
            
            .dashboard {
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            }
            
            .professional-header h1 {
              font-size: 2rem;
            }
            
            .professional-section {
              padding: 24px;
            }
            
            .professional-container {
              padding: 16px;
            }
          }
        `}</style>
        
        <div className="professional-container">
          {/* Header */}
          <div className="professional-header">
            <h1>{currentTeam?.name} Optimization Report</h1>
            <p>Strategic Business Enhancement Analysis by BSG ({currencies[currency].name})</p>
          </div>
          
          {/* Executive Summary */}
          <div className="executive-summary">
            <div className="summary-header">
              <h2>Executive Summary</h2>
            </div>
            <div className="summary-content">
              <div className="summary-item current">
                <h3>
                  <AlertTriangle className="professional-icon" />
                  Current State
                </h3>
                <p>Your {results.teamSize}-person {currentTeam?.name.toLowerCase()} costs {formatCurrency(results.currentSituation.teamCost)} annually but operates at only {results.currentSituation.currentEfficiency}% efficiency, wasting {results.results.hoursReclaimed} hours per week.</p>
              </div>
              <div className="summary-item future">
                <h3>
                  <Target className="professional-icon" />
                  Future with BSG
                </h3>
                <p>BSG delivers {results.withBSG.bsgEfficiency}% efficiency at {formatCurrency(results.withBSG.bsgTotalCost)} annually - {results.results.isPositiveSavings ? `saving you ${formatCurrency(results.results.realSavings)}` : `requiring ${formatCurrency(Math.abs(results.results.realSavings))} additional investment`} while reclaiming {Math.max(0, results.results.hoursReclaimed - 2)} productive hours per week.</p>
              </div>
            </div>
          </div>

          {/* Company Overview */}
          <div className="professional-section">
            <h3>
              <Building className="professional-icon" />
              Company Overview
            </h3>
            <div className="company-box">
              <h2>{formData.companyName.toUpperCase()}'S TEAM ANALYSIS</h2>
              <p>{currentTeam?.name} | {results.teamSize} Personnel | {currencies[currency].name}</p>
            </div>
          </div>

          {/* Current Performance Dashboard */}
          <div className="professional-section problem">
            <h3>
              <TrendingUp className="professional-icon" />
              Current Performance Issues
            </h3>
            <div className="dashboard">
              <div className="metric-card">
                <div className="metric-value">{formatCurrency(results.currentSituation.teamCost)}</div>
                <div className="metric-label">Annual Cost</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{results.currentSituation.currentEfficiency}%</div>
                <div className="metric-label">Efficiency</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{results.results.hoursReclaimed} hrs/wk</div>
                <div className="metric-label">Wasted Hours/Week</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{results.diagnosticResults.keyIssues.length || 'Multiple'}</div>
                <div className="metric-label">Process Issues</div>
              </div>
            </div>
          </div>

          {/* Problem Analysis */}
          <div className="professional-section problem">
            <h3>
              <AlertTriangle className="professional-icon" />
              Problem Analysis
            </h3>
            <div className="cost-breakdown">
              <div className="cost-box">
                <h4>
                  <User className="professional-icon" />
                  Cost Breakdown (Per Head)
                </h4>
                <div className="cost-item">
                  <span>Base Salary</span>
                  <span>{formatCurrency(Math.round(results.employeeCost.fullSalary / 12))}/month</span>
                </div>
                <div className="cost-item">
                  <span>Benefits & Overhead</span>
                  <span>{formatCurrency(Math.round(results.employeeCost.totalOverheads / 12))}/month</span>
                </div>
                <div className="cost-item">
                  <span>Inefficiency Loss</span>
                  <span>{results.currentSituation.productivityLoss}% capacity</span>
                </div>
                <div className="cost-item" style={{ borderTop: '2px solid white', marginTop: '16px', paddingTop: '12px', fontWeight: 'bold' }}>
                  <span>Total Per Head</span>
                  <span>{formatCurrency(results.currentSituation.trueCostPerEmployee)}</span>
                </div>
              </div>
              <div className="cost-box">
                <h4>
                  <Users className="professional-icon" />
                  Total Team Analysis
                </h4>
                <div className="cost-item">
                  <span>Total Salaries</span>
                  <span>{formatCurrency(results.employeeCost.fullSalary * results.teamSize)}</span>
                </div>
                <div className="cost-item">
                  <span>Total Overheads</span>
                  <span>{formatCurrency(results.employeeCost.totalOverheads * results.teamSize)}</span>
                </div>
                <div className="cost-item">
                  <span>Weekly Time Waste</span>
                  <span>{results.results.hoursReclaimed} hours</span>
                </div>
                <div className="cost-item" style={{ borderTop: '2px solid white', marginTop: '16px', paddingTop: '12px', fontWeight: 'bold' }}>
                  <span>Annual Total</span>
                  <span>{formatCurrency(results.currentSituation.teamCost)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* BSG Solution Comparison */}
          <div className="professional-section solution">
            <h3>
              <CheckCircle className="professional-icon" />
              BSG Solution Benefits
            </h3>
            <div className="comparison-table">
              <table>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Current</th>
                    <th>With BSG</th>
                    <th>Improvement</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Annual Cost</strong></td>
                    <td style={{ color: '#ef4444', fontWeight: 'bold' }}>
                      {formatCurrency(results.currentSituation.teamCost)}
                    </td>
                    <td style={{ color: '#10b981', fontWeight: 'bold' }}>
                      {formatCurrency(results.withBSG.bsgTotalCost)}
                    </td>
                    <td style={{ color: results.results.isPositiveSavings ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                      {results.results.isPositiveSavings 
                        ? `${Math.round((results.results.realSavings / results.currentSituation.teamCost) * 100)}% Reduction`
                        : `${Math.round((Math.abs(results.results.realSavings) / results.currentSituation.teamCost) * 100)}% Increase`
                      }
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Efficiency Rate</strong></td>
                    <td style={{ color: '#ef4444', fontWeight: 'bold' }}>
                      {results.currentSituation.currentEfficiency}%
                    </td>
                    <td style={{ color: '#10b981', fontWeight: 'bold' }}>
                      {results.withBSG.bsgEfficiency}%
                    </td>
                    <td style={{ color: '#10b981', fontWeight: 'bold' }}>
                      {results.results.efficiencyGain}% Increase
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Time Wastage</strong></td>
                    <td style={{ color: '#ef4444', fontWeight: 'bold' }}>
                      {results.results.hoursReclaimed} hrs/week
                    </td>
                    <td style={{ color: '#10b981', fontWeight: 'bold' }}>2 hrs/week</td>
                    <td style={{ color: '#10b981', fontWeight: 'bold' }}>87% Reduction</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="professional-section solution">
            <h3>
              <Target className="professional-icon" />
              Key Benefits Summary
            </h3>
            <div className="benefit-grid">
              <div className="benefit-card">
                <h4>
                  <DollarSign className="professional-icon" />
                  {results.results.isPositiveSavings ? 'Savings' : 'Investment'}
                </h4>
                <div className="benefit-value">
                  {formatCurrency(Math.abs(results.results.realSavings))}
                </div>
                <div className="benefit-label">
                  {results.results.isPositiveSavings ? 'Annual Savings' : 'Quality Investment'}
                </div>
              </div>
              <div className="benefit-card">
                <h4>
                  <Clock className="professional-icon" />
                  Time Recovery
                </h4>
                <div className="benefit-value">
                  {Math.max(0, results.results.hoursReclaimed - 2)}
                </div>
                <div className="benefit-label">Hours/Week Gained</div>
              </div>
              <div className="benefit-card">
                <h4>
                  <CheckCircle className="professional-icon" />
                  Efficiency
                </h4>
                <div className="benefit-value">{results.withBSG.bsgEfficiency}%</div>
                <div className="benefit-label">Guaranteed Rate</div>
              </div>
              <div className="benefit-card">
                <h4>
                  <TrendingUp className="professional-icon" />
                  ROI
                </h4>
                <div className="benefit-value">
                  {results.results.isPositiveSavings ? results.results.roi + '%' : 'Quality'}
                </div>
                <div className="benefit-label">
                  {results.results.isPositiveSavings ? 'Return Rate' : 'Investment'}
                </div>
              </div>
            </div>

            {/* Financial Analysis */}
            {results.results.isPositiveSavings && (
              <div className="roi-section">
                <h4 style={{ textAlign: 'center', marginBottom: '16px', fontSize: '1.375rem', fontWeight: '600' }}>
                  Return on Investment Analysis
                </h4>
                <div className="roi-grid">
                  <div className="roi-item">
                    <div style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '4px' }}>Investment</div>
                    <div style={{ fontSize: '0.875rem' }}>
                      {formatCurrency(results.withBSG.bsgTotalCost)}/year
                    </div>
                  </div>
                  <div className="roi-item">
                    <div style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '4px' }}>Savings</div>
                    <div style={{ fontSize: '0.875rem' }}>
                      {formatCurrency(results.results.realSavings)}/year
                    </div>
                  </div>
                  <div className="roi-item">
                    <div style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '4px' }}>ROI</div>
                    <div style={{ fontSize: '0.875rem' }}>{results.results.roi}% Return</div>
                  </div>
                  <div className="roi-item">
                    <div style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '4px' }}>Payback</div>
                    <div style={{ fontSize: '0.875rem' }}>Immediate</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Calculation Methodology */}
          <div className="professional-section" style={{ marginTop: '32px' }}>
            <h3>
              <Calculator className="professional-icon" />
              Calculation Methodology
            </h3>
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px', color: '#062767' }}>Current Cost Calculation</h4>
                  <div style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.6' }}>
                    <div>• Base Salary: {formatCurrency(results.employeeCost.fullSalary)}</div>
                    <div>• Total Overheads: {formatCurrency(results.employeeCost.totalOverheads)}</div>
                    <div>• True Cost per Employee: {formatCurrency(results.employeeCost.trueCost)}</div>
                    <div>• Team Size: {results.teamSize} people</div>
                    <div style={{ fontWeight: '600', marginTop: '8px' }}>• Total Team Cost: {formatCurrency(results.currentSituation.teamCost)}</div>
                  </div>
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px', color: '#062767' }}>BSG Cost Calculation</h4>
                  <div style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.6' }}>
                    <div>• BSG Rate: {Math.round((currentRoleDefaults?.bsgRate || 0.80) * 100)}% of salary</div>
                    <div>• Cost per Employee: {formatCurrency(results.withBSG.bsgCostPerEmployee)}</div>
                    <div>• Team Size: {results.teamSize} people</div>
                    <div>• Efficiency Guarantee: {results.withBSG.bsgEfficiency}%</div>
                    <div style={{ fontWeight: '600', marginTop: '8px' }}>• Total BSG Cost: {formatCurrency(results.withBSG.bsgTotalCost)}</div>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px', color: '#062767' }}>Efficiency Analysis</h4>
                  <div style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.6' }}>
                    <div>• Diagnostic Inefficiency: {Math.round(results.diagnosticResults.inefficiencyPercent * 100)}%</div>
                    <div>• Team Maturity Factor: {formData.teamMaturity}/4</div>
                    <div>• Total Productivity Loss: {results.currentSituation.productivityLoss}%</div>
                    <div>• Current Efficiency: {results.currentSituation.currentEfficiency}%</div>
                    <div>• Weekly Time Waste: {results.results.hoursReclaimed} hours</div>
                  </div>
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px', color: '#062767' }}>Financial Impact</h4>
                  <div style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.6' }}>
                    <div>• Current Annual Cost: {formatCurrency(results.currentSituation.teamCost)}</div>
                    <div>• BSG Annual Cost: {formatCurrency(results.withBSG.bsgTotalCost)}</div>
                    <div style={{ fontWeight: '600', color: results.results.isPositiveSavings ? '#059669' : '#dc2626' }}>
                      • {results.results.isPositiveSavings ? 'Annual Savings' : 'Additional Investment'}: {formatCurrency(Math.abs(results.results.realSavings))}
                    </div>
                    {results.results.isPositiveSavings && (
                      <div style={{ fontWeight: '600', color: '#059669' }}>• ROI: {results.results.roi}%</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: '20px', padding: '16px', background: '#e8eef8', borderRadius: '8px', border: '1px solid #c5d4ed' }}>
                <div style={{ fontSize: '0.8rem', color: '#062767', fontWeight: '500' }}>
                  <strong>Calculation Notes:</strong> EOS Gratuity calculated as (Salary ÷ 365) × 21 days per UAE Labor Law. 
                  Inefficiency score capped at 20% maximum. BSG efficiency guaranteed at minimum 96%. 
                  All costs rounded to nearest unit for presentation. Currency: {currencies[currency].name}.
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="final-cta">
            <h2>Transform Your {currentTeam?.name} Operations Today</h2>
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <a 
                href={`mailto:info@bsgsupport.com?subject=${encodeURIComponent(currentTeam?.name + ' Efficiency Analysis Follow-up - ' + formData.companyName)}`}
                className="cta-button"
              >
                Schedule Strategic Consultation
              </a>
              <button 
                onClick={() => window.print()} 
                className="print-button"
              >
                Print/Save Report
              </button>
            </div>
            <p className="text-slate-600">
              Begin realizing {results.results.isPositiveSavings ? `${formatCurrency(results.results.realSavings)} in annual savings` : 'enhanced operational efficiency'} with professional team optimization
            </p>
          </div>

        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="relative mx-auto mb-4 w-16 h-16">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-navy-500 via-navy-400 to-gold animate-spin">
              <div className="absolute inset-2 bg-white rounded-full"></div>
            </div>
            <div className="absolute inset-4 bg-gradient-to-r from-navy-500 via-navy-400 to-gold rounded-full animate-pulse"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Your Team</h3>
          <p className="text-gray-600">
            Processing efficiency diagnostics and calculating optimization opportunities...
          </p>
        </div>
      </div>
    );
  }
  
  // MAIN FORM RENDERING WITH ALL STEPS
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-gray-50 to-gold-50">
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-navy-700 via-navy to-navy-500 text-white p-8 text-center">
            <h1 className="text-4xl font-bold mb-2">Team Efficiency Calculator</h1>
            <p className="text-navy-100 text-lg">Analyze team inefficiencies and calculate potential savings</p>
          </div>
          
          <div className="bg-gray-200 h-3 relative">
            <div 
              className="bg-gradient-to-r from-navy-500 via-navy-400 to-gold h-full transition-all duration-500 rounded-r-full" 
              style={{ width: `${progress}%` }} 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-700">
                Step {currentStep + 1} of {totalSteps}
              </span>
            </div>
          </div>

          <div className="p-8">
            
            {/* STEP 0: Contact Information + Currency Selection */}
            {currentStep === 0 && (
              <div className="space-y-8">
                <div className="flex items-center justify-center mb-6">
                  <User className="h-8 w-8 text-navy mr-3" />
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Contact Information</h2>
                    <p className="text-gray-600">Tell us about yourself and select your currency</p>
                  </div>
                </div>

                {/* Currency Selection */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 mr-2 text-navy" />
                    Select Your Currency
                  </h3>
                  <div className="flex justify-center">
                    <CurrencySelector
                      value={formData.selectedCurrency}
                      onChange={handleCurrencyChange}
                      className="max-w-md"
                    />
                  </div>
                  <p className="text-sm text-gray-500 text-center">All calculations will be shown in your selected currency</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="email"
                        value={formData.companyEmail}
                        onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-navy focus:border-navy ${
                          formData.companyEmail && !isCompanyEmail(formData.companyEmail) 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300'
                        }`}
                        placeholder="your.email@company.com"
                      />
                    </div>
                    {formData.companyEmail && !isCompanyEmail(formData.companyEmail) && (
                      <p className="text-red-600 text-sm mt-1">Please use a company email address</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy"
                        placeholder="Your company name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.mobileNumber}
                        onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                        className={`w-full pl-4 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-navy focus:border-navy ${
                          formData.mobileNumber && !isValidMobileNumber(formData.mobileNumber) 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300'
                        }`}
                        placeholder="+971 50 123 4567"
                      />
                    </div>
                    {formData.mobileNumber && !isValidMobileNumber(formData.mobileNumber) && (
                      <p className="text-red-600 text-sm mt-1">Please enter a valid mobile number</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: Team Selection */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-navy mr-3" />
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Your Team</h2>
                    <p className="text-gray-600">Choose the team you want to analyze for efficiency improvements</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teams.map((team) => (
                    <TeamCard
                      key={team.id}
                      team={team}
                      isSelected={selectedTeam === team.id}
                      onClick={() => handleTeamSelection(team.id)}
                    />
                  ))}
                </div>

                {selectedTeam && currentTeam && (
                  <div className="mt-8 p-6 bg-navy-50 rounded-xl border border-navy-200">
                    <h3 className="text-lg font-semibold text-navy-900 mb-3">
                      BSG Services for {currentTeam.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {currentTeam.bsgServices.map((service, index) => (
                        <div key={index} className="flex items-center text-navy-700">
                          <CheckCircle className="h-4 w-4 mr-2 text-navy" />
                          <span>{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Role Selection + Team Size */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="flex items-center justify-center mb-6">
                  <Building className="h-8 w-8 text-navy mr-3" />
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Role Level & Team Size</h2>
                    <p className="text-gray-600">Select the primary role level and specify team size</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Role Level</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {Object.entries(roleDefaults).map(([roleId, roleData]) => (
                        <RoleCard
                          key={roleId}
                          roleId={roleId}
                          roleData={roleData}
                          isSelected={selectedRole === roleId}
                          onClick={() => handleRoleSelection(roleId)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="max-w-md mx-auto">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Team Size *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="number"
                        value={formData.teamSize}
                        onChange={(e) => handleInputChange('teamSize', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy"
                        placeholder="Number of team members"
                        min="1"
                        max="50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Cost Breakdown */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="flex items-center justify-center mb-6">
                  <CreditCard className="h-8 w-8 text-navy mr-3" />
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Employee Cost Breakdown</h2>
                    <p className="text-gray-600">
                      Configure the true cost of employment in {currencies[selectedCurrency].name}
                    </p>
                  </div>
                </div>

                {currentRoleDefaults && (
                  <div className="space-y-6">
                    {/* Base Salary */}
                    <div className="p-6 border border-gray-200 rounded-xl bg-navy-50">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-navy" />
                        Base Annual Salary *
                      </h3>
                      <div className="max-w-md">
                        <input
                          type="number"
                          value={formData.fullSalary}
                          onChange={(e) => handleInputChange('fullSalary', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy text-lg font-semibold"
                          placeholder={`${currencyInfo.symbol} amount`}
                          min="0"
                          step="1000"
                        />
                        <p className="text-sm text-gray-600 mt-2">
                          Default for {currentRoleDefaults.name}: {formatCurrency(currentRoleDefaults.salaries[selectedCurrency])}
                        </p>
                      </div>
                    </div>

                    {/* Overhead Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <CostCategoryCard
                        icon={<Plane className="h-6 w-6 text-navy" />}
                        title="Visa & Documentation"
                        description="Legal immigration and work permit costs"
                        detailedItems={['Work permit fees', 'Visa processing', 'Legal documentation', 'Government fees']}
                        isCustom={formData.visaCostsCustom}
                        defaultValue={currentRoleDefaults.overheads[selectedCurrency].visaCosts}
                        customValue={formData.visaCosts}
                        onToggle={(custom) => handleInputChange('visaCostsCustom', custom)}
                        onValueChange={(value) => handleInputChange('visaCosts', value)}
                      />

                      <CostCategoryCard
                        icon={<Heart className="h-6 w-6 text-red-600" />}
                        title="Health Insurance"
                        description="Comprehensive medical coverage"
                        detailedItems={['Medical insurance', 'Dental coverage', 'Vision care', 'Family coverage']}
                        isCustom={formData.insuranceCustom}
                        defaultValue={currentRoleDefaults.overheads[selectedCurrency].insurance}
                        customValue={formData.insurance}
                        onToggle={(custom) => handleInputChange('insuranceCustom', custom)}
                        onValueChange={(value) => handleInputChange('insurance', value)}
                      />

                      <CostCategoryCard
                        icon={<GraduationCap className="h-6 w-6 text-green-600" />}
                        title="Training & Development"
                        description="Professional development and onboarding"
                        detailedItems={['Initial training', 'Certifications', 'Conferences', 'Skills development']}
                        isCustom={formData.trainingCustom}
                        defaultValue={currentRoleDefaults.overheads[selectedCurrency].training}
                        customValue={formData.training}
                        onToggle={(custom) => handleInputChange('trainingCustom', custom)}
                        onValueChange={(value) => handleInputChange('training', value)}
                      />

                      <CostCategoryCard
                        icon={<Laptop className="h-6 w-6 text-gold" />}
                        title="Equipment & Technology"
                        description="Hardware, software, and technology setup"
                        detailedItems={['Laptop/computer', 'Software licenses', 'Phone/mobile', 'Office supplies']}
                        isCustom={formData.equipmentCustom}
                        defaultValue={currentRoleDefaults.overheads[selectedCurrency].equipment}
                        customValue={formData.equipment}
                        onToggle={(custom) => handleInputChange('equipmentCustom', custom)}
                        onValueChange={(value) => handleInputChange('equipment', value)}
                      />

                      <CostCategoryCard
                        icon={<Home className="h-6 w-6 text-orange-600" />}
                        title="Office Space & Utilities"
                        description="Physical workspace and operational costs"
                        detailedItems={['Desk allocation', 'Utilities', 'Internet', 'Facilities costs']}
                        isCustom={formData.officeSpaceCustom}
                        defaultValue={currentRoleDefaults.overheads[selectedCurrency].officeSpace}
                        customValue={formData.officeSpace}
                        onToggle={(custom) => handleInputChange('officeSpaceCustom', custom)}
                        onValueChange={(value) => handleInputChange('officeSpace', value)}
                      />

                      <CostCategoryCard
                        icon={<PiggyBank className="h-6 w-6 text-yellow-600" />}
                        title="End of Service Gratuity"
                        description="Legal gratuity payment obligation"
                        detailedItems={['21 days salary per year', 'Legal requirement', 'Calculated automatically', 'Based on tenure']}
                        isCustom={formData.eosGratuityCustom}
                        defaultValue={calculateEmployeeCost().autoEosGratuity}
                        customValue={formData.eosGratuity}
                        onToggle={(custom) => handleInputChange('eosGratuityCustom', custom)}
                        onValueChange={(value) => handleInputChange('eosGratuity', value)}
                      />
                    </div>

                    {/* Other Costs */}
                    <div className="p-6 border border-gray-200 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Calculator className="h-5 w-5 mr-2 text-gray-600" />
                        Other Annual Costs
                        <Tooltip text="Any additional annual costs not covered above" />
                      </h4>
                      <input
                        type="number"
                        value={formData.otherCosts}
                        onChange={(e) => handleInputChange('otherCosts', e.target.value)}
                        className="w-32 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-navy"
                        min="0"
                        step="100"
                      />
                    </div>

                    {/* Cost Summary */}
                    <div className="bg-slate-800 text-white p-6 rounded-xl">
                      <h3 className="text-xl font-semibold mb-4">Cost Summary</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-2xl font-bold">
                            {formatCurrency(calculateEmployeeCost().fullSalary)}
                          </div>
                          <div className="text-slate-300 text-sm">Base Salary</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">
                            {formatCurrency(calculateEmployeeCost().totalOverheads)}
                          </div>
                          <div className="text-slate-300 text-sm">Total Overheads</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-yellow-400">
                            {formatCurrency(calculateEmployeeCost().trueCost)}
                          </div>
                          <div className="text-slate-300 text-sm">True Cost per Employee</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-400">
                            {Math.round((calculateEmployeeCost().totalOverheads / calculateEmployeeCost().trueCost) * 100)}%
                          </div>
                          <div className="text-slate-300 text-sm">Overhead Ratio</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: Task Allocation */}
            {currentStep === 4 && currentTeam && (
              <div className="space-y-8">
                <div className="flex items-center justify-center mb-6">
                  <Clock className="h-8 w-8 text-navy mr-3" />
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Task Time Allocation</h2>
                    <p className="text-gray-600">How does your {currentTeam.name.toLowerCase()} spend their weekly time?</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {currentTeam.tasks.map((task) => (
                    <TaskSlider
                      key={task.id}
                      task={task}
                      value={taskAllocations[task.id]}
                      onChange={handleTaskAllocation}
                    />
                  ))}

                  <div className={`p-4 rounded-lg border-2 ${
                    totalAllocation >= 98 && totalAllocation <= 102 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-red-500 bg-red-50'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Allocation:</span>
                      <span className={`text-2xl font-bold ${
                        totalAllocation >= 98 && totalAllocation <= 102 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {totalAllocation}%
                      </span>
                    </div>
                    {totalAllocation < 98 && (
                      <p className="text-red-600 text-sm mt-2">Total should be approximately 100% (98-102% acceptable)</p>
                    )}
                    {totalAllocation > 102 && (
                      <p className="text-red-600 text-sm mt-2">Total exceeds 100% - please adjust allocations</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Diagnostic Questions */}
            {currentStep === 5 && currentTeam && teamQuestions[currentTeam.id] && (
              <div className="space-y-8">
                <div className="flex items-center justify-center mb-6">
                  <AlertCircle className="h-8 w-8 text-navy mr-3" />
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentTeam.name} Diagnostic</h2>
                    <p className="text-gray-600">Answer these questions to identify efficiency gaps</p>
                  </div>
                </div>

                <div className="space-y-8">
                  {teamQuestions[currentTeam.id].map((question, questionIndex) => (
                    <div key={questionIndex} className="p-6 border border-gray-200 rounded-xl bg-white">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {questionIndex + 1}. {question.question}
                      </h3>
                      <div className="space-y-3">
                        {question.options.map((option, optionIndex) => (
                          <label
                            key={optionIndex}
                            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:scale-102 ${
                              formData.diagnosticAnswers[questionIndex] === optionIndex
                                ? 'border-navy bg-navy-50'
                                : 'border-gray-200 hover:border-navy-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${questionIndex}`}
                              value={optionIndex}
                              checked={formData.diagnosticAnswers[questionIndex] === optionIndex}
                              onChange={() => handleDiagnosticAnswer(questionIndex, optionIndex)}
                              className="mr-4"
                            />
                            <span className="flex-1">{option.label}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              option.inefficiency === 0 ? 'bg-green-100 text-green-800' :
                              option.inefficiency <= 50 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {option.inefficiency === 0 ? 'Optimal' :
                               option.inefficiency <= 50 ? 'Moderate' : 'High Impact'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live Diagnostic Preview */}
                {Object.keys(formData.diagnosticAnswers).length > 0 && (
                  <div className="mt-8 p-4 bg-navy-50 border border-navy-200 rounded-lg">
                    <h3 className="font-medium text-navy-900 mb-2">Live Diagnostic Preview</h3>
                    <div className="text-sm text-navy-800">
                      <div>Inefficiency Score: {Math.round(calculateDiagnosticResults().inefficiencyPercent * 100)}%</div>
                      <div>Weekly Time Waste: {calculateDiagnosticResults().timeWasteHours} hours per employee</div>
                      {calculateDiagnosticResults().keyIssues.length > 0 && (
                        <div className="mt-2">Key Issues: {calculateDiagnosticResults().keyIssues.map(issue => `${issue.area} (${issue.impact})`).join(', ')}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 6: Goals & Timeline */}
            {currentStep === 6 && (
              <div className="space-y-8">
                <div className="flex items-center justify-center mb-6">
                  <Target className="h-8 w-8 text-navy mr-3" />
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Optimization Goals</h2>
                    <p className="text-gray-600">Define your efficiency improvement objectives</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Primary Goal for Team Optimization *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: 'cost_reduction', label: 'Cost Reduction', icon: <DollarSign className="h-5 w-5" />, desc: 'Lower operational expenses' },
                        { id: 'efficiency_boost', label: 'Efficiency Boost', icon: <TrendingUp className="h-5 w-5" />, desc: 'Improve productivity metrics' },
                        { id: 'quality_improvement', label: 'Quality Improvement', icon: <CheckCircle className="h-5 w-5" />, desc: 'Enhanced output quality' },
                        { id: 'scalability', label: 'Scalability', icon: <Users className="h-5 w-5" />, desc: 'Support business growth' }
                      ].map((goal) => (
                        <label
                          key={goal.id}
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.primaryGoal === goal.id
                              ? 'border-navy bg-navy-50'
                              : 'border-gray-200 hover:border-navy-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="primaryGoal"
                            value={goal.id}
                            checked={formData.primaryGoal === goal.id}
                            onChange={(e) => handleInputChange('primaryGoal', e.target.value)}
                            className="mr-3"
                          />
                          <div className="text-navy mr-3">{goal.icon}</div>
                          <div>
                            <div className="font-semibold">{goal.label}</div>
                            <div className="text-sm text-gray-600">{goal.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Target Efficiency Level *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: '95', label: '95%', desc: 'Excellent efficiency' },
                        { id: '97', label: '97%', desc: 'Near-perfect efficiency' },
                        { id: '99', label: '99%', desc: 'World-class efficiency' }
                      ].map((level) => (
                        <label
                          key={level.id}
                          className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.targetEfficiency === level.id
                              ? 'border-navy bg-navy-50'
                              : 'border-gray-200 hover:border-navy-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="targetEfficiency"
                            value={level.id}
                            checked={formData.targetEfficiency === level.id}
                            onChange={(e) => handleInputChange('targetEfficiency', e.target.value)}
                            className="mb-2"
                          />
                          <div className="text-2xl font-bold text-navy">{level.label}</div>
                          <div className="text-sm text-gray-600 text-center">{level.desc}</div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Implementation Timeline *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: '3_months', label: '3 Months', desc: 'Rapid implementation' },
                        { id: '6_months', label: '6 Months', desc: 'Balanced approach' },
                        { id: '12_months', label: '12 Months', desc: 'Gradual transition' }
                      ].map((timeline) => (
                        <label
                          key={timeline.id}
                          className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.timeline === timeline.id
                              ? 'border-navy bg-navy-50'
                              : 'border-gray-200 hover:border-navy-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="timeline"
                            value={timeline.id}
                            checked={formData.timeline === timeline.id}
                            onChange={(e) => handleInputChange('timeline', e.target.value)}
                            className="mb-2"
                          />
                          <Clock className="h-8 w-8 text-navy mb-2" />
                          <div className="text-lg font-semibold">{timeline.label}</div>
                          <div className="text-sm text-gray-600 text-center">{timeline.desc}</div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-navy-50 rounded-xl border border-navy-200">
                    <h3 className="text-lg font-semibold text-navy-900 mb-2">Team Maturity Assessment</h3>
                    <p className="text-navy-700 mb-4">Rate your team's current process maturity level</p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      {[
                        { value: '1', label: 'Basic', desc: 'Ad-hoc processes' },
                        { value: '2', label: 'Developing', desc: 'Some documentation' },
                        { value: '3', label: 'Mature', desc: 'Well-defined processes' },
                        { value: '4', label: 'Advanced', desc: 'Optimized & automated' }
                      ].map((maturity) => (
                        <label
                          key={maturity.value}
                          className={`flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.teamMaturity === maturity.value
                              ? 'border-navy bg-white'
                              : 'border-navy-200 hover:border-navy-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="teamMaturity"
                            value={maturity.value}
                            checked={formData.teamMaturity === maturity.value}
                            onChange={(e) => handleInputChange('teamMaturity', e.target.value)}
                            className="mb-2"
                          />
                          <div className="font-semibold text-navy-900">{maturity.label}</div>
                          <div className="text-xs text-navy-700 text-center">{maturity.desc}</div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  currentStep === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105'
                }`}
              >
                <ChevronRight className="h-5 w-5 mr-2 transform rotate-180" />
                Previous
              </button>

              <div className="flex-1 flex justify-center">
                <div className="flex space-x-2">
                  {Array.from({ length: totalSteps }, (_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentStep
                          ? 'bg-gradient-to-r from-navy to-gold shadow-lg scale-110'
                          : index < currentStep
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-md'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* DIAGNOSTIC TEST BUTTON - Added for calculation testing */}
              {currentStep >= 3 && (
                <button 
                  onClick={() => {
                    console.clear();
                    runDiagnosticTest();
                    testCalculationAccuracy();
                    identifyCalculationIssues();
                    alert('Diagnostic test complete! Check browser console (F12) for detailed results.');
                  }}
                  className="group flex items-center px-3 py-2 rounded-lg font-medium text-xs bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 hover:scale-105 transition-all duration-200 mr-4"
                  title="Run diagnostic tests on calculations"
                >
                  <Calculator className="h-3 w-3 mr-2" />
                  Test
                </button>
              )}

              {currentStep < totalSteps - 1 ? (
                <button
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    validateStep(currentStep)
                      ? 'bg-navy text-white hover:bg-navy-700 hover:scale-105 shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next
                  <ChevronRight className="h-5 w-5 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!validateStep(currentStep)}
                  className={`flex items-center px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    validateStep(currentStep)
                      ? 'bg-gradient-to-r from-green-600 to-navy text-white hover:from-green-700 hover:to-navy-700 hover:scale-105 shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  Calculate Results
                </button>
              )}
            </div>

            {/* Step Validation Messages */}
            {!validateStep(currentStep) && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700 font-medium">
                    {currentStep === 0 && 'Please complete all contact information and select a currency'}
                    {currentStep === 1 && 'Please select a team to analyze'}
                    {currentStep === 2 && 'Please select a role level and specify team size'}
                    {currentStep === 3 && 'Please enter a valid base salary'}
                    {currentStep === 4 && 'Please ensure task allocation totals approximately 100%'}
                    {currentStep === 5 && 'Please answer all diagnostic questions'}
                    {currentStep === 6 && 'Please complete all optimization goal selections'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamEfficiencyCalculator;