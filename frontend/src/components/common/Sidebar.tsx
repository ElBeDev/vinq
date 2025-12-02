import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  UserAddOutlined,
  TeamOutlined,
  BankOutlined,
  DollarOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  CalendarOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUIStore } from '@/store/uiStore';
import { colors } from '@/styles/theme';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: 'Dashboard',
  },
  {
    key: '/leads',
    icon: <UserAddOutlined />,
    label: 'Leads',
  },
  {
    key: '/contacts',
    icon: <TeamOutlined />,
    label: 'Contactos',
  },
  {
    key: '/accounts',
    icon: <BankOutlined />,
    label: 'Cuentas',
  },
  {
    key: '/deals',
    icon: <DollarOutlined />,
    label: 'Oportunidades',
  },
  {
    key: '/products',
    icon: <ShoppingOutlined />,
    label: 'Propiedades',
  },
  {
    key: '/quotes',
    icon: <FileTextOutlined />,
    label: 'Cotizaciones',
  },
  {
    key: '/activities',
    icon: <CalendarOutlined />,
    label: 'Actividades',
  },
  {
    key: '/reports',
    icon: <BarChartOutlined />,
    label: 'Reportes',
  },
  {
    key: '/automation',
    icon: <ThunderboltOutlined />,
    label: 'Automatización',
  },
  {
    key: '/admin',
    icon: <SettingOutlined />,
    label: 'Administración',
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed } = useUIStore();

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={sidebarCollapsed}
      width={240}
      collapsedWidth={60}
      style={{
        position: 'fixed',
        left: 0,
        top: '60px',
        bottom: 0,
        background: colors.sidebarBg,
        borderRight: `1px solid ${colors.border}`,
        overflow: 'auto',
        zIndex: 999,
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          height: '100%',
          borderRight: 0,
          background: colors.sidebarBg,
        }}
      />
    </Sider>
  );
};

export default Sidebar;
