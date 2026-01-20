import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AllocationEfficiencyChart = ({ data }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-elevation-sm">
      <div className="mb-6">
        <h3 className="text-lg md:text-xl font-semibold mb-2">Allocation Efficiency Trends</h3>
        <p className="text-sm text-muted-foreground">Response time and success rate over the last 7 days</p>
      </div>
      
      <div className="w-full h-64 md:h-80" aria-label="Allocation Efficiency Line Chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="day" 
              tick={{ fill: 'var(--color-foreground)', fontSize: 12 }}
              stroke="var(--color-border)"
            />
            <YAxis 
              yAxisId="left"
              tick={{ fill: 'var(--color-foreground)', fontSize: 12 }}
              stroke="var(--color-border)"
              label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: 'var(--color-foreground)' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fill: 'var(--color-foreground)', fontSize: 12 }}
              stroke="var(--color-border)"
              label={{ value: 'Success %', angle: 90, position: 'insideRight', fill: 'var(--color-foreground)' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-card)', 
                border: '1px solid var(--color-border)',
                borderRadius: '8px'
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="responseTime" 
              name="Avg Response Time (min)"
              stroke="#1E40AF" 
              strokeWidth={2}
              dot={{ fill: '#1E40AF', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="successRate" 
              name="Success Rate (%)"
              stroke="#059669" 
              strokeWidth={2}
              dot={{ fill: '#059669', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AllocationEfficiencyChart;