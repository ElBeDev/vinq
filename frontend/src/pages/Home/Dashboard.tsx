import { useState, useEffect } from 'react';
import { Row, Col, Space, Typography, Select, Spin, message } from 'antd';
import {
  UserAddOutlined,
  TeamOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  PhoneOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { colors } from '@/styles/theme';
import KPICard from '@/components/widgets/KPICard';
import ActivityFeed from '@/components/widgets/ActivityFeed';
import MiniChart from '@/components/widgets/MiniChart';
import dashboardService from '@/services/dashboardService';
import { useAuthStore } from '@/store/authStore';

const { Title } = Typography;

const Dashboard = () => {
  const { user } = useAuthStore();
  const [period, setPeriod] = useState<string>('month');
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [statsData, activityData, chartsData] = await Promise.all([
        dashboardService.getStats(period),
        dashboardService.getRecentActivity(10),
        dashboardService.getChartData('revenue', period),
      ]);

      setStats(statsData);
      setRecentActivity(activityData);
      setChartData(chartsData);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error al cargar el dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="Cargando dashboard..." />
      </div>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Welcome Section with Period Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ margin: 0, color: colors.textPrimary }}>
            ¡Bienvenido, {user?.email?.split('@')[0] || 'Usuario'}!
          </Title>
          <p style={{ color: colors.textSecondary, marginTop: '8px' }}>
            Aquí está un resumen de tu actividad
          </p>
        </div>
        <Select
          value={period}
          onChange={setPeriod}
          style={{ width: 150 }}
          options={[
            { label: 'Hoy', value: 'today' },
            { label: 'Esta Semana', value: 'week' },
            { label: 'Este Mes', value: 'month' },
            { label: 'Este Año', value: 'year' },
          ]}
        />
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Leads Totales"
            value={stats?.leads?.total || 0}
            icon={<UserAddOutlined />}
            color={colors.primary}
            trend={{
              value: 12,
              isPositive: true,
            }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Contactos"
            value={stats?.users?.total || 0}
            icon={<TeamOutlined />}
            color={colors.success}
            trend={{
              value: 8,
              isPositive: true,
            }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Deals Activos"
            value={stats?.deals?.inProgress || 0}
            icon={<DollarOutlined />}
            color={colors.warning}
            trend={{
              value: 5,
              isPositive: false,
            }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Tareas Pendientes"
            value={stats?.activities?.tasks || 0}
            icon={<CheckCircleOutlined />}
            color="#5C6AC4"
            trend={{
              value: 15,
              isPositive: true,
            }}
          />
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <MiniChart
            title="Ingresos Mensuales"
            type="line"
            data={chartData?.revenue || []}
            dataKey="value"
            xKey="month"
            color={colors.primary}
            height={300}
          />
        </Col>
        <Col xs={24} lg={12}>
          <MiniChart
            title="Leads por Estado"
            type="bar"
            data={[
              { status: 'Nuevo', count: 45 },
              { status: 'Contactado', count: 32 },
              { status: 'Calificado', count: 18 },
              { status: 'Convertido', count: 12 },
            ]}
            dataKey="count"
            xKey="status"
            color={colors.success}
            height={300}
          />
        </Col>
      </Row>

      {/* Activity and Upcoming */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <ActivityFeed activities={recentActivity} maxHeight={450} />
        </Col>
        <Col xs={24} lg={10}>
          <KPICard
            title="Llamadas Realizadas"
            value={stats?.activities?.calls || 0}
            icon={<PhoneOutlined />}
            color="#17A2B8"
            suffix="llamadas"
          />
          <div style={{ marginTop: 16 }}>
            <KPICard
              title="Reuniones Programadas"
              value={stats?.activities?.meetings || 0}
              icon={<CalendarOutlined />}
              color="#DC3545"
              suffix="reuniones"
            />
          </div>
        </Col>
      </Row>
    </Space>
  );
};

export default Dashboard;
