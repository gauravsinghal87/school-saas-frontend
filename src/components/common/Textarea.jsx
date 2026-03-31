export default function TextAreaField({ label, id, placeholder, register, error, required, rows = 3 }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-text-primary">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        {...register}
        className={`
          w-full rounded-xl border bg-surface-card px-4 py-2.5 text-sm text-text-primary
          placeholder:text-text-secondary resize-none
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