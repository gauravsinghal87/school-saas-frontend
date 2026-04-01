import React from 'react'

export default function Textarea({ label, error, ...props }) {
  return (
    <div>
      {label && <label className="text-xs text-[var(--color-text-secondary)]">{label}</label>}

      <textarea
        {...props}
        className="w-full p-3 rounded-xl border bg-[var(--color-surface-card)]
        border-[var(--color-border)]
        focus:border-[var(--color-primary)]
        outline-none text-sm"
      />

      {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
    </div>
  )
}
