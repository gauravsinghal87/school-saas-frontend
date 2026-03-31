import React from 'react'

export default function InputField({ label, id, type = "text", placeholder, register, error, required }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-semibold text-text-primary">
                {label}
                {required && <span className="text-error ml-0.5">*</span>}
            </label>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                autoComplete="off"
                {...register}
                className={`
          w-full rounded-xl border bg-surface-card px-4 py-2.5 text-sm text-text-primary
          placeholder:text-text-secondary
          outline-none transition-all duration-200
          focus:ring-2 focus:ring-primary/30 focus:border-primary
          ${error ? "border-error focus:ring-error/30 focus:border-error" : "border-border"}
        `}
            />
            {error && (
                <p className="flex items-center gap-1 text-xs text-error font-medium">
                    <span>⚠</span> {error.message}
                </p>
            )}
        </div>
    );
}

