import React, { useEffect } from "react";

export default function Modal({ isOpen, onClose, children, size = "md", className = "" }) {
    // Prevent scrolling of the background when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        xl: "max-w-6xl",
        full: "max-w-[95vw]"
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">

            <div
                className="fixed inset-0 bg-transparent backdrop-blur-[2px] transition-opacity duration-300"
                onClick={onClose}
            />

            <div
                className={`
                    relative w-full bg-surface-page rounded-[24px] 
                    shadow-[0_20px_50px_rgba(0,0,0,0.1)] 
                    border border-slate-100 
                    overflow-hidden 
                    animate-in fade-in zoom-in duration-200
                    ${sizeClasses[size]} 
                    ${className}
                `}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 md:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}