import React from 'react'

export default function Textarea({ label, error, ...props }) {
  return (
    <div>
      {label && <label className="text-xs text-text-secondary">{label}</label>}

      <textarea
        {...props}
        className="w-full p-3 rounded-xl border bg-surface-card
        border-border text-text-body transition-colors text-text-heading
        focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none
        outline-none text-sm"
      />

      {error && <p className="text-xs  text-error">{error}</p>}
    </div>
  )
}
