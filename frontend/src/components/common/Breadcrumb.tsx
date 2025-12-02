import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { colors } from '@/styles/theme';

interface BreadcrumbItem {
  path: string;
  label: string;
}

const routeLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/leads': 'Leads',
  '/contacts': 'Contactos',
  '/accounts': 'Cuentas',
  '/deals': 'Oportunidades',
  '/products': 'Propiedades',
  '/quotes': 'Cotizaciones',
  '/activities': 'Actividades',
  '/reports': 'Reportes',
  '/automation': 'Automatización',
  '/admin': 'Administración',
  '/profile': 'Mi Perfil',
  '/settings': 'Configuración',
};

const BreadcrumbNav = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);

  const breadcrumbItems: BreadcrumbItem[] = [
    { path: '/', label: 'Inicio' },
  ];

  let currentPath = '';
  pathSnippets.forEach((snippet) => {
    currentPath += `/${snippet}`;
    const label = routeLabels[currentPath] || snippet.charAt(0).toUpperCase() + snippet.slice(1);
    breadcrumbItems.push({
      path: currentPath,
      label,
    });
  });

  return (
    <Breadcrumb
      style={{
        marginBottom: '16px',
        fontSize: '14px',
      }}
      items={breadcrumbItems.map((item, index) => ({
        title:
          index === 0 ? (
            <Link to={item.path} style={{ color: colors.textSecondary }}>
              <HomeOutlined style={{ marginRight: '4px' }} />
              {item.label}
            </Link>
          ) : index === breadcrumbItems.length - 1 ? (
            <span style={{ color: colors.textPrimary, fontWeight: 500 }}>
              {item.label}
            </span>
          ) : (
            <Link to={item.path} style={{ color: colors.textSecondary }}>
              {item.label}
            </Link>
          ),
      }))}
    />
  );
};

export default BreadcrumbNav;
