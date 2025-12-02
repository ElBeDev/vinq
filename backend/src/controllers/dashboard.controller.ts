import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { UserRole } from '../utils/constants';

// Helper para calcular rangos de fecha
const getDateRange = (period: string) => {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setMonth(now.getMonth() - 1)); // Default: último mes
  }

  return { startDate, endDate: new Date() };
};

/**
 * @desc    Obtener estadísticas generales del dashboard
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const period = (req.query.period as string) || 'month';
    const { startDate, endDate } = getDateRange(period);

    // Por ahora retornamos stats básicas de usuarios (expandiremos con Leads, Deals, etc.)
    const totalUsers = await prisma.user.count();
    const newUsersInPeriod = await prisma.user.count({
      where: {
        createdAt: { gte: startDate, lte: endDate }
      }
    });

    // KPIs simulados (se reemplazarán con datos reales de módulos futuros)
    const stats = {
      period,
      users: {
        total: totalUsers,
        new: newUsersInPeriod,
        active: totalUsers,
      },
      leads: {
        total: 0,
        new: 0,
        converted: 0,
        conversionRate: 0,
      },
      deals: {
        total: 0,
        won: 0,
        lost: 0,
        inProgress: 0,
        totalValue: 0,
      },
      activities: {
        tasks: 0,
        calls: 0,
        meetings: 0,
        emails: 0,
      },
      revenue: {
        total: 0,
        thisMonth: 0,
        lastMonth: 0,
        growth: 0,
      },
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener KPIs específicos por rol
 * @route   GET /api/dashboard/kpis
 * @access  Private
 */
export const getKPIs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    let kpis: any = {};

    // KPIs según el rol del usuario
    if (user?.role === UserRole.ADMIN) {
      kpis = {
        totalUsers: await prisma.user.count(),
        totalLeads: 0,
        totalDeals: 0,
        totalRevenue: 0,
        systemHealth: 100,
      };
    } else if (user?.role === UserRole.MANAGER) {
      kpis = {
        teamSize: 0,
        teamLeads: 0,
        teamDeals: 0,
        teamRevenue: 0,
        teamPerformance: 0,
      };
    } else {
      // AGENT o USER
      kpis = {
        myLeads: 0,
        myDeals: 0,
        myTasks: 0,
        myRevenue: 0,
        conversionRate: 0,
      };
    }

    res.status(200).json({
      success: true,
      data: kpis,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener actividad reciente
 * @route   GET /api/dashboard/recent-activity
 * @access  Private
 */
export const getRecentActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const limit = parseInt(req.query.limit as string) || 10;

    // Por ahora retornamos actividad simulada
    const activities = [
      {
        id: '1',
        type: 'lead',
        action: 'created',
        description: 'New lead created: John Doe',
        user: user?.name,
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        icon: 'UserAddOutlined',
        color: '#1C4BDE',
      },
      {
        id: '2',
        type: 'deal',
        action: 'updated',
        description: 'Deal moved to Negotiation stage',
        user: user?.name,
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        icon: 'DollarOutlined',
        color: '#28A745',
      },
      {
        id: '3',
        type: 'task',
        action: 'completed',
        description: 'Task completed: Follow up with client',
        user: user?.name,
        timestamp: new Date(Date.now() - 1000 * 60 * 180),
        icon: 'CheckCircleOutlined',
        color: '#5C6AC4',
      },
    ];

    res.status(200).json({
      success: true,
      data: activities.slice(0, limit),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener datos para gráficas
 * @route   GET /api/dashboard/charts
 * @access  Private
 */
export const getChartData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chartType = (req.query.type as string) || 'revenue';

    // Datos simulados para gráficas
    const chartData: any = {};

    if (chartType === 'revenue') {
      chartData.revenue = [
        { month: 'Jan', value: 65000 },
        { month: 'Feb', value: 72000 },
        { month: 'Mar', value: 68000 },
        { month: 'Apr', value: 85000 },
        { month: 'May', value: 92000 },
        { month: 'Jun', value: 95000 },
      ];
    } else if (chartType === 'leads') {
      chartData.leads = [
        { status: 'New', count: 45 },
        { status: 'Contacted', count: 32 },
        { status: 'Qualified', count: 18 },
        { status: 'Converted', count: 12 },
      ];
    } else if (chartType === 'deals') {
      chartData.deals = [
        { stage: 'Prospecting', count: 15, value: 450000 },
        { stage: 'Qualification', count: 12, value: 380000 },
        { stage: 'Proposal', count: 8, value: 280000 },
        { stage: 'Negotiation', count: 5, value: 220000 },
        { stage: 'Closed Won', count: 3, value: 150000 },
      ];
    }

    res.status(200).json({
      success: true,
      data: chartData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener próximas tareas/eventos
 * @route   GET /api/dashboard/upcoming
 * @access  Private
 */
export const getUpcoming = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;

    // Datos simulados
    const upcoming = [
      {
        id: '1',
        type: 'task',
        title: 'Follow up with John Doe',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 2),
        priority: 'high',
        status: 'pending',
      },
      {
        id: '2',
        type: 'meeting',
        title: 'Property viewing with client',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 4),
        priority: 'medium',
        status: 'scheduled',
      },
      {
        id: '3',
        type: 'task',
        title: 'Send quote to prospect',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
        priority: 'low',
        status: 'pending',
      },
    ];

    res.status(200).json({
      success: true,
      data: upcoming.slice(0, limit),
    });
  } catch (error) {
    next(error);
  }
};
