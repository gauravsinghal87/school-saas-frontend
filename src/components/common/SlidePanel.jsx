import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @prop {boolean}  open        — controls visibility
 * @prop {Function} onClose     — called on backdrop click / Escape
 * @prop {string}   title       — panel heading
 * @prop {string}   subtitle    — optional subheading
 * @prop {node}     children    — panel body content
 * @prop {string}   width       — tailwind max-w class (default "max-w-lg")
 */
export default function SlidePanel({ open, onClose, title, subtitle, children, width = "max-w-lg" }) {
    useEffect(() => {
        const handleKey = (e) => { if (e.key === "Escape") onClose(); };
        if (open) document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [open, onClose]);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Backdrop - no blur, just opacity */}
                    <motion.div
                        className="absolute inset-0 bg-black/40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={onClose}
                    />

                    {/* Panel - simple slide */}
                    <motion.div
                        className={`relative z-10 flex flex-col h-full w-full ${width} bg-white shadow-xl`}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        {/* Header - minimal */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
                            <div>
                                {title && (
                                    <h2 className="text-base font-semibold text-gray-900">{title}</h2>
                                )}
                                {subtitle && (
                                    <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                aria-label="Close"
                            >
                                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                                </svg>
                            </button>
                        </div>

                        {/* Body - simpler padding */}
                        <div className="flex-1 overflow-y-auto p-5">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}