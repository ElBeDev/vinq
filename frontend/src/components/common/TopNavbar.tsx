import { Layout, Input, Badge, Avatar, Dropdown, Space } from 'antd';
import {
  SearchOutlined,
  BellOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { colors } from '@/styles/theme';

const { Header } = Layout;

const TopNavbar = () => {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Mi Perfil',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Configuración',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar Sesión',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        background: colors.navbarBg,
        borderBottom: `1px solid ${colors.navbarBorder}`,
        height: '60px',
      }}
    >
      {/* Sidebar Toggle */}
      <div
        style={{
          fontSize: '20px',
          color: colors.primary,
          cursor: 'pointer',
          marginRight: '24px',
        }}
        onClick={toggleSidebar}
      >
        {sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>

      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          marginRight: '32px',
        }}
        onClick={() => navigate('/')}
      >
        <div
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: colors.primary,
          }}
        >
          🏢 VinQ
        </div>
      </div>

      {/* Global Search */}
      <div style={{ flex: 1, maxWidth: '500px', marginRight: '32px' }}>
        <Input
          placeholder="Buscar en VinQ CRM..."
          prefix={<SearchOutlined style={{ color: colors.grayMedium }} />}
          style={{
            borderRadius: '6px',
            background: colors.grayLight,
            border: `1px solid ${colors.border}`,
          }}
          size="large"
        />
      </div>

      {/* Right Side Actions */}
      <Space size="large" style={{ marginLeft: 'auto' }}>
        {/* Help Icon */}
        <QuestionCircleOutlined
          style={{
            fontSize: '20px',
            color: colors.grayMedium,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/help')}
        />

        {/* Notifications */}
        <Badge count={3} size="small">
          <BellOutlined
            style={{
              fontSize: '20px',
              color: colors.grayMedium,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/notifications')}
          />
        </Badge>

        {/* User Menu */}
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Avatar
              size="default"
              icon={<UserOutlined />}
              style={{ background: colors.primary }}
            />
            <span style={{ color: colors.textPrimary, fontWeight: 500 }}>
              {user?.firstName || 'Usuario'}
            </span>
          </div>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default TopNavbar;
