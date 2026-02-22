import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";









export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose} />
      

            {/* Modal Content */}
            <div
        ref={modalRef}
        className={cn(
          "relative z-50 w-full max-w-lg rounded-xl bg-white shadow-xl flex flex-col max-h-[90vh]",
          "animate-in fade-in zoom-in-95 duration-200",
          className
        )}>
        
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {title}
                    </h2>
                    <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">{children}</div>
            </div>
        </div>);

}