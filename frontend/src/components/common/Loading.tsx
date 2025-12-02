import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { colors } from '@/styles/theme';

interface LoadingProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
  fullScreen?: boolean;
}

const Loading = ({ size = 'large', tip, fullScreen = false }: LoadingProps) => {
  const spinIcon = <LoadingOutlined style={{ fontSize: size === 'large' ? 48 : 24 }} spin />;

  if (fullScreen) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: colors.bgPage,
        }}
      >
        <Spin indicator={spinIcon} size={size} tip={tip} />
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
      }}
    >
      <Spin indicator={spinIcon} size={size} tip={tip} />
    </div>
  );
};

export default Loading;
