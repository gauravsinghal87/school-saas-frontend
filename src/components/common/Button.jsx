const Button = ({ children, variant = "primary", ...props }) => {
  const base = "px-5 py-2.5 rounded-xl text-sm font-semibold transition";

  const variants = {
    primary: `
      bg-[var(--color-button-primary)]
      text-[var(--color-button-primary-text)]
      hover:bg-[var(--color-button-primary-hover)]
    `,
    outline: `
      border border-[var(--color-border)]
      text-[var(--color-text-primary)]
      hover:bg-gray-50
    `
  };

  return (
    <button {...props} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  );
};

export default Button;