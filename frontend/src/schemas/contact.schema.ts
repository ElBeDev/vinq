import { z } from 'zod';

// Enums
export const ContactLeadSourceEnum = z.enum([
  'WEBSITE',
  'REFERRAL',
  'SOCIAL_MEDIA',
  'EMAIL_CAMPAIGN',
  'PHONE_CALL',
  'TRADE_SHOW',
  'ADVERTISING',
  'OTHER',
]);

export type ContactLeadSource = z.infer<typeof ContactLeadSourceEnum>;

/**
 * Schema para crear/editar un contacto
 */
export const contactFormSchema = z.object({
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

  // Información básica (opcional)
  phone: z.string().trim().optional(),
  mobile: z.string().trim().optional(),

  // Información profesional
  title: z.string().max(100).trim().optional(),
  department: z.string().max(100).trim().optional(),
  account: z.string().optional(),
  isPrimary: z.boolean().default(false).optional(),

  // Dirección principal (mailing)
  mailingStreet: z.string().trim().optional(),
  mailingCity: z.string().trim().optional(),
  mailingState: z.string().trim().optional(),
  mailingZip: z.string().trim().optional(),
  mailingCountry: z.string().trim().default('México').optional(),

  // Dirección alternativa (other)
  otherStreet: z.string().trim().optional(),
  otherCity: z.string().trim().optional(),
  otherState: z.string().trim().optional(),
  otherZip: z.string().trim().optional(),
  otherCountry: z.string().trim().optional(),

  // Información adicional
  dateOfBirth: z.string().optional(),
  leadSource: ContactLeadSourceEnum.optional(),
  description: z.string().max(2000).optional(),

  // Redes sociales
  linkedInUrl: z.string().url().trim().optional().or(z.literal('')),
  twitterHandle: z.string().trim().optional(),
  facebookUrl: z.string().url().trim().optional().or(z.literal('')),

  // Asignación
  assignedTo: z.string().optional(),

  // Campos personalizados
  customFields: z.record(z.any()).optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Address interface
export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

// Type para Contact completo (desde API)
export interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  mobile?: string;
  title?: string;
  department?: string;
  account?: {
    _id: string;
    name: string;
    industry?: string;
    website?: string;
    phone?: string;
  };
  isPrimary: boolean;
  mailingAddress?: Address;
  otherAddress?: Address;
  dateOfBirth?: string;
  leadSource?: ContactLeadSource;
  description?: string;
  linkedInUrl?: string;
  twitterHandle?: string;
  facebookUrl?: string;
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
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

// Filtros para búsqueda de contactos
export interface ContactFilters {
  page?: number;
  limit?: number;
  account?: string;
  assignedTo?: string;
  leadSource?: ContactLeadSource;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isPrimary?: boolean;
}

// Respuesta paginada de contactos
export interface ContactsPaginatedResponse {
  success: boolean;
  data: Contact[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Estadísticas de contactos
export interface ContactStats {
  total: number;
  withAccount: number;
  withoutAccount: number;
  byLeadSource: Array<{ _id: string; count: number }>;
}

// Input para merge de contactos
export interface MergeContactsInput {
  sourceContactId: string;
  targetContactId: string;
  fieldsToKeep?: {
    firstName?: 'source' | 'target';
    lastName?: 'source' | 'target';
    email?: 'source' | 'target';
    phone?: 'source' | 'target';
    mobile?: 'source' | 'target';
    title?: 'source' | 'target';
    department?: 'source' | 'target';
    account?: 'source' | 'target';
  };
  mergeActivities?: boolean;
  mergeDeals?: boolean;
}
