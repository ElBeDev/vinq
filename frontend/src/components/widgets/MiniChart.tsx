import React from 'react';
import { Card } from 'antd';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface MiniChartProps {
  title?: string;
  type: 'line' | 'bar' | 'pie';
  data: any[];
  dataKey: string;
  xKey?: string;
  color?: string;
  colors?: string[];
  height?: number;
  loading?: boolean;
  showLegend?: boolean;
}

const ZOHO_COLORS = ['#1C4BDE', '#5C6AC4', '#28A745', '#FFC107', '#DC3545', '#17A2B8'];

const MiniChart: React.FC<MiniChartProps> = ({
  title,
  type,
  data,
  dataKey,
  xKey = 'name',
  color = '#1C4BDE',
  colors = ZOHO_COLORS,
  height = 250,
  loading = false,
  showLegend = true,
}) => {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis
                dataKey={xKey}
                stroke="#6C757D"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#6C757D" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              />
              {showLegend && <Legend />}
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis
                dataKey={xKey}
                stroke="#6C757D"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#6C757D" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              />
              {showLegend && <Legend />}
              <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                dataKey={dataKey}
                nameKey={xKey}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              />
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card
      title={title}
      bordered={false}
      style={{
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        borderRadius: '8px',
      }}
      loading={loading}
    >
      {renderChart()}
    </Card>
  );
};

export default MiniChart;
