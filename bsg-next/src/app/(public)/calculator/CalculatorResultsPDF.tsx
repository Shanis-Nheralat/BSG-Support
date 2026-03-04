import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { CalculationResults, FormDataState, TeamDefinition, RoleLevel, CurrencyCode } from "@/lib/calculator/types";
import { currencies } from "@/lib/calculator/constants";

// Register fonts
Font.register({
  family: "Poppins",
  fonts: [
    { src: "https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrFJA.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7V1s.ttf", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLDz8V1s.ttf", fontWeight: 700 },
  ],
});

// Hyphenation callback to prevent word breaks
Font.registerHyphenationCallback((word) => [word]);

// Colors matching the app theme
const colors = {
  navy: "#062767",
  navyDark: "#041a4a",
  gold: "#b19763",
  white: "#ffffff",
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray500: "#6b7280",
  gray700: "#374151",
  gray900: "#111827",
  red500: "#ef4444",
  red600: "#dc2626",
  green500: "#22c55e",
  green600: "#16a34a",
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Poppins",
    fontSize: 10,
    color: colors.gray900,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.navy,
    padding: 20,
    marginBottom: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    width: 120,
    height: 34,
    marginRight: 16,
  },
  headerTextBlock: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 10,
    color: colors.white,
    marginTop: 3,
    opacity: 0.9,
  },
  section: {
    marginBottom: 12,
    padding: 14,
    backgroundColor: colors.white,
    border: `1px solid ${colors.gray100}`,
    borderRadius: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: colors.navy,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  col2: {
    flex: 1,
    paddingHorizontal: 4,
  },
  card: {
    padding: 10,
    borderRadius: 6,
    marginBottom: 6,
  },
  cardRed: {
    backgroundColor: "#fef2f2",
    border: `1px solid #fecaca`,
  },
  cardGreen: {
    backgroundColor: "#f0fdf4",
    border: `1px solid #bbf7d0`,
  },
  cardLabel: {
    fontSize: 8,
    color: colors.gray500,
    marginBottom: 3,
    textTransform: "uppercase",
  },
  cardValue: {
    fontSize: 15,
    fontWeight: 700,
  },
  cardValueRed: {
    color: colors.red600,
  },
  cardValueGreen: {
    color: colors.green600,
  },
  cardValueWhite: {
    color: colors.white,
  },
  table: {
    width: "100%",
    marginTop: 6,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.navy,
    padding: 7,
  },
  tableHeaderCell: {
    flex: 1,
    color: colors.white,
    fontWeight: 600,
    fontSize: 9,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: `1px solid ${colors.gray100}`,
    padding: 7,
  },
  tableRowAlt: {
    backgroundColor: colors.gray50,
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    textAlign: "center",
  },
  summaryBox: {
    backgroundColor: colors.navy,
    padding: 14,
    borderRadius: 6,
    marginTop: 10,
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 8,
    color: colors.white,
    opacity: 0.7,
    marginBottom: 3,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.white,
  },
  summaryValueGold: {
    color: colors.gold,
  },
  footer: {
    marginTop: "auto",
    paddingTop: 10,
    borderTop: `1px solid ${colors.gray100}`,
    textAlign: "center",
  },
  footerText: {
    fontSize: 8,
    color: colors.gray500,
  },
  benefitCard: {
    backgroundColor: colors.green600,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 3,
  },
  benefitLabel: {
    fontSize: 7,
    color: colors.white,
    marginTop: 3,
  },
  benefitValue: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.white,
  },
  companyBox: {
    backgroundColor: colors.navy,
    padding: 14,
    borderRadius: 6,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.white,
    textAlign: "center",
  },
  companyInfo: {
    fontSize: 9,
    color: colors.white,
    textAlign: "center",
    marginTop: 3,
    opacity: 0.9,
  },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    borderBottom: `1px solid rgba(255,255,255,0.2)`,
  },
  costLabel: {
    fontSize: 8,
    color: colors.white,
  },
  costValue: {
    fontSize: 8,
    color: colors.white,
  },
  costTotal: {
    fontWeight: 700,
    paddingTop: 6,
    borderBottom: "none",
  },
  overheadSubRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
    paddingLeft: 6,
  },
  overheadSubLabel: {
    fontSize: 7,
    color: colors.white,
    opacity: 0.85,
  },
  overheadSubValue: {
    fontSize: 7,
    color: colors.white,
    opacity: 0.85,
  },
  noteBox: {
    backgroundColor: "#eff6ff",
    padding: 10,
    borderRadius: 4,
    marginTop: 8,
  },
  noteText: {
    fontSize: 7,
    color: colors.navy,
    lineHeight: 1.4,
  },
  pageNumber: {
    position: "absolute",
    bottom: 20,
    right: 40,
    fontSize: 8,
    color: colors.gray500,
  },
});

function formatCurrency(amount: number, currency: CurrencyCode): string {
  const currencyInfo = currencies[currency];
  return `${currencyInfo.symbol}${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

interface CalculatorResultsPDFProps {
  results: CalculationResults;
  formData: FormDataState;
  selectedTeam: TeamDefinition | undefined;
  selectedRole: RoleLevel | undefined;
}

export function CalculatorResultsPDF({
  results,
  formData,
  selectedTeam,
  selectedRole,
}: CalculatorResultsPDFProps) {
  const c = formData.selectedCurrency;
  const { currentSituation, withBSG, results: r, employeeCost } = results;
  const timeReduction = r.hoursReclaimed > 0 ? Math.round(((r.hoursReclaimed - 2) / r.hoursReclaimed) * 100) : 0;

  return (
    <Document>
      {/* ─── Page 1: Summary & Performance ─── */}
      <Page size="A4" style={styles.page}>
        {/* Header with Logo */}
        <View style={styles.header}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image
            src="/images/logo.png"
            style={styles.headerLogo}
          />
          <View style={styles.headerTextBlock}>
            <Text style={styles.headerTitle}>
              {selectedTeam?.name} Optimization Report
            </Text>
            <Text style={styles.headerSubtitle}>
              Strategic Business Enhancement Analysis ({currencies[c].name})
            </Text>
          </View>
        </View>

        {/* Executive Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <View style={styles.row}>
            <View style={[styles.col2]}>
              <View style={[styles.card, styles.cardRed]}>
                <Text style={{ fontSize: 10, fontWeight: 600, marginBottom: 4 }}>Current State</Text>
                <Text style={{ fontSize: 8, color: colors.gray700, lineHeight: 1.4 }}>
                  Your {results.teamSize}-person {selectedTeam?.name?.toLowerCase()} costs {formatCurrency(currentSituation.teamCost, c)} annually but operates at only {currentSituation.currentEfficiency}% efficiency, wasting {r.hoursReclaimed} hours per week.
                </Text>
              </View>
            </View>
            <View style={[styles.col2]}>
              <View style={[styles.card, styles.cardGreen]}>
                <Text style={{ fontSize: 10, fontWeight: 600, marginBottom: 4 }}>Future with BSG</Text>
                <Text style={{ fontSize: 8, color: colors.gray700, lineHeight: 1.4 }}>
                  BSG delivers {withBSG.bsgEfficiency}% efficiency at {formatCurrency(withBSG.bsgTotalCost, c)} annually - {r.isPositiveSavings ? `saving you ${formatCurrency(r.realSavings, c)}` : `with quality investment`} while reclaiming {Math.max(0, r.hoursReclaimed - 2)} productive hours per week.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Company Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company Overview</Text>
          <View style={styles.companyBox}>
            <Text style={styles.companyName}>
              {(formData.companyName || "YOUR COMPANY").toUpperCase()}{"'"}S TEAM ANALYSIS
            </Text>
            <Text style={styles.companyInfo}>
              {selectedTeam?.name} | {results.teamSize} Personnel | {currencies[c].name}
            </Text>
          </View>
        </View>

        {/* Current Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Performance</Text>
          <View style={styles.row}>
            <View style={styles.col2}>
              <View style={[styles.card, { backgroundColor: colors.red600, alignItems: "center" }]}>
                <Text style={styles.cardLabel}>Annual Cost</Text>
                <Text style={[styles.cardValue, styles.cardValueWhite]}>
                  {formatCurrency(currentSituation.teamCost, c)}
                </Text>
              </View>
            </View>
            <View style={styles.col2}>
              <View style={[styles.card, { backgroundColor: colors.red600, alignItems: "center" }]}>
                <Text style={styles.cardLabel}>Efficiency</Text>
                <Text style={[styles.cardValue, styles.cardValueWhite]}>
                  {currentSituation.currentEfficiency}%
                </Text>
              </View>
            </View>
            <View style={styles.col2}>
              <View style={[styles.card, { backgroundColor: colors.red600, alignItems: "center" }]}>
                <Text style={styles.cardLabel}>Wasted Hours/wk</Text>
                <Text style={[styles.cardValue, styles.cardValueWhite]}>
                  {r.hoursReclaimed}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* BSG Comparison Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BSG Solution Comparison</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { textAlign: "left" }]}>Metric</Text>
              <Text style={styles.tableHeaderCell}>Current</Text>
              <Text style={styles.tableHeaderCell}>With BSG</Text>
              <Text style={styles.tableHeaderCell}>Improvement</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { textAlign: "left", fontWeight: 600 }]}>Annual Cost</Text>
              <Text style={[styles.tableCell, { color: colors.red600 }]}>{formatCurrency(currentSituation.teamCost, c)}</Text>
              <Text style={[styles.tableCell, { color: colors.green600 }]}>{formatCurrency(withBSG.bsgTotalCost, c)}</Text>
              <Text style={[styles.tableCell, { color: r.isPositiveSavings ? colors.green600 : colors.red600 }]}>
                {r.isPositiveSavings ? `${Math.round((r.realSavings / currentSituation.teamCost) * 100)}% Reduction` : `${Math.round((Math.abs(r.realSavings) / currentSituation.teamCost) * 100)}% Increase`}
              </Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowAlt]}>
              <Text style={[styles.tableCell, { textAlign: "left", fontWeight: 600 }]}>Efficiency Rate</Text>
              <Text style={[styles.tableCell, { color: colors.red600 }]}>{currentSituation.currentEfficiency}%</Text>
              <Text style={[styles.tableCell, { color: colors.green600 }]}>{withBSG.bsgEfficiency}%</Text>
              <Text style={[styles.tableCell, { color: colors.green600 }]}>{r.efficiencyGain}% Increase</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { textAlign: "left", fontWeight: 600 }]}>Time Wastage</Text>
              <Text style={[styles.tableCell, { color: colors.red600 }]}>{r.hoursReclaimed} hrs/week</Text>
              <Text style={[styles.tableCell, { color: colors.green600 }]}>2 hrs/week</Text>
              <Text style={[styles.tableCell, { color: colors.green600 }]}>{timeReduction}% Reduction</Text>
            </View>
          </View>
        </View>

        {/* Key Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Benefits Summary</Text>
          <View style={[styles.row, { marginTop: 6 }]}>
            <View style={styles.benefitCard}>
              <Text style={styles.benefitValue}>{formatCurrency(Math.abs(r.realSavings), c)}</Text>
              <Text style={styles.benefitLabel}>{r.isPositiveSavings ? "Annual Savings" : "Investment"}</Text>
            </View>
            <View style={styles.benefitCard}>
              <Text style={styles.benefitValue}>{Math.max(0, r.hoursReclaimed - 2)}</Text>
              <Text style={styles.benefitLabel}>Hours/Week Gained</Text>
            </View>
            <View style={styles.benefitCard}>
              <Text style={styles.benefitValue}>{withBSG.bsgEfficiency}%</Text>
              <Text style={styles.benefitLabel}>Guaranteed Rate</Text>
            </View>
            <View style={styles.benefitCard}>
              <Text style={styles.benefitValue}>{r.isPositiveSavings ? `${r.roi}%` : "Quality"}</Text>
              <Text style={styles.benefitLabel}>{r.isPositiveSavings ? "ROI" : "Investment"}</Text>
            </View>
          </View>

          {/* ROI Summary Box */}
          {r.isPositiveSavings && (
            <View style={styles.summaryBox}>
              <Text style={{ fontSize: 10, fontWeight: 600, color: colors.white, textAlign: "center", marginBottom: 8 }}>
                Return on Investment
              </Text>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Investment</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(withBSG.bsgTotalCost, c)}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Savings</Text>
                  <Text style={[styles.summaryValue, styles.summaryValueGold]}>{formatCurrency(r.realSavings, c)}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>ROI</Text>
                  <Text style={styles.summaryValue}>{r.roi}%</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Payback</Text>
                  <Text style={styles.summaryValue}>Immediate</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Page Number */}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Backsure Global Support | www.backsureglobalsupport.com | info@backsureglobalsupport.com
          </Text>
        </View>
      </Page>

      {/* ─── Page 2: Cost Analysis & Methodology ─── */}
      <Page size="A4" style={styles.page}>
        {/* Mini Header */}
        <View style={[styles.header, { padding: 12, marginBottom: 12 }]}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image
            src="/images/logo.png"
            style={{ width: 90, height: 25, marginRight: 12 }}
          />
          <View style={styles.headerTextBlock}>
            <Text style={{ fontSize: 12, fontWeight: 700, color: colors.white }}>
              Cost Analysis & Methodology
            </Text>
            <Text style={{ fontSize: 8, color: colors.white, opacity: 0.9 }}>
              {(formData.companyName || "Company").toUpperCase()} | {selectedTeam?.name} | {currencies[c].name}
            </Text>
          </View>
        </View>

        {/* Detailed Cost Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detailed Cost Breakdown</Text>
          <View style={styles.row}>
            {/* Cost Per Employee */}
            <View style={styles.col2}>
              <View style={[styles.card, { backgroundColor: colors.red600 }]}>
                <Text style={{ fontSize: 10, fontWeight: 600, color: colors.white, marginBottom: 6 }}>Cost Per Employee (Annual)</Text>
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Base Salary</Text>
                  <Text style={styles.costValue}>{formatCurrency(employeeCost.fullSalary, c)}</Text>
                </View>
                {/* Overhead Breakdown */}
                <View style={{ paddingVertical: 3, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
                  <Text style={{ fontSize: 8, fontWeight: 600, color: colors.white, opacity: 0.9, marginBottom: 3 }}>Overhead Breakdown:</Text>
                  <View style={styles.overheadSubRow}>
                    <Text style={styles.overheadSubLabel}>Visa & Work Permit</Text>
                    <Text style={styles.overheadSubValue}>{formatCurrency(employeeCost.visaCosts, c)}</Text>
                  </View>
                  <View style={styles.overheadSubRow}>
                    <Text style={styles.overheadSubLabel}>Health Insurance</Text>
                    <Text style={styles.overheadSubValue}>{formatCurrency(employeeCost.insurance, c)}</Text>
                  </View>
                  <View style={styles.overheadSubRow}>
                    <Text style={styles.overheadSubLabel}>Training & Development</Text>
                    <Text style={styles.overheadSubValue}>{formatCurrency(employeeCost.training, c)}</Text>
                  </View>
                  <View style={styles.overheadSubRow}>
                    <Text style={styles.overheadSubLabel}>Equipment & IT</Text>
                    <Text style={styles.overheadSubValue}>{formatCurrency(employeeCost.equipment, c)}</Text>
                  </View>
                  <View style={styles.overheadSubRow}>
                    <Text style={styles.overheadSubLabel}>Office Space</Text>
                    <Text style={styles.overheadSubValue}>{formatCurrency(employeeCost.officeSpace, c)}</Text>
                  </View>
                  <View style={styles.overheadSubRow}>
                    <Text style={styles.overheadSubLabel}>Leave Salary</Text>
                    <Text style={styles.overheadSubValue}>{formatCurrency(employeeCost.leaveSalary, c)}</Text>
                  </View>
                  <View style={styles.overheadSubRow}>
                    <Text style={styles.overheadSubLabel}>Annual Flight</Text>
                    <Text style={styles.overheadSubValue}>{formatCurrency(employeeCost.annualFlight, c)}</Text>
                  </View>
                  <View style={styles.overheadSubRow}>
                    <Text style={styles.overheadSubLabel}>EOS Gratuity</Text>
                    <Text style={styles.overheadSubValue}>{formatCurrency(employeeCost.eosGratuity, c)}</Text>
                  </View>
                  {employeeCost.otherCosts > 0 && (
                    <View style={styles.overheadSubRow}>
                      <Text style={styles.overheadSubLabel}>Other Costs</Text>
                      <Text style={styles.overheadSubValue}>{formatCurrency(employeeCost.otherCosts, c)}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.costRow}>
                  <Text style={[styles.costLabel, { fontWeight: 600 }]}>Total Overheads</Text>
                  <Text style={[styles.costValue, { fontWeight: 600 }]}>{formatCurrency(employeeCost.totalOverheads, c)}</Text>
                </View>
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Inefficiency Loss</Text>
                  <Text style={styles.costValue}>{currentSituation.productivityLoss}% capacity</Text>
                </View>
                <View style={[styles.costRow, styles.costTotal]}>
                  <Text style={[styles.costLabel, { fontWeight: 700, fontSize: 10 }]}>True Cost Per Head</Text>
                  <Text style={[styles.costValue, { fontWeight: 700, fontSize: 10 }]}>{formatCurrency(currentSituation.trueCostPerEmployee, c)}</Text>
                </View>
              </View>
            </View>

            {/* Total Team Costs */}
            <View style={styles.col2}>
              <View style={[styles.card, { backgroundColor: colors.red600 }]}>
                <Text style={{ fontSize: 10, fontWeight: 600, color: colors.white, marginBottom: 6 }}>Total Team Costs (Annual)</Text>
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Total Salaries ({results.teamSize} staff)</Text>
                  <Text style={styles.costValue}>{formatCurrency(employeeCost.fullSalary * results.teamSize, c)}</Text>
                </View>
                {/* Overhead Breakdown */}
                <View style={{ paddingVertical: 3, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
                    <Text style={{ fontSize: 8, fontWeight: 600, color: colors.white, opacity: 0.9 }}>Total Overheads:</Text>
                    <Text style={{ fontSize: 8, fontWeight: 600, color: colors.white, opacity: 0.9 }}>{formatCurrency(employeeCost.totalOverheads * results.teamSize, c)}</Text>
                  </View>
                  <View style={styles.overheadSubRow}>
                    <Text style={styles.overheadSubLabel}>Visa & Work Permit</Text>
                    <Text style={styles.overheadSubValue}>{formatCurrency(employeeCost.visaCosts * results.teamSize, c)}</Text>
                  </View>
                  <View style={styles.overheadSubRow}>
                    <Text style={styles.overheadSubLabel}>Health Insurance</Text>
                    <Text style={styles.overheadSubValue}>{formatCurrency(employeeCost.insurance * results.teamSize, c)}</Text>
                  </View>
                  <View style={styles.overheadSubRow}>
                    <Text style={styles.overheadSubLabel}>Training & Development</Text>
                    <Text style={styles.overheadSubValue}>{formatCurrency(employeeCost.training * results.teamSize, c)}</Text>
                  </View>
                  <View style={styles.overheadSubRow}>
                    <Text style={styles.overheadSubLabel}>Equipment & IT</Text>
                    <Text style={styles.overheadSubValue}>{formatCurrency(employeeCost.equipment * results.teamSize, c)}</Text>
                  </View>
                  <View style={styles.overheadSubRow}>
                    <Text style={styles.overheadSubLabel}>Office Space</Text>
                    <Text style={styles.overheadSubValue}>{formatCurrency(employeeCost.officeSpace * results.teamSize, c)}</Text>
                  </View>
                  <View style={styles.overheadSubRow}>
                    <Text style={styles.overheadSubLabel}>Leave Salary</Text>
                    <Text style={styles.overheadSubValue}>{formatCurrency(employeeCost.leaveSalary * results.teamSize, c)}</Text>
                  </View>
                  <View style={styles.overheadSubRow}>
                    <Text style={styles.overheadSubLabel}>Annual Flight</Text>
                    <Text style={styles.overheadSubValue}>{formatCurrency(employeeCost.annualFlight * results.teamSize, c)}</Text>
                  </View>
                  <View style={styles.overheadSubRow}>
                    <Text style={styles.overheadSubLabel}>EOS Gratuity</Text>
                    <Text style={styles.overheadSubValue}>{formatCurrency(employeeCost.eosGratuity * results.teamSize, c)}</Text>
                  </View>
                  {employeeCost.otherCosts > 0 && (
                    <View style={styles.overheadSubRow}>
                      <Text style={styles.overheadSubLabel}>Other Costs</Text>
                      <Text style={styles.overheadSubValue}>{formatCurrency(employeeCost.otherCosts * results.teamSize, c)}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Weekly Time Waste</Text>
                  <Text style={styles.costValue}>{r.hoursReclaimed} hours</Text>
                </View>
                <View style={[styles.costRow, styles.costTotal]}>
                  <Text style={[styles.costLabel, { fontWeight: 700, fontSize: 10 }]}>Annual Total</Text>
                  <Text style={[styles.costValue, { fontWeight: 700, fontSize: 10 }]}>{formatCurrency(currentSituation.teamCost, c)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Calculation Methodology */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calculation Methodology</Text>
          <View style={{ backgroundColor: colors.gray50, padding: 12, borderRadius: 4 }}>
            <View style={styles.row}>
              <View style={styles.col2}>
                <Text style={{ fontSize: 9, fontWeight: 600, color: colors.navy, marginBottom: 6 }}>Current Cost Calculation</Text>
                <Text style={{ fontSize: 8, color: colors.gray700, marginBottom: 2 }}>Base Salary: {formatCurrency(employeeCost.fullSalary, c)}</Text>
                <Text style={{ fontSize: 8, color: colors.gray700, marginBottom: 2 }}>Total Overheads: {formatCurrency(employeeCost.totalOverheads, c)}</Text>
                <Text style={{ fontSize: 8, color: colors.gray700, marginBottom: 2 }}>True Cost per Employee: {formatCurrency(employeeCost.trueCost, c)}</Text>
                <Text style={{ fontSize: 8, color: colors.gray700, marginBottom: 2 }}>Team Size: {results.teamSize} people</Text>
                <Text style={{ fontSize: 8, fontWeight: 600, color: colors.gray900, marginTop: 4 }}>Total Team Cost: {formatCurrency(currentSituation.teamCost, c)}</Text>
              </View>
              <View style={styles.col2}>
                <Text style={{ fontSize: 9, fontWeight: 600, color: colors.navy, marginBottom: 6 }}>BSG Cost Calculation</Text>
                <Text style={{ fontSize: 8, color: colors.gray700, marginBottom: 2 }}>BSG Rate: {selectedRole ? Math.round(selectedRole.bsgRate * 100) : 80}% of salary</Text>
                <Text style={{ fontSize: 8, color: colors.gray700, marginBottom: 2 }}>Cost per Employee: {formatCurrency(withBSG.bsgCostPerEmployee, c)}</Text>
                <Text style={{ fontSize: 8, color: colors.gray700, marginBottom: 2 }}>Efficiency Guarantee: {withBSG.bsgEfficiency}%</Text>
                <Text style={{ fontSize: 8, fontWeight: 600, color: colors.gray900, marginTop: 4 }}>Total BSG Cost: {formatCurrency(withBSG.bsgTotalCost, c)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Methodology Notes */}
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            <Text style={{ fontWeight: 600 }}>Calculation Notes: </Text>
            EOS Gratuity calculated as (Salary / 365) x 21 days per UAE Labor Law. Leave Salary calculated as Salary / 12. Annual Flight Charges default 1500. Inefficiency score capped at 20% maximum. BSG efficiency guaranteed at minimum 96%. Currency: {currencies[c].name}. BSG Rate: {selectedRole ? Math.round(selectedRole.bsgRate * 100) : 80}% of salary. All overhead figures are annual costs. Savings projections based on current team structure and operational data provided.
          </Text>
        </View>

        {/* Page Number */}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Backsure Global Support | www.backsureglobalsupport.com | info@backsureglobalsupport.com
          </Text>
          <Text style={[styles.footerText, { marginTop: 3 }]}>
            Report generated on {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
