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

/**
 * Schema para crear un nuevo lead
 */
export const createLeadSchema = z.object({
  body: z.object({
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
    assignedTo: z.string().optional(), // MongoDB ObjectId

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
  ),
});

/**
 * Schema para actualizar un lead
 */
export const updateLeadSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).max(50).trim().optional(),
    lastName: z.string().min(1).max(50).trim().optional(),
    email: z.string().email().toLowerCase().trim().optional(),
    phone: z.string().trim().optional(),
    mobile: z.string().trim().optional(),
    company: z.string().max(100).trim().optional(),
    title: z.string().max(100).trim().optional(),
    industry: z.string().trim().optional(),
    status: LeadStatusEnum.optional(),
    source: LeadSourceEnum.optional(),
    rating: LeadRatingEnum.optional(),
    score: z.number().min(0).max(100).optional(),
    street: z.string().trim().optional(),
    city: z.string().trim().optional(),
    state: z.string().trim().optional(),
    zipCode: z.string().trim().optional(),
    country: z.string().trim().optional(),
    assignedTo: z.string().optional(),
    propertyInterest: z.array(z.string()).optional(),
    budgetMin: z.number().min(0).optional(),
    budgetMax: z.number().min(0).optional(),
    notes: z.string().max(2000).optional(),
    customFields: z.record(z.any()).optional(),
    lastContactedDate: z.string().datetime().optional(),
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
  ),
  params: z.object({
    id: z.string().min(1, 'ID del lead requerido'),
  }),
});

/**
 * Schema para conversión de lead
 */
export const convertLeadSchema = z.object({
  body: z.object({
    createContact: z.boolean().default(true),
    createAccount: z.boolean().default(false),
    createDeal: z.boolean().default(false),
    dealAmount: z.number().min(0).optional(),
    dealStage: z.string().optional(),
    dealCloseDate: z.string().datetime().optional(),
    accountName: z.string().optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'ID del lead requerido'),
  }),
});

/**
 * Schema para asignación de lead
 */
export const assignLeadSchema = z.object({
  body: z.object({
    assignedTo: z.string().min(1, 'ID del usuario requerido'),
  }),
  params: z.object({
    id: z.string().min(1, 'ID del lead requerido'),
  }),
});

/**
 * Schema para obtener lead por ID
 */
export const getLeadSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'ID del lead requerido'),
  }),
});

/**
 * Schema para query params de búsqueda/filtros
 */
export const getLeadsQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
    status: z.string().optional(),
    source: z.string().optional(),
    rating: z.string().optional(),
    assignedTo: z.string().optional(),
    search: z.string().optional(),
    sortBy: z.string().optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    minScore: z.string().optional(),
    maxScore: z.string().optional(),
    minBudget: z.string().optional(),
    maxBudget: z.string().optional(),
  }),
});

// Type exports
export type CreateLeadInput = z.infer<typeof createLeadSchema>['body'];
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>['body'];
export type ConvertLeadInput = z.infer<typeof convertLeadSchema>['body'];
export type AssignLeadInput = z.infer<typeof assignLeadSchema>['body'];
export type GetLeadsQuery = z.infer<typeof getLeadsQuerySchema>['query'];
