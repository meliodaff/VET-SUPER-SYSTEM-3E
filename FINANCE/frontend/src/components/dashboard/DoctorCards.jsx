import React, { useState } from 'react';
import { User } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import DoctorDetailModal from './DoctorDetailModal';

const DoctorCards = ({ data }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <p className="text-gray-500 text-center">No doctor data available</p>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return 'DR';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (index) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-orange-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500'
    ];
    return colors[index % colors.length];
  };

  const formatRevenue = (revenue) => {
    if (revenue >= 1000) {
      return `₱${(revenue / 1000).toFixed(0)}k`;
    }
    return formatCurrency(revenue);
  };

  const handleCardClick = (doctor) => {
    console.log('Doctor card clicked:', doctor);
    console.log('Doctor employee_id:', doctor.employee_id);
    console.log('Doctor id:', doctor.id);
    
    // Ensure employee_id exists before opening modal
    const employeeId = doctor.employee_id || doctor.id || doctor.employeeId;
    
    if (!employeeId || employeeId <= 0) {
      console.error('Cannot open modal: employee_id is missing or invalid', doctor);
      alert('Error: Doctor ID is missing. Please refresh the page and try again.');
      return;
    }
    
    // Create a normalized doctor object with guaranteed employee_id
    const normalizedDoctor = {
      ...doctor,
      employee_id: employeeId,
      id: employeeId // Also include as id for compatibility
    };
    
    console.log('Normalized doctor object:', normalizedDoctor);
    setSelectedDoctor(normalizedDoctor);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((doctor, index) => (
          <div
            key={doctor.employee_id || index}
            onClick={() => handleCardClick(doctor)}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${getAvatarColor(index)} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                {getInitials(doctor.doctor)}
              </div>
              <div className="text-right flex-1 ml-3">
                <h4 className="text-sm font-bold text-gray-900">{doctor.doctor}</h4>
                <p className="text-xs text-gray-600 mt-1">{doctor.title || 'Veterinarian'}</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-2xl font-bold text-blue-600">{doctor.patients || 0}</p>
                <p className="text-xs text-gray-600 mt-1">Patients</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {formatRevenue(doctor.revenue || 0)}
                </p>
                <p className="text-xs text-gray-600 mt-1">Revenue</p>
              </div>
            </div>

            {/* Average */}
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600 text-center">
                Avg: {formatCurrency(doctor.avg_per_patient || 0)}/patient
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Doctor Detail Modal */}
      {selectedDoctor && (
        <DoctorDetailModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDoctor(null);
          }}
          doctor={selectedDoctor}
        />
      )}
    </>
  );
};

export default DoctorCards;

