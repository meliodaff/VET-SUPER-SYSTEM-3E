import { Check, X } from 'lucide-react';

export default function LeaveRequestModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={40} className="text-blue-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Leave Request Submitted!
        </h2>
        
        <p className="text-gray-600 mb-6">
          Please wait for an email confirmation once your request is reviewed.
        </p>
        
        <button
          onClick={onClose}
          className="px-8 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
}