import { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import {
  Users,
  Wallet,
  ClipboardList,
  FileText,
  UserPlus,
  PhoneCall,
  GraduationCap,
} from "lucide-react";
Chart.register(...registerables);

// ─── MOCK DATA (Staff Perspective) ────────────────────────────────────────────

const STATS = [
  {
    color: "primary",
    Icon: Users,
    value: "1,245",
    label: "Total Students",
    change: "Across all classes",
  },
  {
    color: "info",
    Icon: GraduationCap,
    value: "84",
    label: "Teaching Staff",
    change: "4 on leave today",
  },
  {
    color: "warning",
    Icon: ClipboardList,
    value: "12",
    label: "Pending Admissions",
    change: "Requires review",
  },
  {
    color: "success",
    Icon: Wallet,
    value: "₹4.2L",
    label: "Fee Collections",
    change: "This month",
  },
];

const TASKS = [
  {
    time: "09:30 AM",
    dot: "warning",
    title: "New Admission Walk-in",
    meta: "Sharma Family • Class 6",
  },
  {
    time: "11:00 AM",
    dot: "info",
    title: "Teacher Interview",
    meta: "Mathematics Dept.",
  },
  {
    time: "01:15 PM",
    dot: "primary",
    title: "Inventory Delivery",
    meta: "Stationery & Uniforms",
  },
  {
    time: "03:00 PM",
    dot: "error",
    title: "Parent Meeting",
    meta: "Transport Issue • Route 4",
  },
];

const INQUIRIES = [
  {
    id: "INQ001",
    parent: "Rakesh Verma",
    phone: "+91 9876543210",
    subject: "Class 1 Admission",
    status: "Pending",
    style: "pending",
  },
  {
    id: "INQ002",
    parent: "Sneha Iyer",
    phone: "+91 9876543211",
    subject: "Fee Enquiry",
    status: "Resolved",
    style: "success",
  },
  {
    id: "INQ003",
    parent: "Amit Patel",
    phone: "+91 9876543212",
    subject: "Transfer Certificate",
    status: "In Progress",
    style: "info",
  },
  {
    id: "INQ004",
    parent: "Pooja Singh",
    phone: "+91 9876543213",
    subject: "Class 9 Admission",
    status: "Pending",
    style: "pending",
  },
];

// ─── THEME CONFIGURATION ──────────────────────────────────────────────────────

const C = {
  primary: "#2563EB",
  secondary: "#F59E0B",
  success: "#16A34A",
  warning: "#F59E0B",
  error: "#DC2626",
  info: "#0284C7",
};

const STAT_THEME = {
  primary: {
    val: "text-primary",
    icon: "bg-primary/10",
    glow: "bg-primary",
    iconColor: "var(--color-primary)",
  },
  success: {
    val: "text-success",
    icon: "bg-success/10",
    glow: "bg-success",
    iconColor: "var(--color-success)",
  },
  warning: {
    val: "text-warning",
    icon: "bg-warning/10",
    glow: "bg-warning",
    iconColor: "var(--color-warning)",
  },
  info: {
    val: "text-info",
    icon: "bg-info/10",
    glow: "bg-info",
    iconColor: "var(--color-info)",
  },
};

const DOT_COLOR = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  info: "bg-info",
};

const PILL_STYLE = {
  success: "bg-success/10 text-success border border-success/20",
  error: "bg-error/10 text-error border border-error/20",
  pending: "bg-warning/10 text-warning border border-warning/20",
  info: "bg-info/10 text-info border border-info/20",
};

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────

function Card({ children, className = "", style = {} }) {
  return (
    <div
      className={`bg-surface-card border border-border rounded-xl lg:p-6 p-4 shadow-sm animate-fadeUp ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

function CardHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h3 className="font-['Montserrat'] text-[16px] font-bold text-text-heading">
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
    <span
      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 inline-block ${DOT_COLOR[color] ?? "bg-border"}`}
    />
  );
}

function StatusPill({ label, style }) {
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold ${PILL_STYLE[style] ?? "bg-border text-text-secondary"}`}
    >
      {label}
    </span>
  );
}

// ─── CHARTS ───────────────────────────────────────────────────────────────────

function SchoolAttendanceDonut() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const chart = new Chart(ref.current, {
      type: "doughnut",
      data: {
        labels: ["Students", "Teachers", "Staff"],
        datasets: [
          {
            data: [92, 95, 88], // Avg attendance percentages
            backgroundColor: [C.primary, C.info, C.secondary],
            borderColor: "#FFFFFF",
            borderWidth: 2,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        cutout: "75%",
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(3,7,18,0.85)",
            padding: 10,
            cornerRadius: 8,
            callbacks: { label: (c) => ` ${c.label}: ${c.raw}% Present` },
          },
        },
        animation: { animateRotate: true, duration: 800 },
      },
    });
    return () => chart.destroy();
  }, []);

  return (
    <div className="relative w-[160px] h-[160px] flex items-center justify-center flex-shrink-0 mx-auto lg:mx-0">
      <canvas ref={ref} width={160} height={160} />
      <div className="absolute text-center pointer-events-none">
        <div className="font-['Montserrat'] text-[24px] font-bold text-text-heading">
          92%
        </div>
        <div className="text-[11px] text-text-secondary mt-1">Avg Today</div>
      </div>
    </div>
  );
}

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

function StatsRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {STATS.map((s, i) => {
        const t = STAT_THEME[s.color];
        return (
          <div
            key={s.label}
            className="relative overflow-hidden bg-surface-card border border-border rounded-xl p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md animate-fadeUp"
            style={{ animationDelay: `${0.05 + i * 0.05}s` }}
          >
            <div
              className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.04] translate-x-1/3 -translate-y-1/3 pointer-events-none ${t.glow}`}
            />
            <div className="flex items-start justify-between mb-4">
              <span className="text-[13px] font-medium text-text-secondary">
                {s.label}
              </span>
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${t.icon}`}
              >
                <s.Icon
                  size={18}
                  strokeWidth={2}
                  style={{ color: t.iconColor }}
                />
              </div>
            </div>
            <div
              className={`font-['Montserrat'] text-[28px] font-bold leading-none mb-1 text-text-heading`}
            >
              {s.value}
            </div>
            <div className="text-[11px] font-medium text-text-secondary mt-2">
              {s.change}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function InquiriesTable() {
  return (
    <Card
      style={{ animationDelay: "0.2s" }}
      className="col-span-2 overflow-hidden"
    >
      <CardHeader title="Recent Front-Desk Inquiries" action="View All Logs" />
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              {["ID", "Parent/Visitor", "Contact", "Subject", "Status"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-[12px] text-text-secondary font-medium pb-3 border-b border-border whitespace-nowrap px-2"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {INQUIRIES.map((inq) => (
              <tr
                key={inq.id}
                className="hover:bg-surface-page transition-colors group"
              >
                <td className="py-3 px-2 border-b border-border text-[13px] text-text-secondary group-last:border-0">
                  {inq.id}
                </td>
                <td className="py-3 px-2 border-b border-border text-[14px] font-medium text-text-primary group-last:border-0">
                  {inq.parent}
                </td>
                <td className="py-3 px-2 border-b border-border text-[13px] text-text-secondary group-last:border-0">
                  {inq.phone}
                </td>
                <td className="py-3 px-2 border-b border-border text-[13px] text-text-primary group-last:border-0">
                  {inq.subject}
                </td>
                <td className="py-3 px-2 border-b border-border group-last:border-0">
                  <StatusPill label={inq.status} style={inq.style} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function QuickActionsCard() {
  const actions = [
    {
      icon: UserPlus,
      label: "Add Student",
      color: "text-primary",
      bg: "bg-primary/10 hover:bg-primary/20",
    },
    {
      icon: PhoneCall,
      label: "Log Call",
      color: "text-success",
      bg: "bg-success/10 hover:bg-success/20",
    },
    {
      icon: Wallet,
      label: "Collect Fee",
      color: "text-secondary",
      bg: "bg-secondary/10 hover:bg-secondary/20",
    },
    {
      icon: FileText,
      label: "Generate TC",
      color: "text-info",
      bg: "bg-info/10 hover:bg-info/20",
    },
  ];

  return (
    <Card style={{ animationDelay: "0.25s" }}>
      <CardHeader title="Quick Actions" />
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, idx) => (
          <button
            key={idx}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all cursor-pointer ${action.bg}`}
          >
            <action.icon size={22} className={action.color} />
            <span className="text-[12px] font-semibold text-text-primary">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}

function TasksCard() {
  return (
    <Card style={{ animationDelay: "0.3s" }}>
      <CardHeader title="Today's Schedule" action="Open Calendar" />
      <div className="flex flex-col gap-3">
        {TASKS.map((t) => (
          <div
            key={t.time}
            className="flex items-start gap-3 p-3 rounded-lg border border-border bg-surface-page hover:border-primary/30 transition-all cursor-pointer"
          >
            <div className="text-[12px] text-text-secondary font-medium w-[65px] pt-0.5">
              {t.time}
            </div>
            <div className="pt-1.5">
              <LegendDot color={t.dot} />
            </div>
            <div className="flex-1">
              <div className="text-[14px] font-semibold text-text-primary leading-snug">
                {t.title}
              </div>
              <div className="text-[12px] text-text-secondary mt-1">
                {t.meta}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AttendanceOverview() {
  return (
    <Card style={{ animationDelay: "0.35s" }} className="lg:col-span-2">
      <CardHeader title="Daily Attendance Overview" action="Detailed Report" />
      <div className="lg:flex gap-8 items-center justify-center lg:justify-start">
        <SchoolAttendanceDonut />
        <div className="flex-1 mt-6 lg:mt-0 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Students", val: "92%", status: "success" },
            { label: "Teachers", val: "95%", status: "info" },
            { label: "Admin Staff", val: "88%", status: "secondary" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-surface-page border border-border rounded-lg p-4 text-center"
            >
              <div className="text-[12px] text-text-secondary mb-1">
                {item.label}
              </div>
              <div className={`text-[20px] font-bold text-${item.status}`}>
                {item.val}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────

export default function StaffDashboard() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .animate-fadeUp { animation: fadeUp 0.4s ease-out forwards; }
      `}</style>

      <div className="bg-surface-page p-4 lg:p-8 min-h-screen">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-['Montserrat'] font-bold text-text-heading">
            Staff Overview
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Welcome back! Here's what is happening at the school today.
          </p>
        </div>

        {/* Stats */}
        <StatsRow />

        {/* Middle Row (Table + Actions) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <InquiriesTable />
          <QuickActionsCard />
        </div>

        {/* Bottom Row (Attendance + Tasks) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <AttendanceOverview />
          <TasksCard />
        </div>
      </div>
    </>
  );
}
