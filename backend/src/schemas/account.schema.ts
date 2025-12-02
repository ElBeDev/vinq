import { z } from 'zod';

// Enums
export const AccountTypeEnum = z.enum([
  'Customer',
  'Prospect',
  'Partner',
  'Reseller',
  'Vendor',
  'Competitor',
  'Other',
]);

export const AccountIndustryEnum = z.enum([
  'Real Estate',
  'Construction',
  'Finance',
  'Technology',
  'Retail',
  'Manufacturing',
  'Healthcare',
  'Education',
  'Hospitality',
  'Other',
]);

export const AccountSizeEnum = z.enum([
  'Small (1-50)',
  'Medium (51-200)',
  'Large (201-1000)',
  'Enterprise (1000+)',
]);

// Address schema
const addressSchema = z.object({
  street: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  zip: z.string().trim().optional(),
  country: z.string().trim().optional(),
});

/**
 * Schema para crear una cuenta (Account)
 */
export const createAccountSchema = z.object({
  // Información básica
  name: z
    .string({ required_error: 'El nombre de la cuenta es requerido' })
    .min(1, 'El nombre es requerido')
    .max(200, 'El nombre no puede exceder 200 caracteres')
    .trim(),
  accountNumber: z.string().trim().optional(),
  website: z.string().url('URL inválida').trim().optional().or(z.literal('')),
  phone: z.string().trim().optional(),
  email: z.string().email('Email inválido').trim().optional().or(z.literal('')),

  // Clasificación
  type: AccountTypeEnum,
  industry: AccountIndustryEnum,
  size: AccountSizeEnum.optional(),
  annualRevenue: z.number().min(0, 'El ingreso anual no puede ser negativo').optional(),
  employees: z.number().int().min(1, 'El número de empleados debe ser mayor a 0').optional(),

  // Direcciones
  billingAddress: addressSchema.optional(),
  shippingAddress: addressSchema.optional(),

  // Jerarquía
  parentAccount: z.string().optional(),

  // Asignación
  assignedTo: z.string().optional(),
  territory: z.string().trim().optional(),

  // Información adicional
  description: z.string().max(2000, 'La descripción no puede exceder 2000 caracteres').optional(),
  rating: z.number().min(1).max(5).optional(),
  isActive: z.boolean().default(true).optional(),

  // Redes sociales
  linkedInUrl: z.string().url('URL inválida').trim().optional().or(z.literal('')),
  twitterHandle: z.string().trim().optional(),
  facebookUrl: z.string().url('URL inválida').trim().optional().or(z.literal('')),

  // Campos personalizados
  customFields: z.record(z.any()).optional(),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;

/**
 * Schema para actualizar una cuenta
 */
export const updateAccountSchema = createAccountSchema.partial();

export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;

/**
 * Schema para obtener una cuenta por ID
 */
export const getAccountSchema = z.object({
  id: z.string().min(1, 'ID requerido'),
});

export type GetAccountInput = z.infer<typeof getAccountSchema>;

/**
 * Schema para query de cuentas con filtros
 */
export const getAccountsQuerySchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('10').transform(Number),
  type: AccountTypeEnum.optional(),
  industry: AccountIndustryEnum.optional(),
  assignedTo: z.string().optional(),
  territory: z.string().optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) => (val ? val === 'true' : undefined)),
  parentAccount: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type GetAccountsQueryInput = z.infer<typeof getAccountsQuerySchema>;

/**
 * Schema para asignar cuenta a usuario
 */
export const assignAccountSchema = z.object({
  assignedTo: z.string({ required_error: 'El usuario asignado es requerido' }),
});

export type AssignAccountInput = z.infer<typeof assignAccountSchema>;

/**
 * Schema para establecer cuenta padre
 */
export const setParentAccountSchema = z.object({
  parentAccountId: z.string({ required_error: 'El ID de la cuenta padre es requerido' }),
});

export type SetParentAccountInput = z.infer<typeof setParentAccountSchema>;

/**
 * Schema para bulk delete
 */
export const bulkDeleteAccountsSchema = z.object({
  ids: z.array(z.string()).min(1, 'Debe proporcionar al menos un ID'),
});

export type BulkDeleteAccountsInput = z.infer<typeof bulkDeleteAccountsSchema>;
