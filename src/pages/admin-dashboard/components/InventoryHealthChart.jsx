import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const InventoryHealthChart = ({ data }) => {
  const getBarColor = (status) => {
    if (status === 'Critical') return '#DC2626';
    if (status === 'Warning') return '#D97706';
    return '#059669';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-elevation-sm">
      <div className="mb-6">
        <h3 className="text-lg md:text-xl font-semibold mb-2">Inventory Expiry Health</h3>
        <p className="text-sm text-muted-foreground">Blood units by expiry status across all blood groups</p>
      </div>
      
      <div className="w-full h-64 md:h-80" aria-label="Inventory Health Bar Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="bloodGroup" 
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
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />
            <Bar dataKey="healthy" name="Healthy (>7 days)" fill="#059669" radius={[4, 4, 0, 0]} />
            <Bar dataKey="warning" name="Warning (3-7 days)" fill="#D97706" radius={[4, 4, 0, 0]} />
            <Bar dataKey="critical" name="Critical (<3 days)" fill="#DC2626" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InventoryHealthChart;