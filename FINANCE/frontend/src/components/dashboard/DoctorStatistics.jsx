import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const DoctorStatistics = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Doctor Patient Statistics</h3>
            <p className="text-sm text-gray-500">Patient load and revenue by doctor</p>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center border border-gray-200 rounded">
          <p className="text-gray-500">No doctor statistics available</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">
            Patients: {payload[0].value}
          </p>
          <p className="text-green-600">
            Revenue: {formatCurrency(payload[1].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const formatRevenue = (revenue) => {
    if (revenue >= 1000) {
      return `₱${(revenue / 1000).toFixed(0)}k`;
    }
    return formatCurrency(revenue);
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
          <Users className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Doctor Patient Statistics</h3>
        </div>
      </div>
      
      <div className="h-64 mb-6">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="doctor" 
                stroke="#6b7280"
                fontSize={11}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={11}
                yAxisId="left"
                tickFormatter={(value) => value}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={11}
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => {
                  if (value >= 1000) return `₱${(value / 1000).toFixed(0)}k`;
                  return `₱${value}`;
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                yAxisId="left"
                dataKey="patients" 
                fill="#8b5cf6" 
                name="Patients"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                yAxisId="right"
                dataKey="revenue" 
                fill="#10b981" 
                name="Revenue"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center border border-gray-200 rounded">
            <div className="text-center text-gray-400">
              <p>No data available</p>
            </div>
          </div>
        )}
      </div>

      {/* Individual Doctor Cards - Below the chart */}
      {data && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.map((doctor, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="mb-3">
                <h4 className="text-sm font-bold text-gray-900">{doctor.doctor}</h4>
                <p className="text-xs text-gray-600 mt-1">{doctor.title || 'Veterinarian'}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Patients:</span>
                  <span className="text-sm font-bold text-blue-600">{doctor.patients || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Revenue:</span>
                  <span className="text-sm font-bold text-green-600">
                    {formatRevenue(doctor.revenue || 0)}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-600 text-center">
                    Avg: {formatCurrency(doctor.avg_per_patient || 0)}/patient
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorStatistics;
