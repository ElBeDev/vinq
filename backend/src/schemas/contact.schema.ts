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

/**
 * Schema para crear un nuevo contacto
 */
export const createContactSchema = z.object({
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

    // Información básica (opcional)
    phone: z.string().trim().optional(),
    mobile: z.string().trim().optional(),

    // Información profesional
    title: z.string().max(100).trim().optional(),
    department: z.string().max(100).trim().optional(),
    account: z.string().optional(), // MongoDB ObjectId
    isPrimary: z.boolean().default(false).optional(),

    // Dirección principal (mailing)
    mailingStreet: z.string().trim().optional(),
    mailingCity: z.string().trim().optional(),
    mailingState: z.string().trim().optional(),
    mailingZipCode: z.string().trim().optional(),
    mailingCountry: z.string().trim().default('México').optional(),

    // Dirección alternativa (other)
    otherStreet: z.string().trim().optional(),
    otherCity: z.string().trim().optional(),
    otherState: z.string().trim().optional(),
    otherZipCode: z.string().trim().optional(),
    otherCountry: z.string().trim().optional(),

    // Información adicional
    dateOfBirth: z.string().datetime().optional(),
    leadSource: ContactLeadSourceEnum.optional(),
    description: z.string().max(2000).optional(),

    // Redes sociales
    linkedInUrl: z.string().url().trim().optional().or(z.literal('')),
    twitterHandle: z.string().trim().optional(),
    facebookUrl: z.string().url().trim().optional().or(z.literal('')),

    // Asignación
    assignedTo: z.string().optional(), // MongoDB ObjectId

    // Campos personalizados
    customFields: z.record(z.any()).optional(),
  }),
});

/**
 * Schema para actualizar un contacto
 */
export const updateContactSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).max(50).trim().optional(),
    lastName: z.string().min(1).max(50).trim().optional(),
    email: z.string().email().toLowerCase().trim().optional(),
    phone: z.string().trim().optional(),
    mobile: z.string().trim().optional(),
    title: z.string().max(100).trim().optional(),
    department: z.string().max(100).trim().optional(),
    account: z.string().optional(),
    isPrimary: z.boolean().optional(),
    mailingStreet: z.string().trim().optional(),
    mailingCity: z.string().trim().optional(),
    mailingState: z.string().trim().optional(),
    mailingZipCode: z.string().trim().optional(),
    mailingCountry: z.string().trim().optional(),
    otherStreet: z.string().trim().optional(),
    otherCity: z.string().trim().optional(),
    otherState: z.string().trim().optional(),
    otherZipCode: z.string().trim().optional(),
    otherCountry: z.string().trim().optional(),
    dateOfBirth: z.string().datetime().optional(),
    leadSource: ContactLeadSourceEnum.optional(),
    description: z.string().max(2000).optional(),
    linkedInUrl: z.string().url().trim().optional().or(z.literal('')),
    twitterHandle: z.string().trim().optional(),
    facebookUrl: z.string().url().trim().optional().or(z.literal('')),
    assignedTo: z.string().optional(),
    customFields: z.record(z.any()).optional(),
    lastContactedDate: z.string().datetime().optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'ID del contacto requerido'),
  }),
});

/**
 * Schema para obtener contacto por ID
 */
export const getContactSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'ID del contacto requerido'),
  }),
});

/**
 * Schema para query params de búsqueda/filtros
 */
export const getContactsQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
    account: z.string().optional(),
    assignedTo: z.string().optional(),
    leadSource: z.string().optional(),
    search: z.string().optional(),
    sortBy: z.string().optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    isPrimary: z.string().optional(),
  }),
});

/**
 * Schema para fusionar (merge) contactos duplicados
 */
export const mergeContactsSchema = z.object({
  body: z.object({
    sourceContactId: z.string().min(1, 'ID del contacto origen requerido'),
    targetContactId: z.string().min(1, 'ID del contacto destino requerido'),
    fieldsToKeep: z.object({
      firstName: z.enum(['source', 'target']).optional(),
      lastName: z.enum(['source', 'target']).optional(),
      email: z.enum(['source', 'target']).optional(),
      phone: z.enum(['source', 'target']).optional(),
      mobile: z.enum(['source', 'target']).optional(),
      title: z.enum(['source', 'target']).optional(),
      department: z.enum(['source', 'target']).optional(),
      account: z.enum(['source', 'target']).optional(),
      // Agregar más campos según necesidad
    }).optional(),
    mergeActivities: z.boolean().default(true), // Fusionar actividades
    mergeDeals: z.boolean().default(true), // Fusionar deals relacionados
  }),
});

/**
 * Schema para vincular contacto a una cuenta
 */
export const linkToAccountSchema = z.object({
  body: z.object({
    accountId: z.string().min(1, 'ID de la cuenta requerido'),
    isPrimary: z.boolean().default(false),
  }),
  params: z.object({
    id: z.string().min(1, 'ID del contacto requerido'),
  }),
});

/**
 * Schema para asignación de contacto
 */
export const assignContactSchema = z.object({
  body: z.object({
    assignedTo: z.string().min(1, 'ID del usuario requerido'),
  }),
  params: z.object({
    id: z.string().min(1, 'ID del contacto requerido'),
  }),
});

// Type exports
export type CreateContactInput = z.infer<typeof createContactSchema>['body'];
export type UpdateContactInput = z.infer<typeof updateContactSchema>['body'];
export type GetContactsQuery = z.infer<typeof getContactsQuerySchema>['query'];
export type MergeContactsInput = z.infer<typeof mergeContactsSchema>['body'];
export type LinkToAccountInput = z.infer<typeof linkToAccountSchema>['body'];
export type AssignContactInput = z.infer<typeof assignContactSchema>['body'];
