import React from 'react';
import { Card, Statistic, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface KPICardProps {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: string;
  icon?: React.ReactNode;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  prefix,
  suffix,
  icon,
  color = '#1C4BDE',
  trend,
  loading = false,
}) => {
  return (
    <Card
      bordered={false}
      style={{
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        borderRadius: '8px',
      }}
      loading={loading}
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#6C757D', fontSize: '14px', fontWeight: 500 }}>
            {title}
          </span>
          {icon && (
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '8px',
                backgroundColor: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color,
                fontSize: '20px',
              }}
            >
              {icon}
            </div>
          )}
        </div>
        
        <Statistic
          value={value}
          prefix={prefix}
          suffix={suffix}
          valueStyle={{
            fontSize: '28px',
            fontWeight: 600,
            color: '#000',
          }}
        />

        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {trend.isPositive ? (
              <ArrowUpOutlined style={{ color: '#28A745', fontSize: '14px' }} />
            ) : (
              <ArrowDownOutlined style={{ color: '#DC3545', fontSize: '14px' }} />
            )}
            <span
              style={{
                color: trend.isPositive ? '#28A745' : '#DC3545',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              {Math.abs(trend.value)}%
            </span>
            <span style={{ color: '#6C757D', fontSize: '13px' }}>vs last period</span>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default KPICard;
