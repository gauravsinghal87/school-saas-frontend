import React from 'react'

export default function Card({children}) {
  return (
    <div className="bg-[var(--color-surface-card)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm">
      {children}
    </div>
  )
}
