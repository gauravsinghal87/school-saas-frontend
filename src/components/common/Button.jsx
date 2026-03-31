/** Inline SVG spinner */
function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export default function SubmitButton({ loading, label = "Submit", loadingLabel = "Submitting…" }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="
        w-full flex items-center justify-center gap-2
        rounded-xl bg-button-primary hover:bg-button-primary-hover
        text-button-primary-text font-semibold text-sm
        px-6 py-3 transition-all duration-200
        disabled:opacity-60 disabled:cursor-not-allowed
        shadow-sm hover:shadow-md active:scale-[0.98]
      "
    >
      {loading ? (
        <>
          <Spinner />
          {loadingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}


