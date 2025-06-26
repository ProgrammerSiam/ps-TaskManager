import React from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded shadow-lg p-6 min-w-[300px] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
          aria-label="Close"
        >
          ×
        </button>
        {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
