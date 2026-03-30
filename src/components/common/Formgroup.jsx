import React from 'react'

export default function Formgroup(  {children, label, error, required}) {
  return (
   <div className="space-y-1">
      <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase">
        {label} {required && "*"}
      </label>

      {children}

      {error && (
        <p className="text-xs text-[var(--color-error)]">{error}</p>
      )}
    </div>
  )
}
