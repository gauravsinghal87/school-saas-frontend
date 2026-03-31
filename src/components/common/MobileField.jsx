export default MobileField({ label, id, register, error, required }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-semibold text-text-primary">
                {label}
                {required && <span className="text-error ml-0.5">*</span>}
            </label>
            <div className="flex">
                {/* Country code prefix */}
                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-border bg-surface-page text-text-secondary text-sm font-medium select-none">
                    🇮🇳 +91
                </span>
                <input
                    id={id}
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    {...register}
                    className={`
            flex-1 rounded-r-xl border bg-surface-card px-4 py-2.5 text-sm text-text-primary
            placeholder:text-text-secondary
            outline-none transition-all duration-200
            focus:ring-2 focus:ring-primary/30 focus:border-primary
            ${error ? "border-error focus:ring-error/30 focus:border-error" : "border-border"}
          `}
                />
            </div>
            {error && (
                <p className="flex items-center gap-1 text-xs text-error font-medium">
                    <span>⚠</span> {error.message}
                </p>
            )}
        </div>
    );
}
