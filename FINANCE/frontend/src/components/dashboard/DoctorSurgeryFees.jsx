import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const DoctorSurgeryFees = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No surgery data available</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length && payload[0] && payload[0].value != null) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">
            Surgeries: {payload[0].value}
          </p>
          <p className="text-green-600">
            Total Fees: {formatCurrency(payload[1]?.value ?? payload[0]?.payload?.total_fees ?? 0)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
          <Activity className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Doctor Surgery Fees</h3>
          <p className="text-sm text-gray-500">Real-time surgery fees based on performance & revenue</p>
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
                tickFormatter={(value) => {
                  if (value >= 1000) return `₱${(value / 1000).toFixed(0)}k`;
                  return `₱${value}`;
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="surgeries" 
                fill="#3b82f6" 
                name="Surgeries"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="total_fees" 
                fill="#f59e0b" 
                name="Total Fees"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center border border-gray-200 rounded">
            <div className="text-center text-gray-400">
              <p>No surgery data available</p>
            </div>
          </div>
        )}
      </div>

      {/* Individual Doctor Surgery Summary Cards */}
      {data && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.map((doctor, index) => {
            const avgFeePerSurgery = (doctor.surgeries || 0) > 0 
              ? (doctor.total_fees || 0) / (doctor.surgeries || 1)
              : 0;
            
            return (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="mb-3">
                  <h4 className="text-sm font-bold text-gray-900">{doctor.doctor}</h4>
                  <p className="text-xs text-gray-600 mt-1">Surgery Performance</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Surgeries:</span>
                    <span className="text-sm font-bold text-blue-600">{doctor.surgeries || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Total Fees:</span>
                    <span className="text-sm font-bold text-green-600">
                      {formatCurrency(doctor.total_fees || 0)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-600 text-center">
                      Avg: {formatCurrency(avgFeePerSurgery)}/surgery
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DoctorSurgeryFees;
