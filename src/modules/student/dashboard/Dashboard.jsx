// StudentDashboard.jsx
import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

// ─── DATA ─────────────────────────────────────────────────────────────────────

const STUDENT = {
    name: "Aman Sharma",
    initials: "AS",
    admissionNo: "ADM001",
    gender: "Male",
    dob: "May 12, 2014",
    age: 12,
    phone: "9991110001",
    email: "aman@test.com",
    bloodGroup: "—",
    class: "Class 6A",
    section: "Section A",
    session: "2026–27",
    parent: "Rajesh Sharma",
    parentPhone: "9998887777",
    parentEmail: "rajesh@test.com",
    admissionDate: "Apr 1, 2026",
};

const SCHEDULE = [
    { time: "09:00 AM", dot: "primary", subject: "English", meta: "Mon • 45 min • Meet Link", cls: "Class 5A" },
    { time: "10:00 AM", dot: "secondary", subject: "Mathematics", meta: "Mon • 45 min • Meet Link", cls: "Class 5A" },
    { time: "09:00 AM", dot: "success", subject: "Science", meta: "Tue • 45 min • Anita Singh", cls: "Class 5A" },
    { time: "11:00 AM", dot: "warning", subject: "Social Science", meta: "Wed • 45 min • Teacher 3", cls: "Class 6A" },
    { time: "12:00 PM", dot: "info", subject: "Mathematics", meta: "Thu • 45 min • Anita Singh", cls: "Class 6A" },
];

const MARKS = [
    { subject: "English", code: "ENG", marks: 69, max: 100, pass: 35, colorVar: "var(--color-error)", chartKey: "error", icon: "📖" },
    { subject: "Mathematics", code: "MATH", marks: 78, max: 100, pass: 35, colorVar: "var(--color-primary)", chartKey: "primary", icon: "📐" },
    { subject: "Science", code: "SCI", marks: 82, max: 100, pass: 35, colorVar: "var(--color-success)", chartKey: "success", icon: "🔬" },
];

const ATTENDANCE_LOG = [
    { date: "Jul 1, 2026", day: "Wed", status: "present", label: "Present" },
    { date: "Jul 2, 2026", day: "Thu", status: "absent", label: "Absent" },
    { date: "Jul 3, 2026", day: "Fri", status: "present", label: "Present" },
];

const FEE_RECORDS = [
    { type: "Tuition Fee", amount: 5000, due: "2026-07-10", status: "paid" },
    { type: "Computer Fee", amount: 1000, due: "2026-07-10", status: "pending" },
];

const ASSIGNMENTS = [
    {
        icon: "📐", subject: "Mathematics", title: "Math Homework 1",
        desc: "Solve questions 1 to 10 from Chapter 1", due: "Jul 5, 2026", cls: "Class 5A"
    },
];

const STUDY_MATERIALS = [
    {
        icon: "📄", subject: "Mathematics", title: "Chapter 1 Notes",
        desc: "Introduction to Algebra · Class 5A"
    },
];

// ─── CHART COLOR MAP (resolved at runtime from CSS vars) ──────────────────────
// We resolve these once so Chart.js (which can't read CSS vars directly) gets hex values.
const getChartColors = () => {
    const s = getComputedStyle(document.documentElement);
    return {
        primary: s.getPropertyValue("--color-primary").trim() || "#2563EB",
        secondary: s.getPropertyValue("--color-secondary").trim() || "#F59E0B",
        success: s.getPropertyValue("--color-success").trim() || "#16A34A",
        warning: s.getPropertyValue("--color-warning").trim() || "#F59E0B",
        error: s.getPropertyValue("--color-error").trim() || "#DC2626",
        info: s.getPropertyValue("--color-info").trim() || "#0284C7",
    };
};

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────

function Card({ children, className = "", style = {} }) {
    return (
        <div
            className={`bg-surface-card border border-border rounded-2xl p-6 animate-fadeUp shadow-sm ${className}`}
            style={style}
        >
            {children}
        </div>
    );
}

function CardHeader({ title, action }) {
    return (
        <div className="flex items-center justify-between mb-5">
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
    // color is one of: primary | secondary | success | warning | error | info
    const map = {
        primary: "bg-primary",
        secondary: "bg-secondary",
        success: "bg-success",
        warning: "bg-warning",
        error: "bg-error",
        info: "bg-info",
    };
    return (
        <span className={`w-[10px] h-[10px] rounded-full flex-shrink-0 inline-block ${map[color] ?? "bg-primary"}`} />
    );
}

function StatusPill({ label, style }) {
    const map = {
        present: "bg-success/10 text-success",
        absent: "bg-error/10  text-error",
        leave: "bg-primary/10 text-primary",
        pass: "bg-success/10 text-success",
        fail: "bg-error/10  text-error",
        pending: "bg-warning/10 text-warning",
        paid: "bg-success/10 text-success",
        partial: "bg-warning/10 text-warning",
        active: "bg-success/10 text-success",
        na: "bg-primary/10 text-primary",
    };
    return (
        <span className={`inline-flex px-[10px] py-[3px] rounded-full text-[11px] font-medium ${map[style] ?? style}`}>
            {label}
        </span>
    );
}

/** Used inside the blue hero banner — white-tinted palette */
function InfoChip({ icon, label, value }) {
    return (
        <div
            className="flex items-center gap-[10px] px-4 py-[10px] rounded-xl border"
            style={{ backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)" }}
        >
            <span className="text-[15px] flex-shrink-0">{icon}</span>
            <div className="min-w-0">
                <div
                    className="text-[10px] uppercase tracking-[0.6px] font-semibold"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                >
                    {label}
                </div>
                <div className="text-[13px] font-semibold text-white truncate mt-[1px]">{value}</div>
            </div>
        </div>
    );
}

function ProgressBar({ label, value, max = 100, colorFrom, colorTo }) {
    const pct = Math.round((value / max) * 100);
    return (
        <div className="flex flex-col gap-1 mb-3 last:mb-0">
            <div className="flex justify-between text-xs">
                <span className="text-text-secondary">{label}</span>
                <span className="text-text-primary font-medium">{value}</span>
            </div>
            <div className="h-[6px] bg-sidebar-hover rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, var(${colorFrom}), var(${colorTo}))`,
                    }}
                />
            </div>
        </div>
    );
}

// ─── CHART HOOK ───────────────────────────────────────────────────────────────

function useChart(ref, buildConfig) {
    useEffect(() => {
        if (!ref.current) return;
        const chart = new Chart(ref.current, buildConfig(getChartColors()));
        return () => chart.destroy();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}

// ─── CHARTS ───────────────────────────────────────────────────────────────────

function AttendanceDonut() {
    const ref = useRef(null);
    useChart(ref, (c) => ({
        type: "doughnut",
        data: {
            labels: ["Present", "Absent", "Leave"],
            datasets: [{
                data: [2, 1, 0],
                backgroundColor: [c.success, c.error, c.primary],
                borderColor: "var(--color-surface-card)",
                borderWidth: 2,
                hoverOffset: 6,
            }],
        },
        options: {
            cutout: "72%",
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "rgba(0,0,0,0.8)",
                    padding: 10,
                    titleFont: { size: 12, weight: "600" },
                    bodyFont: { size: 11 },
                    callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw} day(s)` },
                },
            },
            animation: { animateRotate: true, duration: 900 },
        },
    }));
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

function MarksRadarChart() {
    const ref = useRef(null);
    useChart(ref, (c) => ({
        type: "radar",
        data: {
            labels: ["English", "Mathematics", "Science"],
            datasets: [{
                label: "Marks Obtained",
                data: [69, 78, 82],
                backgroundColor: `${c.primary}22`,
                borderColor: c.primary,
                borderWidth: 2,
                pointBackgroundColor: c.primary,
                pointRadius: 5,
                pointHoverRadius: 7,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "rgba(0,0,0,0.8)",
                    padding: 10,
                    titleFont: { size: 12, weight: "600" },
                    bodyFont: { size: 11 },
                },
            },
            scales: {
                r: {
                    min: 0, max: 100,
                    ticks: { stepSize: 25, font: { size: 10 }, color: "var(--color-text-secondary)", backdropColor: "transparent" },
                    grid: { color: "var(--color-border)" },
                    pointLabels: { font: { size: 12, weight: "500" }, color: "var(--color-text-secondary)" },
                },
            },
            animation: { duration: 900 },
        },
    }));
    return <div className="relative h-[240px]"><canvas ref={ref} /></div>;
}

function FeeDonut() {
    const ref = useRef(null);
    useChart(ref, (c) => ({
        type: "doughnut",
        data: {
            labels: ["Paid", "Pending"],
            datasets: [{
                data: [5000, 1000],
                backgroundColor: [c.success, c.warning],
                borderColor: "var(--color-surface-card)",
                borderWidth: 2,
                hoverOffset: 6,
            }],
        },
        options: {
            cutout: "72%",
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "rgba(0,0,0,0.8)",
                    padding: 10,
                    titleFont: { size: 12, weight: "600" },
                    bodyFont: { size: 11 },
                    callbacks: { label: (ctx) => ` ${ctx.label}: ₹${ctx.raw.toLocaleString()}` },
                },
            },
            animation: { animateRotate: true, duration: 900 },
        },
    }));
    return (
        <div className="relative w-[160px] h-[160px] flex items-center justify-center flex-shrink-0">
            <canvas ref={ref} width={160} height={160} />
            <div className="absolute text-center pointer-events-none">
                <div className="font-['Syne'] text-[18px] font-bold text-primary">₹6K</div>
                <div className="text-[10px] text-text-secondary mt-[2px]">Total Due</div>
            </div>
        </div>
    );
}

// ─── HERO PROFILE BANNER ──────────────────────────────────────────────────────

function ProfileHero() {
    return (
        <div
            className="relative overflow-hidden rounded-2xl mb-6 animate-fadeUp"
            style={{
                background: "linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary) 80%, #000) 45%, var(--color-info) 100%)",
                animationDelay: "0.05s",
            }}
        >
            {/* Decorative blobs */}
            <div className="absolute -top-12 -right-12 w-60 h-60 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.07)" }} />
            <div className="absolute top-8 right-36 w-24 h-24 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
            <div className="absolute -bottom-10 left-1/3 w-44 h-44 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.04)" }} />

            <div className="relative z-10 p-7">

                {/* ── Top row: Avatar · Name block · Session badge ── */}
                <div className="flex items-start gap-5 mb-6">

                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <div
                            className="w-[76px] h-[76px] rounded-2xl flex items-center justify-center font-['Syne'] text-[28px] font-bold text-white"
                            style={{ backgroundColor: "rgba(255,255,255,0.18)", border: "2px solid rgba(255,255,255,0.25)" }}
                        >
                            {STUDENT.initials}
                        </div>
                        <div
                            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                            style={{ backgroundColor: "var(--color-success)", borderColor: "rgba(255,255,255,0.4)" }}
                        >
                            <div className="w-2 h-2 rounded-full bg-surface-page" />
                        </div>
                    </div>

                    {/* Name + meta */}
                    <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center gap-3 flex-wrap mb-[6px]">
                            <h2 className="font-['Syne'] text-[24px] font-bold text-white tracking-[-0.4px] leading-none">
                                {STUDENT.name}
                            </h2>
                            <span className="text-[11px] font-semibold px-[10px] py-[3px] rounded-full"
                                style={{ backgroundColor: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.95)" }}>
                                Active
                            </span>
                            <span className="text-[11px] font-semibold px-[10px] py-[3px] rounded-full"
                                style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)" }}>
                                Pass Eligible
                            </span>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            {[
                                ["Adm No", STUDENT.admissionNo],
                                ["Gender", STUDENT.gender],
                                ["DOB", STUDENT.dob],
                                ["Age", `${STUDENT.age} yrs`],
                                ["Admitted", STUDENT.admissionDate],
                            ].map(([k, v]) => (
                                <span key={k} className="text-[13px]" style={{ color: "rgba(255,255,255,0.65)" }}>
                                    {k}: <span className="text-white font-medium">{v}</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Session badge */}
                    <div className="flex-shrink-0 pt-1">
                        <div
                            className="flex flex-col items-center px-5 py-3 rounded-xl"
                            style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }}
                        >
                            <span className="text-[10px] uppercase tracking-[0.6px] font-semibold"
                                style={{ color: "rgba(255,255,255,0.5)" }}>Session</span>
                            <span className="font-['Syne'] text-[18px] font-bold text-white mt-[2px]">{STUDENT.session}</span>
                            <span className="text-[11px] mt-[2px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                                {STUDENT.class} · {STUDENT.section.replace("Section ", "Sec ")}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Student info chips ── */}
                <div className="grid grid-cols-6 gap-3 mb-5">
                    <InfoChip icon="🏫" label="Class" value={STUDENT.class} />
                    <InfoChip icon="📐" label="Section" value={STUDENT.section} />
                    <InfoChip icon="🩸" label="Blood Group" value={STUDENT.bloodGroup} />
                    <InfoChip icon="📞" label="Phone" value={STUDENT.phone} />
                    <InfoChip icon="✉️" label="Email" value={STUDENT.email} />
                    <InfoChip icon="🆔" label="Aadhar" value="XXXX-1234" />
                </div>

                {/* ── Parent / Guardian ── */}
                <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                    <div className="text-[11px] font-bold uppercase tracking-[0.7px] mb-3"
                        style={{ color: "rgba(255,255,255,0.45)" }}>
                        👨‍👩‍👦&nbsp; Parent / Guardian
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <InfoChip icon="👨" label="Parent Name" value={STUDENT.parent} />
                        <InfoChip icon="📱" label="Parent Phone" value={STUDENT.parentPhone} />
                        <InfoChip icon="✉️" label="Parent Email" value={STUDENT.parentEmail} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── CARDS ────────────────────────────────────────────────────────────────────

function AttendanceCard() {
    return (
        <Card style={{ animationDelay: "0.2s" }}>
            <CardHeader title="My Attendance Overview" action="Full Log" />
            <div className="flex gap-6 items-center">
                <AttendanceDonut />
                <div className="flex-1">
                    <div className="flex flex-col gap-[10px]">
                        {[
                            ["success", "Present", "2 / 3"],
                            ["error", "Absent", "1 / 3"],
                            ["primary", "Leave", "0 / 3"],
                        ].map(([c, l, v]) => (
                            <div key={l} className="flex items-center gap-2 text-[13px] text-text-secondary">
                                <LegendDot color={c} />{l}
                                <span className="ml-auto font-medium text-text-primary">{v}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-5 pt-4 border-t border-border">
                        <div className="text-xs text-text-secondary mb-[10px]">Recent Log</div>
                        <div className="flex flex-col gap-[7px]">
                            {ATTENDANCE_LOG.map((a) => (
                                <div key={a.date} className="flex justify-between text-xs items-center">
                                    <span className="text-text-secondary">
                                        {a.date} <span className="text-[10px]">({a.day})</span>
                                    </span>
                                    <StatusPill label={a.label} style={a.status} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

function MarksRadarCard() {
    return (
        <Card style={{ animationDelay: "0.25s" }}>
            <div className="flex items-center justify-between mb-5">
                <h3 className="font-['Syne'] text-[15px] font-semibold tracking-[-0.2px] text-text-heading">
                    Unit Test 1 — My Performance
                </h3>
                <span className="text-xs text-text-secondary bg-surface-page px-3 py-[5px] rounded-full border border-border">
                    Session {STUDENT.session}
                </span>
            </div>
            <MarksRadarChart />
            <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                    ["82", "success", "Highest", "Science"],
                    ["69", "error", "Lowest", "English"],
                    ["76.3", "primary", "Average", "Overall"],
                ].map(([v, c, l, sub]) => (
                    <div key={l} className="bg-surface-page border border-border rounded-[10px] p-3 text-center">
                        <div className={`font-['Syne'] text-[18px] font-bold text-${c}`}>{v}</div>
                        <div className="text-[10px] text-text-secondary mt-[2px] uppercase tracking-[0.5px]">{l}</div>
                        <div className="text-[10px] text-text-secondary">{sub}</div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

function MarksBreakdownCard() {
    return (
        <Card style={{ animationDelay: "0.3s" }}>
            <CardHeader title="Subject-wise Marks Breakdown" action="Download Marksheet" />
            <div className="flex flex-col gap-3 mb-5">
                {MARKS.map((m) => {
                    const pct = Math.round((m.marks / m.max) * 100);
                    const passed = m.marks >= m.pass;
                    return (
                        <div key={m.subject} className="px-4 py-3 bg-surface-page border border-border rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{m.icon}</span>
                                    <div>
                                        <div className="text-[13px] font-medium text-text-primary">{m.subject}</div>
                                        <div className="text-[10px] text-text-secondary">
                                            Code: {m.code} · Pass Mark: {m.pass}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div
                                        className="font-['Syne'] text-[20px] font-bold"
                                        style={{ color: m.colorVar }}
                                    >
                                        {m.marks}
                                    </div>
                                    <StatusPill label={passed ? "Pass" : "Fail"} style={passed ? "pass" : "fail"} />
                                </div>
                            </div>
                            <div className="h-[5px] bg-surface-card rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000"
                                    style={{
                                        width: `${pct}%`,
                                        background: `linear-gradient(90deg, ${m.colorVar}, var(--color-primary))`,
                                    }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] text-text-secondary mt-1">
                                <span>{pct}% score</span>
                                <span>Max: {m.max}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div
                className="rounded-xl p-4 text-center border border-primary/20"
                style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 8%, transparent), color-mix(in srgb, var(--color-success) 8%, transparent))" }}
            >
                <div className="text-xs text-text-secondary mb-1">Overall Result — Unit Test 1</div>
                <div className="font-['Syne'] text-[26px] font-bold text-primary">76.3 / 100</div>
                <StatusPill label="Pass" style="pass" />
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
                        key={`${s.subject}-${s.time}`}
                        className="flex items-center gap-[14px] px-[14px] py-3 bg-surface-page rounded-[10px] border border-border cursor-pointer hover:border-primary/30 transition-all"
                    >
                        <span className="text-xs text-text-secondary font-medium min-w-[60px]">{s.time}</span>
                        <LegendDot color={s.dot} />
                        <div className="flex-1">
                            <div className="text-[13px] font-medium text-text-primary">{s.subject}</div>
                            <div className="text-[11px] text-text-secondary">{s.meta}</div>
                        </div>
                        <span className="text-[11px] text-primary underline cursor-pointer font-medium">Join</span>
                        <span className="text-[11px] text-text-secondary bg-surface-card px-2 py-[3px] rounded-full border border-border">
                            {s.cls}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
}

function AssignmentCard() {
    return (
        <Card style={{ animationDelay: "0.4s" }}>
            <CardHeader title="Assignments & Materials" action="View All" />
            <div className="text-xs text-text-secondary mb-3 uppercase tracking-[0.5px] font-medium">Pending</div>
            {ASSIGNMENTS.map((a) => (
                <div key={a.title} className="pb-3 border-b border-border flex gap-3 items-start mb-3">
                    <div className="w-[34px] h-[34px] rounded-lg bg-primary/10 flex items-center justify-center text-base flex-shrink-0">
                        {a.icon}
                    </div>
                    <div className="flex-1">
                        <div className="text-[13px] font-medium text-text-primary">{a.title}</div>
                        <div className="text-[11px] text-text-secondary mt-[3px]">{a.cls} · {a.subject}</div>
                        <div className="text-[11px] text-text-secondary mt-[2px]">{a.desc}</div>
                        <div className="text-[11px] text-warning font-medium mt-[2px]">Due: {a.due}</div>
                    </div>
                    <StatusPill label="Pending" style="pending" />
                </div>
            ))}
            <div className="text-xs text-text-secondary mb-3 uppercase tracking-[0.5px] font-medium">Study Materials</div>
            {STUDY_MATERIALS.map((m) => (
                <div key={m.title} className="flex gap-3 items-start">
                    <div className="w-[34px] h-[34px] rounded-lg bg-secondary/10 flex items-center justify-center text-base flex-shrink-0">
                        {m.icon}
                    </div>
                    <div>
                        <div className="text-[13px] font-medium text-text-primary">{m.title}</div>
                        <div className="text-[11px] text-text-secondary mt-[3px]">{m.desc}</div>
                        <span className="text-[11px] text-primary underline cursor-pointer font-medium mt-[2px] block">
                            Download PDF
                        </span>
                    </div>
                </div>
            ))}
        </Card>
    );
}

function FeeCard() {
    return (
        <Card style={{ animationDelay: "0.45s" }}>
            <CardHeader title="Fee Status" action="Pay Now" />
            <div className="flex gap-4 items-center mb-5">
                <FeeDonut />
                <div className="flex-1">
                    {[
                        ["success", "Paid", "₹5,000"],
                        ["warning", "Pending", "₹1,000"],
                        ["primary", "Total", "₹6,000"],
                    ].map(([c, l, v]) => (
                        <div key={l} className="flex items-center gap-2 text-[13px] text-text-secondary mb-[10px] last:mb-0">
                            <LegendDot color={c} />{l}
                            <span className="ml-auto font-medium text-text-primary">{v}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-2">
                {FEE_RECORDS.map((f) => (
                    <div key={f.type}
                        className="flex items-center justify-between px-3 py-2.5 bg-surface-page rounded-[10px] border border-border">
                        <div>
                            <div className="text-[13px] font-medium text-text-primary">{f.type}</div>
                            <div className="text-[10px] text-text-secondary mt-[2px]">Due: {f.due}</div>
                        </div>
                        <div className="text-right">
                            <div className="font-['Syne'] text-[15px] font-semibold text-text-primary">
                                ₹{f.amount.toLocaleString()}
                            </div>
                            <StatusPill label={f.status === "paid" ? "Paid" : "Pending"} style={f.status} />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

function PromotionCard() {
    return (
        <Card style={{ animationDelay: "0.5s" }}>
            <CardHeader title="Academic Progress" action="Details" />
            <div
                className="rounded-2xl p-5 mb-4 border border-primary/20"
                style={{
                    background: "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 8%, transparent), color-mix(in srgb, var(--color-secondary) 8%, transparent))",
                }}
            >
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <div className="text-xs text-text-secondary uppercase tracking-[0.5px]">Current Class</div>
                        <div className="font-['Syne'] text-[20px] font-bold text-text-heading">{STUDENT.class}</div>
                        <div className="text-xs text-text-secondary">Session {STUDENT.session}</div>
                    </div>
                    <div className="text-3xl">🎓</div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-primary/10">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-[12px] text-success font-medium">
                        Promoted from Class 5 · Session {STUDENT.session}
                    </span>
                </div>
            </div>

            <div className="text-xs text-text-secondary mb-3 uppercase tracking-[0.5px] font-medium">Promotion History</div>
            <div className="flex flex-col gap-2 mb-4">
                {[{ from: "Class 5", to: "Class 6", session: "2026–27" }].map((p) => (
                    <div key={p.session}
                        className="flex items-center justify-between px-3 py-[10px] bg-surface-page rounded-[10px] border border-border">
                        <div className="flex items-center gap-2 text-[13px] text-text-secondary">
                            <span className="text-text-primary font-medium">{p.from}</span>
                            <span>→</span>
                            <span className="text-text-primary font-medium">{p.to}</span>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] text-text-secondary">{p.session}</div>
                            <StatusPill label="Promoted" style="pass" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-4 border-t border-border">
                <ProgressBar label="English" value={69} colorFrom="--color-warning" colorTo="--color-info" />
                <ProgressBar label="Mathematics" value={78} colorFrom="--color-primary" colorTo="--color-secondary" />
                <ProgressBar label="Science" value={82} colorFrom="--color-success" colorTo="--color-primary" />
            </div>
        </Card>
    );
}

function NotificationsCard() {
    const items = [
        { icon: "📝", title: "Unit Test 1 Marks Updated", body: "Your marks for Unit Test 1 have been entered by your teacher.", time: "2 hrs ago", read: false },
        { icon: "💰", title: "Fee Payment Successful", body: "Tuition Fee of ₹5,000 received for session 2026–27.", time: "Jul 8", read: true },
        { icon: "📚", title: "New Study Material", body: "Chapter 1 Notes uploaded by Rahul Sharma for Mathematics.", time: "Jul 5", read: true },
    ];
    return (
        <Card style={{ animationDelay: "0.55s" }}>
            <CardHeader title="Notifications" action="Mark All Read" />
            <div className="flex flex-col gap-3">
                {items.map((n, i) => (
                    <div key={i}
                        className={`flex gap-3 items-start px-3 py-3 rounded-[10px] border transition-all
                            ${!n.read ? "bg-primary/5 border-primary/20" : "bg-surface-page border-border"}`}
                    >
                        <div className="w-[34px] h-[34px] rounded-lg bg-surface-card flex items-center justify-center text-base flex-shrink-0 border border-border">
                            {n.icon}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-[2px]">
                                <span className={`text-[13px] font-medium ${!n.read ? "text-text-heading" : "text-text-primary"}`}>
                                    {n.title}
                                </span>
                                {!n.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                            </div>
                            <div className="text-[11px] text-text-secondary">{n.body}</div>
                            <div className="text-[10px] text-text-secondary mt-1">{n.time}</div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function StudentDashboard() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeUp { animation: fadeUp 0.5s ease both; }
            `}</style>

            <div className="text-text-primary font-['DM_Sans'] px-8 py-8 min-h-screen bg-surface-page">

                {/* Hero Profile Banner */}
                <ProfileHero />

                {/* Row 1: Attendance + Marks Radar */}
                <div className="grid grid-cols-2 gap-5 mb-5">
                    <AttendanceCard />
                    <MarksRadarCard />
                </div>

                {/* Row 2: Marks Breakdown */}
                <div className="mb-5">
                    <MarksBreakdownCard />
                </div>

                {/* Row 3: Schedule + (Assignments · Fee stacked) */}
                <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: "2fr 1fr" }}>
                    <ScheduleCard />
                    <div className="flex flex-col gap-5">
                        <AssignmentCard />
                        <FeeCard />
                    </div>
                </div>

                {/* Row 4: Promotion + Notifications */}
                <div className="grid grid-cols-2 gap-5 mb-6">
                    <PromotionCard />
                    <NotificationsCard />
                </div>

            </div>
        </>
    );
}