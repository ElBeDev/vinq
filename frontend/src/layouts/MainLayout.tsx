import { Layout } from 'antd';
import { ReactNode } from 'react';
import TopNavbar from '@/components/common/TopNavbar';
import Sidebar from '@/components/common/Sidebar';
import BreadcrumbNav from '@/components/common/Breadcrumb';
import { useUIStore } from '@/store/uiStore';
import { colors } from '@/styles/theme';

const { Content } = Layout;

interface MainLayoutProps {
  children: ReactNode;
  showBreadcrumb?: boolean;
}

const MainLayout = ({ children, showBreadcrumb = true }: MainLayoutProps) => {
  const { sidebarCollapsed } = useUIStore();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <TopNavbar />
      <Layout style={{ marginTop: '60px' }}>
        <Sidebar />
        <Layout
          style={{
            marginLeft: sidebarCollapsed ? '60px' : '240px',
            transition: 'margin-left 0.2s',
            background: colors.bgPage,
          }}
        >
          <Content
            style={{
              padding: '24px',
              minHeight: 'calc(100vh - 60px)',
            }}
          >
            {showBreadcrumb && <BreadcrumbNav />}
            <div
              style={{
                background: colors.bgCard,
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              }}
            >
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
