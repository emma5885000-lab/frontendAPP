import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  color: string;
  trend?: string;
  unit?: string;
}

function StatCard({ icon: Icon, value, label, color, trend, unit }: StatCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          <Icon size={24} color={color} />
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-800 mb-1">
        {value}{unit && <span className="text-lg text-gray-500">{unit}</span>}
      </div>
      <div className="text-sm text-gray-500">{label}</div>
      {trend && (
        <div className="text-xs font-semibold mt-2" style={{ color }}>
          {trend}
        </div>
      )}
    </div>
  );
}

export default StatCard;