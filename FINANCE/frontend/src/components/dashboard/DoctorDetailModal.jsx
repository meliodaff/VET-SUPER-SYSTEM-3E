import React, { useState, useEffect } from 'react';
import { X, User, Users, FileText, TrendingUp, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { dashboardAPI } from '../../services/api';

const DoctorDetailModal = ({ isOpen, onClose, doctor }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detailData, setDetailData] = useState(null);

  useEffect(() => {
    // Reset state when modal opens/closes
    if (!isOpen) {
      setDetailData(null);
      setError('');
      setLoading(false);
      return;
    }
    
    console.log('DoctorDetailModal useEffect - isOpen:', isOpen, 'doctor:', doctor);
    
    if (!doctor) {
      console.error('Doctor object is missing');
      setError('Doctor information is missing');
      setLoading(false);
      return;
    }
    
    console.log('Doctor object:', doctor);
    console.log('Doctor employee_id:', doctor.employee_id);
    console.log('Doctor id:', doctor.id);
    
    // Try multiple possible ID fields
    const doctorId = doctor.employee_id || doctor.id || doctor.employeeId;
    console.log('Resolved doctor ID:', doctorId);
    
    if (doctorId && doctorId > 0 && !isNaN(doctorId)) {
      // Create a new doctor object with the correct ID
      const doctorWithId = { 
        ...doctor, 
        employee_id: parseInt(doctorId),
        id: parseInt(doctorId)
      };
      console.log('Doctor with ID:', doctorWithId);
      fetchDoctorDetail(doctorWithId);
    } else {
      console.error('No valid employee_id found in doctor object. Full object:', JSON.stringify(doctor, null, 2));
      setError(`Doctor ID is missing or invalid (ID: ${doctorId}). Please check the console for details.`);
      setLoading(false);
    }
  }, [isOpen, doctor]);

  const fetchDoctorDetail = async (doctorObj = null) => {
    try {
      setLoading(true);
      setError('');
      const doctorToUse = doctorObj || doctor;
      
      // Try multiple possible ID fields and ensure it's a valid number
      let employeeId = doctorToUse?.employee_id || doctorToUse?.id || doctorToUse?.employeeId;
      employeeId = parseInt(employeeId);
      
      console.log('Fetching doctor detail for employee_id:', employeeId);
      console.log('Doctor object used:', doctorToUse);
      console.log('Raw employee_id values:', {
        employee_id: doctorToUse?.employee_id,
        id: doctorToUse?.id,
        employeeId: doctorToUse?.employeeId
      });
      
      if (!employeeId || employeeId <= 0 || isNaN(employeeId)) {
        console.error('Invalid employee_id:', employeeId);
        console.error('Full doctor object:', JSON.stringify(doctorToUse, null, 2));
        setError(`Employee ID is missing or invalid (ID: ${employeeId}). Please refresh the page.`);
        setLoading(false);
        return;
      }
      
      console.log('Calling API with employee_id:', employeeId);
      const response = await dashboardAPI.getDoctorDetail(employeeId);
      console.log('Doctor detail response:', response);
      
      if (response?.data?.success) {
        console.log('Doctor detail data:', response.data.data);
        setDetailData(response.data.data);
      } else {
        const errorMsg = response?.data?.message || 'Failed to load doctor details';
        console.error('Doctor detail error:', errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error('Error fetching doctor detail:', err);
      console.error('Error details:', {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status
      });
      setError(err?.response?.data?.message || err?.message || 'Failed to load doctor details. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {doctor?.doctor?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'DR'}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{doctor?.doctor || 'Doctor Details'}</h3>
                <p className="text-sm text-gray-600">{doctor?.title || 'Veterinarian'}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-700">{error}</p>
                <button
                  onClick={fetchDoctorDetail}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            ) : detailData ? (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-blue-600 mb-1">Total Patients</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {detailData.statistics?.total_patients || 0}
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-blue-400" />
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-green-600 mb-1">Total Revenue</p>
                        <p className="text-2xl font-bold text-green-900">
                          {formatCurrency(detailData.statistics?.total_revenue || 0)}
                        </p>
                      </div>
                      <div className="h-8 w-8 flex items-center justify-center text-green-400 text-2xl font-bold">
                        ₱
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-purple-600 mb-1">Paid Invoices</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {detailData.statistics?.paid_invoices || 0}
                        </p>
                      </div>
                      <FileText className="h-8 w-8 text-purple-400" />
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-orange-600 mb-1">Avg/Patient</p>
                        <p className="text-2xl font-bold text-orange-900">
                          {formatCurrency(detailData.statistics?.avg_per_patient || 0)}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-orange-400" />
                    </div>
                  </div>
                </div>

                {/* Monthly Revenue Trend */}
                {detailData.monthly_revenue && detailData.monthly_revenue.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h4>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={detailData.monthly_revenue}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="month" 
                            stroke="#6b7280"
                            fontSize={11}
                            tickFormatter={formatMonth}
                          />
                          <YAxis 
                            stroke="#6b7280"
                            fontSize={11}
                            tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                          />
                          <Tooltip 
                            formatter={(value) => formatCurrency(value)}
                            labelFormatter={(label) => formatMonth(label)}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            dot={{ fill: '#3b82f6', r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Top Services */}
                {detailData.top_services && detailData.top_services.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Services</h4>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Times Used</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {detailData.top_services.map((service, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {service.service_name}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                {service.category}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                                {service.times_used}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                                {formatCurrency(service.total_revenue)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailModal;

