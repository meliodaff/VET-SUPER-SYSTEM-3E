import React from 'react';
import { Check, X } from 'lucide-react';

export default function SuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
   <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 sm:p-12 text-center relative animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-100 rounded-full flex items-center justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-500 rounded-full flex items-center justify-center">
              <Check className="w-12 h-12 sm:w-16 sm:h-16 text-white stroke-[3]" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 sm:mb-6 leading-tight">
          Application Submitted<br />Successfully !
        </h2>

        <p className="text-sm sm:text-base text-gray-600 mb-2">
          Thank you for apply to <span className="text-blue-600 font-semibold">FUR EVER CLINIC</span>.
        </p>
        <p className="text-sm sm:text-base text-gray-600">
          Please wait for an email update regarding your application status.
        </p>
      </div>
    </div>
  );
}