"use client";

import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = "lg" // default lebih besar
}) => {
  if (!isOpen) {
    return null;
  }

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all max-h-[90vh] flex flex-col animate-modal-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Sticky */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h3 className="text-xl font-bold leading-6 text-gray-900">{title}</h3>
          <button
            type="button"
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto px-6 py-4 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;