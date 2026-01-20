import React from 'react';
import Icon from '../../../components/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const ScalabilityMonitor = ({ data, currentLoad, maxCapacity }) => {
  const loadPercentage = (currentLoad / maxCapacity) * 100;
  
  const getLoadStatus = () => {
    if (loadPercentage >= 90) return { color: '#DC2626', status: 'Critical', icon: 'AlertTriangle' };
    if (loadPercentage >= 70) return { color: '#D97706', status: 'Warning', icon: 'AlertCircle' };
    return { color: '#059669', status: 'Healthy', icon: 'CheckCircle' };
  };

  const loadStatus = getLoadStatus();

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-elevation-sm">
      <div className="mb-6">
        <h3 className="text-lg md:text-xl font-semibold mb-2">System Scalability Monitor</h3>
        <p className="text-sm text-muted-foreground">Real-time load tracking for 10x capacity planning</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2 caption">Current Load</p>
          <div className="flex items-center gap-2">
            <h4 className="text-2xl font-semibold data-text">{currentLoad?.toLocaleString()}</h4>
            <span className="text-sm text-muted-foreground">requests/hour</span>
          </div>
        </div>

        <div className="border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2 caption">Max Capacity</p>
          <div className="flex items-center gap-2">
            <h4 className="text-2xl font-semibold data-text">{maxCapacity?.toLocaleString()}</h4>
            <span className="text-sm text-muted-foreground">requests/hour</span>
          </div>
        </div>

        <div className="border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2 caption">System Status</p>
          <div className="flex items-center gap-2">
            <Icon name={loadStatus?.icon} size={20} color={loadStatus?.color} />
            <span className="text-lg font-semibold" style={{ color: loadStatus?.color }}>
              {loadStatus?.status}
            </span>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Load Percentage</span>
          <span className="text-sm font-semibold data-text">{loadPercentage?.toFixed(1)}%</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-500"
            style={{ 
              width: `${loadPercentage}%`,
              backgroundColor: loadStatus?.color
            }}
          ></div>
        </div>
      </div>
      <div className="w-full h-64" aria-label="System Load Trend Chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              tick={{ fill: 'var(--color-foreground)', fontSize: 12 }}
              stroke="var(--color-border)"
            />
            <YAxis 
              tick={{ fill: 'var(--color-foreground)', fontSize: 12 }}
              stroke="var(--color-border)"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-card)', 
                border: '1px solid var(--color-border)',
                borderRadius: '8px'
              }}
            />
            <ReferenceLine 
              y={maxCapacity * 0.7} 
              stroke="#D97706" 
              strokeDasharray="3 3"
              label={{ value: 'Warning Threshold', fill: '#D97706', fontSize: 12 }}
            />
            <ReferenceLine 
              y={maxCapacity * 0.9} 
              stroke="#DC2626" 
              strokeDasharray="3 3"
              label={{ value: 'Critical Threshold', fill: '#DC2626', fontSize: 12 }}
            />
            <Line 
              type="monotone" 
              dataKey="load" 
              name="Request Load"
              stroke="#1E40AF" 
              strokeWidth={2}
              dot={{ fill: '#1E40AF', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScalabilityMonitor;