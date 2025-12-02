import { z } from 'zod';

// Enums
export const LeadStatusEnum = z.enum([
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'UNQUALIFIED',
  'CONVERTED',
  'LOST',
]);

export const LeadSourceEnum = z.enum([
  'WEBSITE',
  'REFERRAL',
  'SOCIAL_MEDIA',
  'EMAIL_CAMPAIGN',
  'PHONE_CALL',
  'TRADE_SHOW',
  'ADVERTISING',
  'OTHER',
]);

export const LeadRatingEnum = z.enum(['HOT', 'WARM', 'COLD']);

export type LeadStatus = z.infer<typeof LeadStatusEnum>;
export type LeadSource = z.infer<typeof LeadSourceEnum>;
export type LeadRating = z.infer<typeof LeadRatingEnum>;

/**
 * Schema para crear/editar un lead
 */
export const leadFormSchema = z.object({
  // Información básica (requerida)
  firstName: z
    .string({ required_error: 'El nombre es requerido' })
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .trim(),
  lastName: z
    .string({ required_error: 'El apellido es requerido' })
    .min(1, 'El apellido es requerido')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .trim(),
  email: z
    .string({ required_error: 'El email es requerido' })
    .email('Email inválido')
    .toLowerCase()
    .trim(),
  source: LeadSourceEnum,

  // Información básica (opcional)
  phone: z.string().trim().optional(),
  mobile: z.string().trim().optional(),

  // Información de la empresa
  company: z.string().max(100).trim().optional(),
  title: z.string().max(100).trim().optional(),
  industry: z.string().trim().optional(),

  // Estado y clasificación
  status: LeadStatusEnum.default('NEW'),
  rating: LeadRatingEnum.optional(),
  score: z.number().min(0).max(100).default(0).optional(),

  // Ubicación
  street: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  zipCode: z.string().trim().optional(),
  country: z.string().trim().default('México').optional(),

  // Asignación
  assignedTo: z.string().optional(),

  // Intereses y necesidades
  propertyInterest: z.array(z.string()).optional(),
  budgetMin: z.number().min(0).optional(),
  budgetMax: z.number().min(0).optional(),
  notes: z.string().max(2000).optional(),

  // Campos personalizados
  customFields: z.record(z.any()).optional(),
}).refine(
  (data) => {
    if (data.budgetMin && data.budgetMax) {
      return data.budgetMax >= data.budgetMin;
    }
    return true;
  },
  {
    message: 'El presupuesto máximo debe ser mayor o igual al mínimo',
    path: ['budgetMax'],
  }
);

export type LeadFormData = z.infer<typeof leadFormSchema>;

// Type para Lead completo (desde API)
export interface Lead {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  mobile?: string;
  company?: string;
  title?: string;
  industry?: string;
  status: LeadStatus;
  source: LeadSource;
  rating?: LeadRating;
  score?: number;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  propertyInterest?: string[];
  budgetMin?: number;
  budgetMax?: number;
  notes?: string;
  isConverted: boolean;
  convertedDate?: string;
  convertedContactId?: string;
  convertedAccountId?: string;
  convertedDealId?: string;
  customFields?: Record<string, any>;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  lastContactedDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Filtros para búsqueda de leads
export interface LeadFilters {
  page?: number;
  limit?: number;
  status?: LeadStatus;
  source?: LeadSource;
  rating?: LeadRating;
  assignedTo?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minScore?: number;
  maxScore?: number;
  minBudget?: number;
  maxBudget?: number;
}

// Respuesta paginada de leads
export interface LeadsPaginatedResponse {
  success: boolean;
  data: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Estadísticas de leads
export interface LeadStats {
  total: number;
  converted: number;
  conversionRate: string;
  byStatus: Array<{ _id: string; count: number }>;
  bySource: Array<{ _id: string; count: number }>;
  byRating: Array<{ _id: string; count: number }>;
}
