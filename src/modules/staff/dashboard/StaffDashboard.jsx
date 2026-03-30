import { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { BarChart2, CalendarDays, CheckCircle2, Users } from "lucide-react";
Chart.register(...registerables);

// ─── TAILWIND v4 NOTE ────────────────────────────────────────────────────────
// All colors come from your @theme tokens.
// Tailwind v4 maps --color-* tokens → bg-*, text-*, border-* utilities.
//
// Token             → Tailwind class
// --color-primary   → bg-primary / text-primary / border-primary
// --color-secondary → bg-secondary / text-secondary (shadowed by text-secondary token below)
// --color-surface-card  → bg-surface-card
// --color-surface-page  → bg-surface-page
// --color-text-primary  → text-text-primary
// --color-text-secondary→ text-text-secondary
// --color-text-heading  → text-text-heading
// --color-border        → border-border
// --color-success/warning/error/info → bg-success etc.
//
// For opacity modifiers on CSS vars Tailwind v4 supports: bg-primary/10
// ─────────────────────────────────────────────────────────────────────────────

// ─── DATA ────────────────────────────────────────────────────────────────────


const SCHEDULE = [
  { time: "09:00 AM", dot: "primary", subject: "English", meta: "Mon • 45 min • Meet Link", cls: "Class 5A" },
  { time: "10:00 AM", dot: "secondary", subject: "Mathematics", meta: "Mon • 45 min • Meet Link", cls: "Class 5A" },
  { time: "09:00 AM", dot: "success", subject: "Science", meta: "Tue • 45 min • Anita Singh", cls: "Class 5A" },
  { time: "11:00 AM", dot: "warning", subject: "Social Science", meta: "Wed • 45 min • Teacher 3", cls: "Class 6A" },
  { time: "12:00 PM", dot: "info", subject: "Mathematics", meta: "Thu • 45 min • Anita Singh", cls: "Class 6A" },
];

const STUDENTS = [
  {
    initials: "AS", color: "primary",
    name: "Aman Sharma", id: "ADM001 · Male", admission: "Apr 2026", cls: "Class 6A",
    eng: { v: 69, color: "error" },
    math: { v: 78, color: "primary" },
    sci: { v: 82, color: "secondary" },
    avg: { v: "76.3", color: "success" },
    att: { label: "Present", style: "present" },
    result: { label: "Pass", style: "pass" },
  },
  {
    initials: "RG", color: "info",
    name: "Riya Gupta", id: "ADM002 · Female", admission: "Apr 2026", cls: "Class 6A",
    eng: { v: 60, color: "error" },
    math: { v: 65, color: "primary" },
    sci: { v: 70, color: "secondary" },
    avg: { v: "65.0", color: "warning" },
    att: { label: "Absent", style: "absent" },
    result: { label: "Pass", style: "pass" },
  },
  {
    initials: "ARS", color: "success",
    name: "Arjun Singh", id: "ADM003 · Male", admission: "Apr 2026", cls: "Class 6A",
    eng: null, math: null, sci: null, avg: null,
    att: { label: "Present", style: "present" },
    result: { label: "Pending", style: "pending" },
  },
  {
    initials: "NV", color: "secondary",
    name: "Neha Verma", id: "ADM004 · Female", admission: "Apr 2026", cls: "Class 7",
    eng: null, math: null, sci: null, avg: null,
    att: { label: "N/A", style: "na" },
    result: { label: "Pending", style: "pending" },
  },
];

const CLOCKIN_LOG = [
  { day: "Jul 1", display: "09:00 → 16:00 ✓", color: "success" },
  { day: "Jul 2", display: "09:10 → 12:00 ½", color: "warning" },
  { day: "Jul 3", display: "09:05 → 16:10 ✓", color: "success" },
  { day: "Jul 4", display: "Absent ✗", color: "error" },
];

// ─── CHART COLORS ─────────────────────────────────────────────────────────────
// Chart.js needs real hex values (it can't read CSS vars at draw-time).
// These must stay in sync with your @theme tokens.

const C = {
  primary: "#2563EB",
  secondary: "#F59E0B",
  success: "#16A34A",
  warning: "#F59E0B",
  error: "#DC2626",
  info: "#0284C7",
};

// ─── STAT CARD THEME ──────────────────────────────────────────────────────────
// Maps color keys → Tailwind utility strings built from your @theme tokens.



// ─── LEGEND DOT COLOR MAP ─────────────────────────────────────────────────────

const DOT_COLOR = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  info: "bg-info",
};

// ─── STATUS PILL STYLE MAP ────────────────────────────────────────────────────

const PILL_STYLE = {
  present: "bg-success/10 text-success",
  absent: "bg-error/10   text-error",
  pass: "bg-success/10 text-success",
  fail: "bg-error/10   text-error",
  pending: "bg-warning/10 text-warning",
  na: "bg-primary/10 text-primary",
};

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────

function Card({ children, className = "", style = {} }) {
  return (
    <div
      className={`bg-surface-card border border-border rounded-2xl lg:p-6 p-4 shadow-sm animate-fadeUp ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

function CardHeader({ title, action }) {
  return (
    <div className="lg:flex items-center justify-between mb-5">
      <h3 className="font-['Syne'] text-[15px] font-semibold tracking-[-0.2px] text-text-heading">
        {title}
      </h3>
      {action && (
        <span className="text-xs text-primary cursor-pointer font-medium hover:underline">
          {action}
        </span>
      )}
    </div>
  );
}

function LegendDot({ color }) {
  return (
    <span className={`w-[10px] h-[10px] rounded-full flex-shrink-0 inline-block ${DOT_COLOR[color] ?? "bg-border"}`} />
  );
}

function StatusPill({ label, style }) {
  return (
    <span className={`inline-flex px-[10px] py-[3px] rounded-full text-[11px] font-medium ${PILL_STYLE[style] ?? "bg-border text-text-secondary"}`}>
      {label}
    </span>
  );
}

function ProgressBar({ label, value, fromColor, toColor }) {
  // fromColor / toColor are keys from C{} above
  return (
    <div className="flex flex-col gap-1 mb-3 last:mb-0">
      <div className="flex justify-between text-xs">
        <span className="text-text-secondary">{label}</span>
        <span className="text-text-primary font-medium">{value}</span>
      </div>
      <div className="h-[6px] bg-surface-page rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${value}%`, background: `linear-gradient(90deg, ${C[fromColor]}, ${C[toColor]})` }}
        />
      </div>
    </div>
  );
}

function ClassBadge({ label }) {
  return (
    <span className="text-[11px] text-text-secondary bg-surface-page border border-border px-2 py-[3px] rounded-full">
      {label}
    </span>
  );
}

// ─── CHART HOOK ───────────────────────────────────────────────────────────────

function useChart(ref, config) {
  useEffect(() => {
    if (!ref.current) return;
    const chart = new Chart(ref.current, config);
    return () => chart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

// Shared tooltip style for all charts
const TOOLTIP = {
  backgroundColor: "rgba(3,7,18,0.85)",
  padding: 10,
  cornerRadius: 8,
  titleFont: { size: 12, weight: "600" },
  bodyFont: { size: 11 },
};

// ─── CHARTS ───────────────────────────────────────────────────────────────────

function AttendanceDonut() {
  const ref = useRef(null);
  useChart(ref, {
    type: "doughnut",
    data: {
      labels: ["Present", "Absent", "Leave"],
      datasets: [{
        data: [1, 1, 1],
        backgroundColor: [C.success, C.error, C.primary],
        borderColor: "#FFFFFF",
        borderWidth: 2,
        hoverOffset: 6,
      }],
    },
    options: {
      cutout: "72%",
      plugins: { legend: { display: false }, tooltip: { ...TOOLTIP, callbacks: { label: (c) => ` ${c.label}: ${c.raw}` } } },
      animation: { animateRotate: true, duration: 900 },
    },
  });
  return (
    <div className="relative w-[180px] h-[180px] flex items-center justify-center flex-shrink-0">
      <canvas ref={ref} width={180} height={180} />
      <div className="absolute text-center pointer-events-none">
        <div className="font-['Syne'] text-[28px] font-bold text-success">67%</div>
        <div className="text-[11px] text-text-secondary mt-[2px]">Present</div>
      </div>
    </div>
  );
}


const STATS = [
  { color: "primary", Icon: Users, value: "4", label: "Total Students", change: "↑ 2 new this session", up: true },
  { color: "primary", Icon: CheckCircle2, value: "67%", label: "Avg Attendance", change: "↓ 2 absent today", up: false },
  { color: "primary", Icon: BarChart2, value: "76", label: "Avg Marks (Unit Test 1)", change: "↑ Above 35 pass mark", up: true },
  { color: "primary", Icon: CalendarDays, value: "5", label: "Classes This Week", change: "↑ Mon–Thu schedule", up: true },
];

const STAT_THEME = {
  primary: { val: "text-primary", icon: "bg-primary/10", glow: "bg-primary", iconColor: "var(--color-primary)" },
  success: { val: "text-success", icon: "bg-success/10", glow: "bg-success", iconColor: "var(--color-success)" },
  secondary: { val: "text-secondary", icon: "bg-secondary/10", glow: "bg-secondary", iconColor: "var(--color-secondary)" },
  warning: { val: "text-warning", icon: "bg-warning/10", glow: "bg-warning", iconColor: "var(--color-warning)" },
  info: { val: "text-info", icon: "bg-info/10", glow: "bg-info", iconColor: "var(--color-info)" },
};


function MarksBarChart() {
  const ref = useRef(null);
  useChart(ref, {
    type: "bar",
    data: {
      labels: ["Aman Sharma", "Riya Gupta"],
      datasets: [
        { label: "English", data: [69, 60], backgroundColor: C.primary, borderRadius: 6, borderSkipped: false },
        { label: "Mathematics", data: [78, 65], backgroundColor: C.secondary, borderRadius: 6, borderSkipped: false },
        { label: "Science", data: [82, 70], backgroundColor: C.success, borderRadius: 6, borderSkipped: false },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { boxWidth: 12, padding: 14, font: { size: 12, weight: "500" }, color: "#6B7280", usePointStyle: true },
        },
        tooltip: { ...TOOLTIP, mode: "index", intersect: false },
      },
      scales: {
        x: { grid: { color: "#E5E7EB" }, ticks: { font: { size: 12 }, color: "#6B7280" } },
        y: { grid: { color: "#E5E7EB" }, min: 0, max: 100, ticks: { stepSize: 20, font: { size: 11 }, color: "#6B7280" } },
      },
      animation: { duration: 900 },
    },
  });
  return <div className="relative h-[240px]"><canvas ref={ref} /></div>;
}

function SubjectPie() {
  const ref = useRef(null);
  useChart(ref, {
    type: "pie",
    data: {
      labels: ["English", "Mathematics", "Science"],
      datasets: [{
        data: [64.5, 71.5, 76],
        backgroundColor: [C.primary, C.secondary, C.success],
        borderColor: "#FFFFFF",
        borderWidth: 2,
        hoverOffset: 8,
      }],
    },
    options: {
      plugins: { legend: { display: false }, tooltip: { ...TOOLTIP, callbacks: { label: (c) => ` ${c.label}: avg ${c.raw}` } } },
      animation: { animateRotate: true, duration: 900 },
    },
  });
  return (
    <div className="relative w-[180px] h-[180px] flex items-center justify-center flex-shrink-0">
      <canvas ref={ref} width={180} height={180} />
    </div>
  );
}

function TeacherAttDonut() {
  const ref = useRef(null);
  useChart(ref, {
    type: "doughnut",
    data: {
      labels: ["Present", "Half Day", "Absent", "Leave"],
      datasets: [{
        data: [2, 1, 1, 0],
        backgroundColor: [C.success, C.warning, C.error, C.primary],
        borderColor: "#FFFFFF",
        borderWidth: 2,
        hoverOffset: 6,
      }],
    },
    options: {
      cutout: "70%",
      plugins: { legend: { display: false }, tooltip: { ...TOOLTIP } },
      animation: { animateRotate: true, duration: 900 },
    },
  });
  return (
    <div className="relative w-[160px] h-[160px] flex items-center justify-center flex-shrink-0">
      <canvas ref={ref} width={160} height={160} />
      <div className="absolute text-center pointer-events-none">
        <div className="font-['Syne'] text-[22px] font-bold text-primary">4</div>
        <div className="text-[11px] text-text-secondary mt-[2px]">Days Logged</div>
      </div>
    </div>
  );
}

// ─── SECTION COMPONENTS ───────────────────────────────────────────────────────

function StatsRow() {
  return (
    <div className="grid lg:grid-cols-4 gap-4 mb-6">
      {STATS.map((s, i) => {
        const t = STAT_THEME[s.color];
        return (
          <div
            key={s.label}
            className="relative overflow-hidden bg-surface-card border border-border rounded-2xl p-[22px] shadow-sm transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md animate-fadeUp"
            style={{ animationDelay: `${0.05 + i * 0.05}s` }}
          >
            {/* decorative glow blob */}
            <div className={`absolute top-0 right-0 w-[90px] h-[90px] rounded-full opacity-[0.06] translate-x-[30%] -translate-y-[30%] pointer-events-none ${t.glow}`} />

            {/* top row — label left, icon right */}
            <div className="flex items-start justify-between mb-3">
              <span className="text-[12px] font-medium text-text-secondary leading-snug pr-2">
                {s.label}
              </span>
              <div className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center flex-shrink-0 ${t.icon}`}>
                <s.Icon
                  size={20}
                  strokeWidth={1.8}
                  style={{ color: t.iconColor }}
                />
              </div>
            </div>

            {/* value */}
            <div className={`font-['Syne'] text-[30px] font-bold tracking-[-1px] leading-none mb-[10px] ${t.val}`}>
              {s.value}
            </div>

            {/* change */}
            <div className={`text-[11px] font-medium ${s.up ? "text-success" : "text-error"}`}>
              {s.change}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AttendanceCard() {
  return (
    <Card style={{ animationDelay: "0.25s" }}>
      <CardHeader title="Student Attendance Overview" action="View All" />
      <div className="lg:flex gap-6 items-center">
        <AttendanceDonut />
        <div className="flex-1">
          <div className="flex flex-col gap-[10px]">
            {[
              ["success", "Present", "1 / 3"],
              ["error", "Absent", "1 / 3"],
              ["primary", "Leave", "1 / 3"],
            ].map(([c, l, v]) => (
              <div key={l} className="flex items-center gap-2 text-[13px] text-text-secondary">
                <LegendDot color={c} />
                {l}
                <span className="ml-auto font-medium text-text-primary">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-border">
            <div className="text-xs text-text-secondary mb-[10px]">Subject-wise Avg Marks</div>
            <ProgressBar label="Mathematics" value={76} fromColor="primary" toColor="secondary" />
            <ProgressBar label="Science" value={71.5} fromColor="success" toColor="primary" />
            <ProgressBar label="English" value={64.5} fromColor="warning" toColor="info" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function MarksBarCard() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <Card style={{ animationDelay: "0.3s" }}>
      <div className="lg:flex items-center justify-between mb-5">
        <h3 className="font-['Syne'] text-[15px] font-semibold tracking-[-0.2px] text-text-heading">
          Unit Test 1 — Student Marks
        </h3>
        <div className="lg:flex gap-1 bg-surface-page border border-border rounded-[10px] p-1">
          {["All Subjects", "Math", "Science"].map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-[14px] py-[7px] rounded-[7px] text-xs font-medium transition-all cursor-pointer ${activeTab === i
                ? "bg-surface-card text-text-primary shadow-sm border border-border"
                : "text-text-secondary hover:text-text-primary"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="w-auto">
        <MarksBarChart />

      </div>

    </Card>
  );
}

function ScheduleCard() {
  return (
    <Card style={{ animationDelay: "0.35s" }}>
      <CardHeader title="This Week's Schedule" action="Full Timetable" />
      <div className="flex flex-col gap-[10px]">
        {SCHEDULE.map((s) => (
          <div
            key={`${s.subject}-${s.time}-${s.cls}`}
            className="flex items-center gap-[14px] px-[14px] py-3 bg-surface-page border border-border rounded-[10px] cursor-pointer hover:border-primary/30 hover:bg-primary/[0.02] transition-all"
          >
            <span className="text-xs text-text-secondary font-medium min-w-[60px]">{s.time}</span>
            <LegendDot color={s.dot} />
            <div className="flex-1">
              <div className="text-[13px] font-medium text-text-primary">{s.subject}</div>
              <div className="text-[11px] text-text-secondary">{s.meta}</div>
            </div>
            <ClassBadge label={s.cls} />
          </div>
        ))}
      </div>
    </Card>
  );
}

function AssignmentCard() {
  return (
    <Card style={{ animationDelay: "0.4s" }}>
      <CardHeader title="Assignments" action="+ New" />
      <div className='lg:flex'>
        <div className="pb-3 border-b border-border flex gap-3 items-start">
          <div className="w-[34px] h-[34px] rounded-lg bg-primary/10 flex items-center justify-center text-base flex-shrink-0">
            📐
          </div>
          <div>
            <div className="text-[13px] font-medium text-text-primary">Math Homework 1</div>
            <div className="text-[11px] text-text-secondary mt-[3px]">Class 5 · Mathematics · Chapter 1</div>
            <div className="text-[11px] text-warning font-medium mt-[2px]">Due: Jul 5, 2026</div>
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xs text-text-secondary mb-2">Study Material Uploaded</div>
          <div className="flex gap-3 items-start pt-2">
            <div className="w-[34px] h-[34px] rounded-lg bg-secondary/10 flex items-center justify-center text-base flex-shrink-0">
              📄
            </div>
            <div>
              <div className="text-[13px] font-medium text-text-primary">Chapter 1 Notes</div>
              <div className="text-[11px] text-text-secondary mt-[3px]">Intro to Algebra · Class 5A</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function PayrollCard() {
  return (
    <Card style={{ animationDelay: "0.45s" }}>
      <CardHeader title="Payroll Snapshot" action="Details" />
      <div className="rounded-2xl p-5 text-center mb-4 bg-primary/[0.04] border border-primary/20">
        <div
          className="font-['Syne'] text-[32px] font-bold"
          style={{
            background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ₹ —
        </div>
        <div className="text-xs text-text-secondary mt-1">Net Salary (pending setup)</div>
      </div>
      {[
        ["Basic Salary", "—", "text-text-primary"],
        ["Allowance", "+—", "text-success"],
        ["Deduction", "-—", "text-error"],
      ].map(([k, v, c]) => (
        <div key={k} className="flex justify-between py-2 text-[13px] border-b border-border last:border-0">
          <span className="text-text-secondary">{k}</span>
          <span className={`font-medium ${c}`}>{v}</span>
        </div>
      ))}
      <div className="mt-3 text-xs text-text-secondary text-center">
        Salary structure not yet configured
      </div>
    </Card>
  );
}

function PerformanceTable() {
  return (
    <Card style={{ animationDelay: "0.5s", marginBottom: "24px" }}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <h3 className="font-['Syne'] text-[15px] font-semibold tracking-[-0.2px] text-text-heading">
          Student Performance — Unit Test 1
        </h3>

        <div className="flex gap-2 items-center text-sm">
          <span className="text-text-secondary">Session 2026–27</span>
          <span className="text-primary cursor-pointer font-medium hover:underline">
            Export
          </span>
        </div>
      </div>

      {/* Table wrapper (important for mobile) */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-[850px] w-full border-collapse">

          <thead>
            <tr>
              {[
                "Student",
                "Admission",
                "Class",
                "English",
                "Maths",
                "Science",
                "Avg",
                "Attendance",
                "Result",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left text-[11px] uppercase tracking-[0.8px] text-text-secondary font-semibold pb-3 border-b border-border whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {STUDENTS.map((s) => (
              <tr
                key={s.id}
                className="group hover:bg-surface-page transition-colors"
              >

                {/* Student */}
                <td className="py-3 border-b border-border group-last:border-0">
                  <div className="flex items-center gap-[10px] min-w-[180px]">
                    <div
                      className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 bg-${s.color}/10 text-${s.color}`}
                    >
                      {s.initials}
                    </div>

                    <div>
                      <div className="text-[13px] font-medium text-text-primary">
                        {s.name}
                      </div>
                      <div className="text-[11px] text-text-secondary">
                        {s.id}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Admission */}
                <td className="py-3 border-b border-border text-[13px] text-text-secondary whitespace-nowrap">
                  {s.admission}
                </td>

                {/* Class */}
                <td className="py-3 border-b border-border whitespace-nowrap">
                  <ClassBadge label={s.cls} />
                </td>

                {/* Marks */}
                {[s.eng, s.math, s.sci].map((m, i) => (
                  <td key={i} className="py-3 border-b border-border text-[13px] whitespace-nowrap">
                    {m ? (
                      <span className={`font-['Syne'] font-semibold text-${m.color}`}>
                        {m.v}
                      </span>
                    ) : (
                      <span className="text-text-secondary">—</span>
                    )}
                  </td>
                ))}

                {/* Avg */}
                <td className="py-3 border-b border-border text-[13px] whitespace-nowrap">
                  {s.avg ? (
                    <span className={`font-['Syne'] font-semibold text-${s.avg.color}`}>
                      {s.avg.v}
                    </span>
                  ) : (
                    <span className="text-text-secondary">—</span>
                  )}
                </td>

                {/* Attendance */}
                <td className="py-3 border-b border-border whitespace-nowrap">
                  <StatusPill label={s.att.label} style={s.att.style} />
                </td>

                {/* Result */}
                <td className="py-3 border-b border-border whitespace-nowrap">
                  <StatusPill label={s.result.label} style={s.result.style} />
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </Card>
  );
}

function MarksDistributionCard() {
  return (
    <Card style={{ animationDelay: "0.55s" }}>
      <CardHeader title="Marks Distribution — Subjects" action="Details" />
      <div className="lg:flex gap-5 items-center">
        <SubjectPie />
        <div className="flex-1">
          <div className="flex flex-col gap-[10px]">
            {[
              ["primary", "English (avg 64.5)", "30%"],
              ["secondary", "Mathematics (avg 71.5)", "34%"],
              ["success", "Science (avg 76)", "36%"],
            ].map(([c, l, p]) => (
              <div key={l} className="flex items-center gap-2 text-[13px] text-text-secondary">
                <LegendDot color={c} />
                {l}
                <span className="ml-auto font-medium text-text-primary">{p}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            {[
              ["82", "success", "Highest"],
              ["60", "error", "Lowest"],
              ["71", "primary", "Average"],
            ].map(([v, c, l]) => (
              <div key={l} className="flex-1 bg-surface-page border border-border rounded-[10px] p-3 text-center">
                <div className={`font-['Syne'] text-[18px] font-bold text-${c}`}>{v}</div>
                <div className="text-[10px] text-text-secondary mt-[2px] uppercase tracking-[0.5px]">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function TeacherAttendanceCard() {
  return (
    <Card style={{ animationDelay: "0.6s" }}>
      <CardHeader title="My Attendance — July 2026" action="Full Log" />
      <div className="lg:flex gap-5 items-center">
        <TeacherAttDonut />
        <div className="flex-1">
          <div className="text-xs text-text-secondary mb-3">Clock-in Log</div>
          <div className="flex flex-col gap-[7px]">
            {CLOCKIN_LOG.map((entry) => (
              <div key={entry.day} className="flex justify-between text-xs">
                <span className="text-text-secondary">{entry.day}</span>
                <span className={`text-${entry.color} font-medium`}>{entry.display}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {[
              ["success", "Present: 2"],
              ["warning", "Half: 1"],
              ["error", "Absent: 1"],
              ["primary", "Leave: 0"],
            ].map(([c, l]) => (
              <div
                key={l}
                className="flex items-center gap-2 bg-surface-page border border-border rounded-lg px-[10px] py-2 text-xs text-text-secondary"
              >
                <LegendDot color={c} />
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .animate-fadeUp { animation: fadeUp 0.45s ease both; }
      `}</style>

      <div className="font-['DM_Sans'] text-text-primary bg-surface-page px-8 py-8 min-h-screen">
        <StatsRow />

        {/* Row 1 */}
        <div className="grid lg:grid-cols-2 gap-5 mb-5">
          <AttendanceCard />
          <div className='hidden lg:flex'>
            <MarksBarCard />
          </div>
        </div>

        {/* Row 2 */}
        <div className="lg:grid gap-5 mb-5" style={{ gridTemplateColumns: "2fr 1fr" }}>
          <ScheduleCard />
          <div className="flex flex-col gap-5">
            <AssignmentCard />
            <PayrollCard />
          </div>
        </div>

        {/* Row 3 */}
        <PerformanceTable />

        {/* Row 4 */}
        <div className="grid lg:grid-cols-2 gap-5 mb-6">
          <MarksDistributionCard />
          <TeacherAttendanceCard />
        </div>
      </div>
    </>
  );
}