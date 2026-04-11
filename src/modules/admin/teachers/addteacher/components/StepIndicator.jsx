import React from 'react'
const STEPS = [
  { id: "personal", label: "Personal", short: "01", icon: "👤" },
  { id: "professional", label: "Professional", short: "02", icon: "💼" },
  { id: "address", label: "Address", short: "03", icon: "📍" },
  { id: "salary", label: "Salary", short: "04", icon: "💰" },
  { id: "documents", label: "Documents", short: "05", icon: "📄" },
  { id: "review", label: "Review", short: "06", icon: "✓" },
];
export default function StepIndicator({ step, setStep }) {
  return (
    <div className="flex items-center justify-center mb-8 overflow-x-auto pb-1">
      {STEPS.map((s, i) => {
        const done = i < step;
        const active = i === step;
        const future = i > step;
        return (
          <React.Fragment key={s.id}>
            {i > 0 && (
              <div className={`h-px flex-1 min-w-[24px] max-w-[60px] mx-1 transition-all duration-500 ${done ? "bg-indigo-400" : "bg-slate-200"}`} />
            )}
            <button
              type="button"
              onClick={() => done && setStep(i)}
              className={`flex flex-col items-center gap-1.5 flex-shrink-0 group ${done ? "cursor-pointer" : "cursor-default"}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-700 transition-all duration-300 border-[1.5px]
                ${active ? "bg-primary border-primary text-white shadow-lg shadow-indigo-200 scale-110" : ""}
                ${done ? "bg-surface-page border-primary text-primary hover:scale-105" : ""}
                ${future ? "bg-surface-page border-slate-200 text-slate-400" : ""}
              `}>
                {done ? (
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : active ? s.icon : s.short}
              </div>
              <span className={`text-[10px] font-600 uppercase tracking-wider hidden sm:block transition-colors
                ${active ? "text-primary" : done ? "text-primary" : "text-slate-400"}`}>
                {s.label}
              </span>
            </button>
          </React.Fragment>
        );
      })}
    </div>
  )
}
