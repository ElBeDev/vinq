import React from 'react';
import { Card, Timeline, Empty, Space, Tag } from 'antd';
import {
  UserAddOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'lead' | 'deal' | 'task' | 'call' | 'email' | 'meeting';
  action: string;
  description: string;
  user: string;
  timestamp: Date;
  icon?: string;
  color?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  loading?: boolean;
  maxHeight?: number;
}

const getIconByType = (type: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    lead: <UserAddOutlined />,
    deal: <DollarOutlined />,
    task: <CheckCircleOutlined />,
    call: <PhoneOutlined />,
    email: <MailOutlined />,
    meeting: <CalendarOutlined />,
  };

  return iconMap[type] || <CheckCircleOutlined />;
};

const getColorByType = (type: string) => {
  const colorMap: Record<string, string> = {
    lead: '#1C4BDE',
    deal: '#28A745',
    task: '#5C6AC4',
    call: '#FFC107',
    email: '#17A2B8',
    meeting: '#DC3545',
  };

  return colorMap[type] || '#1C4BDE';
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  loading = false,
  maxHeight = 400,
}) => {
  return (
    <Card
      title={
        <Space>
          <span style={{ fontSize: '16px', fontWeight: 600 }}>Recent Activity</span>
          <Tag color="blue">{activities.length}</Tag>
        </Space>
      }
      bordered={false}
      style={{
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        borderRadius: '8px',
      }}
      bodyStyle={{
        maxHeight,
        overflowY: 'auto',
        padding: activities.length === 0 ? '40px 24px' : '24px',
      }}
      loading={loading}
    >
      {activities.length === 0 ? (
        <Empty
          description="No recent activity"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <Timeline
          items={activities.map((activity) => ({
            dot: (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: `${activity.color || getColorByType(activity.type)}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: activity.color || getColorByType(activity.type),
                  fontSize: '14px',
                }}
              >
                {getIconByType(activity.type)}
              </div>
            ),
            children: (
              <div style={{ paddingBottom: '12px' }}>
                <div style={{ marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', color: '#000', fontWeight: 500 }}>
                    {activity.description}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#6C757D' }}>
                    {activity.user}
                  </span>
                  <span style={{ color: '#E0E0E0' }}>•</span>
                  <span style={{ fontSize: '13px', color: '#6C757D' }}>
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ),
          }))}
        />
      )}
    </Card>
  );
};

export default ActivityFeed;
