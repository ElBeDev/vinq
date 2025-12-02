import api from './api';

interface DashboardStats {
  period: string;
  users: {
    total: number;
    new: number;
    active: number;
  };
  leads: {
    total: number;
    new: number;
    converted: number;
    conversionRate: number;
  };
  deals: {
    total: number;
    won: number;
    lost: number;
    inProgress: number;
    totalValue: number;
  };
  activities: {
    tasks: number;
    calls: number;
    meetings: number;
    emails: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
}

interface KPIs {
  [key: string]: any;
}

interface Activity {
  id: string;
  type: string;
  action: string;
  description: string;
  user: string;
  timestamp: Date;
  icon?: string;
  color?: string;
}

interface ChartData {
  [key: string]: any[];
}

interface UpcomingItem {
  id: string;
  type: string;
  title: string;
  dueDate: Date;
  priority: string;
  status: string;
}

const dashboardService = {
  /**
   * Obtener estadísticas generales del dashboard
   * @param period - 'today' | 'week' | 'month' | 'year'
   */
  async getStats(period: string = 'month'): Promise<DashboardStats> {
    const response = await api.get(`/dashboard/stats?period=${period}`);
    return response.data.data;
  },

  /**
   * Obtener KPIs por rol
   * @param period - 'today' | 'week' | 'month' | 'year'
   */
  async getKPIs(period: string = 'month'): Promise<KPIs> {
    const response = await api.get(`/dashboard/kpis?period=${period}`);
    return response.data.data;
  },

  /**
   * Obtener actividad reciente
   * @param limit - Número de actividades a obtener
   */
  async getRecentActivity(limit: number = 10): Promise<Activity[]> {
    const response = await api.get(`/dashboard/recent-activity?limit=${limit}`);
    return response.data.data;
  },

  /**
   * Obtener datos para gráficas
   * @param type - 'revenue' | 'leads' | 'deals'
   * @param period - 'today' | 'week' | 'month' | 'year'
   */
  async getChartData(type: string = 'revenue', period: string = 'month'): Promise<ChartData> {
    const response = await api.get(`/dashboard/charts?type=${type}&period=${period}`);
    return response.data.data;
  },

  /**
   * Obtener próximas tareas/eventos
   * @param limit - Número de items a obtener
   */
  async getUpcoming(limit: number = 5): Promise<UpcomingItem[]> {
    const response = await api.get(`/dashboard/upcoming?limit=${limit}`);
    return response.data.data;
  },
};

export default dashboardService;
