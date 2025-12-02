import { Skeleton, Card, Space } from 'antd';

interface PageSkeletonProps {
  rows?: number;
}

export const PageSkeleton = ({ rows = 4 }: PageSkeletonProps) => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Skeleton.Input active size="large" style={{ width: 200 }} />
      <Skeleton active paragraph={{ rows }} />
    </Space>
  );
};

export const CardSkeleton = () => {
  return (
    <Card>
      <Skeleton active />
    </Card>
  );
};

export const TableSkeleton = () => {
  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {[...Array(5)].map((_, index) => (
        <Skeleton key={index} active paragraph={{ rows: 1 }} />
      ))}
    </Space>
  );
};
