import { Layout } from 'antd';
import { ReactNode } from 'react';
import { colors } from '@/styles/theme';

const { Content } = Layout;

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <Layout
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: colors.bgPage,
      }}
    >
      <Content
        style={{
          maxWidth: '450px',
          width: '100%',
          padding: '24px',
        }}
      >
        {/* Logo */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              marginBottom: '8px',
            }}
          >
            🏢
          </div>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: colors.primary,
              margin: 0,
            }}
          >
            VinQ CRM
          </h1>
          <p
            style={{
              color: colors.textSecondary,
              fontSize: '14px',
              marginTop: '8px',
            }}
          >
            Sistema de Gestión para Bienes Raíces
          </p>
        </div>

        {/* Auth Card */}
        <div
          style={{
            background: colors.bgCard,
            padding: '32px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          {children}
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '24px',
            color: colors.textSecondary,
            fontSize: '12px',
          }}
        >
          © 2025 VinQ CRM. Todos los derechos reservados.
        </div>
      </Content>
    </Layout>
  );
};

export default AuthLayout;
