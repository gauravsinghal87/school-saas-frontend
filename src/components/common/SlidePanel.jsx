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

                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        className={`relative z-10 flex flex-col h-full w-full ${width} bg-surface-card shadow-2xl`}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.9 }}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-border flex-shrink-0">
                            <div>
                                {title && (
                                    <h2 className="text-lg font-bold text-text-heading leading-tight">{title}</h2>
                                )}
                                {subtitle && (
                                    <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-page transition-all duration-150 mt-0.5"
                            >
                                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                                </svg>
                            </button>
                        </div>

                        {/* Scrollable body */}
                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}