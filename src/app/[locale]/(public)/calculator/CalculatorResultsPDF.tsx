import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { CalculationResults, FormDataState, TeamDefinition, RoleLevelId, CurrencyCode, GoalType, MaturityLevel, TimelineOption } from "@/lib/calculator/types";
import { currencies } from "@/lib/calculator/constants";
import { goalConfigs } from "@/lib/calculator/countries";
import { calculateTaskHandover, calculateRoadmap, calculateGoalKPIs } from "@/lib/calculator/calculations";
import { getIconEmoji } from "@/lib/calculator/icons";

Font.register({
  family: "Poppins",
  fonts: [
    { src: "https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrFJA.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7V1s.ttf", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLDz8V1s.ttf", fontWeight: 700 },
  ],
});

Font.registerHyphenationCallback((word) => [word]);

const cl = {
  navy: "#062767", gold: "#b19763", white: "#ffffff",
  gray50: "#f9fafb", gray100: "#f3f4f6", gray500: "#6b7280", gray700: "#374151", gray900: "#111827",
  red600: "#dc2626", green600: "#16a34a", blue700: "#1d4ed8",
};

const s = StyleSheet.create({
  page: { paddingTop: 50, paddingBottom: 60, paddingHorizontal: 50, fontFamily: "Poppins", fontSize: 10, color: cl.gray900, backgroundColor: cl.white },
  hdr: { backgroundColor: cl.navy, padding: 16, marginBottom: 14, borderRadius: 8, flexDirection: "row", alignItems: "center" },
  hdrLogo: { width: 100, height: 28, marginRight: 12 },
  hdrText: { flex: 1 },
  hdrTitle: { fontSize: 14, fontWeight: 700, color: cl.white },
  hdrSub: { fontSize: 8, color: cl.white, marginTop: 2, opacity: 0.9 },
  sec: { marginBottom: 10, padding: 12, backgroundColor: cl.white, border: `1px solid ${cl.gray100}`, borderRadius: 6 },
  secTitle: { fontSize: 11, fontWeight: 600, color: cl.navy, marginBottom: 8 },
  row: { flexDirection: "row", marginBottom: 4 },
  col2: { flex: 1, paddingHorizontal: 3 },
  card: { padding: 8, borderRadius: 6, marginBottom: 4 },
  lbl: { fontSize: 7, color: cl.gray500, marginBottom: 2, textTransform: "uppercase" },
  val: { fontSize: 12, fontWeight: 700 },
  tblHdr: { flexDirection: "row", backgroundColor: cl.navy, padding: 6 },
  tblHdrCell: { flex: 1, color: cl.white, fontWeight: 600, fontSize: 8, textAlign: "center" },
  tblRow: { flexDirection: "row", borderBottom: `1px solid ${cl.gray100}`, padding: 5 },
  tblRowAlt: { backgroundColor: cl.gray50 },
  tblCell: { flex: 1, fontSize: 8, textAlign: "center" },
  summBox: { backgroundColor: cl.navy, padding: 10, borderRadius: 6, marginTop: 6 },
  summGrid: { flexDirection: "row", justifyContent: "space-between" },
  summItem: { flex: 1, alignItems: "center" },
  summLbl: { fontSize: 7, color: cl.white, opacity: 0.7, marginBottom: 2 },
  summVal: { fontSize: 11, fontWeight: 700, color: cl.white },
  footer: { position: "absolute", bottom: 30, left: 50, right: 50, paddingTop: 8, borderTop: `1px solid ${cl.gray100}`, textAlign: "center" },
  footerTxt: { fontSize: 7, color: cl.gray500 },
  pgNum: { position: "absolute", bottom: 30, right: 50, fontSize: 7, color: cl.gray500 },
  costRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2, borderBottom: "1px solid rgba(255,255,255,0.15)" },
  costLbl: { fontSize: 7, color: cl.white },
  costVal: { fontSize: 7, color: cl.white },
  noteBox: { backgroundColor: "#eff6ff", padding: 8, borderRadius: 4, marginTop: 6 },
  noteTxt: { fontSize: 7, color: cl.navy, lineHeight: 1.4 },
});

function fmt(amount: number, currency: CurrencyCode, locale?: string): string {
  const info = currencies[currency];
  const numLocale = locale === "de" ? "de-DE" : "en-US";
  return `${info.symbol}${amount.toLocaleString(numLocale, { maximumFractionDigits: 0 })}`;
}

interface PDFTranslations {
  analysis: string;
  keyMetrics: string;
  bsgRecommends: string;
  currentEfficiency: string;
  withBsg: string;
  saving: string;
  diagnosticFindings: string;
  high: string;
  med: string;
  ok: string;
  minPerWeek: string;
  taskHandoverMap: string;
  bsgAbsorbs: string;
  clientRetains: string;
  financialImpact: string;
  financialSummary: string;
  annualSavings: string;
  qualityInvestment: string;
  range: string;
  bsgInvestment: string;
  perEmployee: string;
  investment: string;
  savings: string;
  uplift: string;
  roi: string;
  efficiency: string;
  costBreakdown: string;
  baseSalary: string;
  trueCostPerEmployee: string;
  metric: string;
  current: string;
  withBSG: string;
  change: string;
  annualCost: string;
  hoursWasted: string;
  implementationRoadmap: string;
  savingsLabel: string;
  methodology: string;
  bsgRateNote: string;
  inefficiencyCapped: string;
  savingsRangeNote: string;
  disclaimer: string;
  reportGenerated: string;
  // Config-translated props (passed from parent since PDF can't use hooks)
  teamName: string;
  goalLabel: string;
  countryName: string;
  currencyName: string;
  staffLabel: string;
  kpiLabels: string[];
  findingTexts: Array<{ area: string; answer: string }>;
  bsgTaskNames: string[];
  clientTaskNames: string[];
  costCategoryLabels: Record<string, string>;
  phaseNames: string[];
  maturityDescription: string;
  countryMethodologyNote: string;
  efficiencyRow: string;
}

interface CalculatorResultsPDFProps {
  results: CalculationResults;
  formData: FormDataState;
  selectedTeam: TeamDefinition | undefined;
  roleId: RoleLevelId;
  translations: PDFTranslations;
  locale?: string;
  logoSrc?: string;
}

export function CalculatorResultsPDF({ results, formData, selectedTeam, translations: tr, logoSrc, locale }: CalculatorResultsPDFProps) {
  const c = formData.selectedCurrency as CurrencyCode;
  const goalCfg = goalConfigs[formData.primaryGoal as GoalType];
  const { currentSituation, withBSG, results: r, employeeCost, diagnosticResults } = results;

  const taskHandover = calculateTaskHandover(selectedTeam, diagnosticResults);
  const roadmap = calculateRoadmap(formData.teamMaturity as MaturityLevel, formData.timeline as TimelineOption, r.realSavings);
  const goalKPIs = calculateGoalKPIs(formData.primaryGoal as GoalType, results, c);

  return (
    <Document>
      {/* ─── Page 1: Goal Summary, KPIs, Diagnostics ─── */}
      <Page size="A4" style={s.page}>
        <View style={s.hdr}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={logoSrc || "/images/logo.png"} style={s.hdrLogo} />
          <View style={s.hdrText}>
            <Text style={s.hdrTitle}>{tr.teamName} — {tr.goalLabel} {tr.analysis}</Text>
            <Text style={s.hdrSub}>{formData.companyName} | {tr.countryName} | {results.teamSize} {tr.staffLabel} | {tr.currencyName}</Text>
          </View>
        </View>

        {/* Goal KPIs */}
        <View style={s.sec}>
          <Text style={s.secTitle}>{getIconEmoji(goalCfg.icon)} {tr.goalLabel} — {tr.keyMetrics}</Text>
          <View style={s.row}>
            {goalKPIs.map((kpi, i) => (
              <View key={i} style={[s.col2, { alignItems: "center" }]}>
                <View style={[s.card, { backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", alignItems: "center", width: "100%" }]}>
                  <Text style={[s.val, { color: cl.blue700 }]}>{kpi.value}</Text>
                  <Text style={[s.lbl, { marginTop: 2 }]}>{tr.kpiLabels[i] || kpi.label}</Text>
                </View>
              </View>
            ))}
          </View>
          <Text style={{ fontSize: 8, color: cl.gray700, lineHeight: 1.5, marginTop: 4 }}>
            {tr.bsgRecommends}
            {tr.currentEfficiency}
            {tr.withBsg}
            {r.isPositiveSavings ? tr.saving : ""}.
          </Text>
        </View>

        {/* Diagnostic Findings */}
        <View style={s.sec}>
          <Text style={s.secTitle}>{tr.diagnosticFindings}</Text>
          {diagnosticResults.findings.slice(0, 5).map((f, i) => {
            const isHigh = f.impactScore >= 80;
            const isMed = f.impactScore >= 50;
            const bg = isHigh ? "#fef2f2" : isMed ? "#fffbeb" : "#f0fdf4";
            const border = isHigh ? "#fecaca" : isMed ? "#fde68a" : "#bbf7d0";
            const color = isHigh ? cl.red600 : isMed ? "#92400e" : cl.green600;
            return (
              <View key={i} style={{ flexDirection: "row", padding: 6, marginBottom: 4, borderRadius: 6, backgroundColor: bg, border: `1px solid ${border}` }}>
                <View style={{ width: 40, alignItems: "center" }}>
                  <Text style={{ fontSize: 6, fontWeight: 700, color, textTransform: "uppercase" }}>{isHigh ? tr.high : isMed ? tr.med : tr.ok}</Text>
                  <Text style={{ fontSize: 10, fontWeight: 700, color }}>{f.timeWasteMinutes}</Text>
                  <Text style={{ fontSize: 5, color: cl.gray500 }}>{tr.minPerWeek}</Text>
                </View>
                <View style={{ flex: 1, paddingLeft: 6 }}>
                  <Text style={{ fontSize: 8, fontWeight: 600, color: cl.gray900 }}>{tr.findingTexts[i]?.area || f.area}</Text>
                  <Text style={{ fontSize: 7, color: cl.gray500, marginTop: 1 }}>{tr.findingTexts[i]?.answer || f.answer}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Task Handover */}
        <View style={s.sec}>
          <Text style={s.secTitle}>{tr.taskHandoverMap}</Text>
          <View style={s.row}>
            <View style={s.col2}>
              <Text style={{ fontSize: 8, fontWeight: 600, color: cl.green600, marginBottom: 4 }}>{tr.bsgAbsorbs}</Text>
              {taskHandover.bsgTasks.slice(0, 5).map((task, i) => (
                <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                  <Text style={{ fontSize: 7, color: cl.gray700 }}>{tr.bsgTaskNames[i] || task.name}</Text>
                  <Text style={{ fontSize: 7, fontWeight: 600, color: cl.green600 }}>{task.pct}%</Text>
                </View>
              ))}
            </View>
            <View style={s.col2}>
              <Text style={{ fontSize: 8, fontWeight: 600, color: cl.blue700, marginBottom: 4 }}>{tr.clientRetains}</Text>
              {taskHandover.clientTasks.slice(0, 5).map((task, i) => (
                <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                  <Text style={{ fontSize: 7, color: cl.gray700 }}>{tr.clientTaskNames[i] || task.name}</Text>
                  <Text style={{ fontSize: 7, fontWeight: 600, color: cl.blue700 }}>{task.pct}%</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <Text style={s.pgNum} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
        <View style={s.footer} fixed>
          <Text style={s.footerTxt}>Backsure Global Support | www.backsureglobalsupport.com</Text>
        </View>
      </Page>

      {/* ─── Page 2: Financial Impact & Cost Breakdown ─── */}
      <Page size="A4" style={s.page}>
        <View style={s.hdr}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={logoSrc || "/images/logo.png"} style={s.hdrLogo} />
          <View style={s.hdrText}>
            <Text style={s.hdrTitle}>{tr.financialImpact}</Text>
            <Text style={s.hdrSub}>{formData.companyName} | {tr.teamName} | {tr.countryName}</Text>
          </View>
        </View>

        {/* Financial Summary */}
        <View style={s.sec}>
          <Text style={s.secTitle}>{tr.financialSummary}</Text>
          <View style={s.row}>
            <View style={s.col2}>
              <View style={[s.card, { backgroundColor: "#f0fdf4", border: "1px solid #86efac" }]}>
                <Text style={[s.lbl, { color: cl.green600 }]}>{r.isPositiveSavings ? tr.annualSavings : tr.qualityInvestment}</Text>
                <Text style={[s.val, { color: cl.green600 }]}>{fmt(Math.abs(r.realSavings), c, locale)}</Text>
                <Text style={{ fontSize: 7, color: cl.gray500, marginTop: 2 }}>{tr.range}</Text>
              </View>
            </View>
            <View style={s.col2}>
              <View style={[s.card, { backgroundColor: "#eff6ff", border: "1px solid #93c5fd" }]}>
                <Text style={[s.lbl, { color: cl.blue700 }]}>{tr.bsgInvestment}</Text>
                <Text style={[s.val, { color: cl.blue700 }]}>{fmt(withBSG.bsgTotalCost, c, locale)}</Text>
                <Text style={{ fontSize: 7, color: cl.gray500, marginTop: 2 }}>{tr.perEmployee}</Text>
              </View>
            </View>
          </View>

          {/* ROI Strip */}
          <View style={s.summBox}>
            <View style={s.summGrid}>
              <View style={s.summItem}>
                <Text style={s.summLbl}>{tr.investment}</Text>
                <Text style={s.summVal}>{fmt(withBSG.bsgTotalCost, c, locale)}</Text>
              </View>
              <View style={s.summItem}>
                <Text style={s.summLbl}>{r.isPositiveSavings ? tr.savings : tr.uplift}</Text>
                <Text style={[s.summVal, { color: cl.gold }]}>{fmt(Math.abs(r.realSavings), c, locale)}</Text>
              </View>
              <View style={s.summItem}>
                <Text style={s.summLbl}>{tr.roi}</Text>
                <Text style={s.summVal}>{r.roi > 0 ? `${r.roi}%` : "N/A"}</Text>
              </View>
              <View style={s.summItem}>
                <Text style={s.summLbl}>{tr.efficiency}</Text>
                <Text style={s.summVal}>+{r.efficiencyGain}%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Cost Breakdown */}
        <View style={s.sec}>
          <Text style={s.secTitle}>{tr.costBreakdown}</Text>
          <View style={[s.card, { backgroundColor: cl.red600 }]}>
            <View style={s.costRow}>
              <Text style={[s.costLbl, { fontWeight: 600 }]}>{tr.baseSalary}</Text>
              <Text style={[s.costVal, { fontWeight: 600 }]}>{fmt(employeeCost.fullSalary, c, locale)}</Text>
            </View>
            {Object.entries(employeeCost.costBreakdown).map(([key, item]) => (
              <View key={key} style={s.costRow}>
                <Text style={s.costLbl}>{getIconEmoji(item.icon || '')} {tr.costCategoryLabels[key] || item.label}</Text>
                <Text style={s.costVal}>{fmt(item.value, c, locale)}</Text>
              </View>
            ))}
            <View style={[s.costRow, { borderBottom: "none", paddingTop: 4 }]}>
              <Text style={[s.costLbl, { fontWeight: 700, fontSize: 9 }]}>{tr.trueCostPerEmployee}</Text>
              <Text style={[s.costVal, { fontWeight: 700, fontSize: 9 }]}>{fmt(employeeCost.trueCost, c, locale)}</Text>
            </View>
          </View>

          {/* Comparison Table */}
          <View style={{ marginTop: 8 }}>
            <View style={s.tblHdr}>
              <Text style={[s.tblHdrCell, { textAlign: "left" }]}>{tr.metric}</Text>
              <Text style={s.tblHdrCell}>{tr.current}</Text>
              <Text style={s.tblHdrCell}>{tr.withBSG}</Text>
              <Text style={s.tblHdrCell}>{tr.change}</Text>
            </View>
            <View style={s.tblRow}>
              <Text style={[s.tblCell, { textAlign: "left", fontWeight: 600 }]}>{tr.annualCost}</Text>
              <Text style={[s.tblCell, { color: cl.red600 }]}>{fmt(currentSituation.teamCost, c, locale)}</Text>
              <Text style={[s.tblCell, { color: cl.green600 }]}>{fmt(withBSG.bsgTotalCost, c, locale)}</Text>
              <Text style={[s.tblCell, { color: r.isPositiveSavings ? cl.green600 : cl.red600 }]}>
                {r.isPositiveSavings ? `-${Math.round((r.realSavings / currentSituation.teamCost) * 100)}%` : `+${Math.round((Math.abs(r.realSavings) / currentSituation.teamCost) * 100)}%`}
              </Text>
            </View>
            <View style={[s.tblRow, s.tblRowAlt]}>
              <Text style={[s.tblCell, { textAlign: "left", fontWeight: 600 }]}>{tr.efficiencyRow}</Text>
              <Text style={[s.tblCell, { color: cl.red600 }]}>{currentSituation.currentEfficiency}%</Text>
              <Text style={[s.tblCell, { color: cl.green600 }]}>{withBSG.bsgEfficiency}%</Text>
              <Text style={[s.tblCell, { color: cl.green600 }]}>+{r.efficiencyGain}%</Text>
            </View>
            <View style={s.tblRow}>
              <Text style={[s.tblCell, { textAlign: "left", fontWeight: 600 }]}>{tr.hoursWasted}</Text>
              <Text style={[s.tblCell, { color: cl.red600 }]}>{r.hoursReclaimed}h</Text>
              <Text style={[s.tblCell, { color: cl.green600 }]}>~2h</Text>
              <Text style={[s.tblCell, { color: cl.green600 }]}>-{Math.max(0, r.hoursReclaimed - 2)}h</Text>
            </View>
          </View>
        </View>

        {/* Implementation Roadmap */}
        <View style={s.sec}>
          <Text style={s.secTitle}>{tr.implementationRoadmap}</Text>
          <Text style={{ fontSize: 7, color: cl.gray500, marginBottom: 6 }}>{tr.maturityDescription}</Text>
          <View style={s.row}>
            {roadmap.map((phase) => (
              <View key={phase.number} style={[s.col2, { alignItems: "center" }]}>
                <View style={[s.card, { backgroundColor: cl.gray50, border: `1px solid ${cl.gray100}`, alignItems: "center", width: "100%" }]}>
                  <Text style={{ fontSize: 14, fontWeight: 700, color: cl.blue700 }}>{phase.number}</Text>
                  <Text style={{ fontSize: 7, fontWeight: 600, color: cl.blue700, marginTop: 1 }}>{phase.monthRange}</Text>
                  <Text style={{ fontSize: 8, fontWeight: 600, color: cl.gray900, marginTop: 2 }}>{tr.phaseNames[phase.number - 1] || phase.name}</Text>
                  <Text style={{ fontSize: 6, color: cl.gray500, marginTop: 2 }}>{tr.savingsLabel.replace('{amount}', fmt(Math.max(0, phase.accruedSavings), c, locale))}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Methodology Notes */}
        <View style={s.noteBox}>
          <Text style={s.noteTxt}>
            <Text style={{ fontWeight: 600 }}>{tr.methodology} </Text>
            {tr.countryMethodologyNote} {tr.bsgRateNote}
            {tr.inefficiencyCapped}
            {tr.savingsRangeNote}
            {tr.disclaimer}
          </Text>
        </View>

        <Text style={s.pgNum} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
        <View style={s.footer} fixed>
          <Text style={s.footerTxt}>Backsure Global Support | www.backsureglobalsupport.com</Text>
          <Text style={[s.footerTxt, { marginTop: 2 }]}>
            {tr.reportGenerated}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
