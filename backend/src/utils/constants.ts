// Roles disponibles en el sistema
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  AGENT = 'agent',
  USER = 'user',
}

// Estados de usuarios
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

// Estados de leads
export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  CONVERTED = 'converted',
  DISQUALIFIED = 'disqualified',
}

// Fuentes de leads
export enum LeadSource {
  WEBSITE = 'website',
  REFERRAL = 'referral',
  SOCIAL_MEDIA = 'social_media',
  EMAIL_CAMPAIGN = 'email_campaign',
  PHONE_CALL = 'phone_call',
  WALK_IN = 'walk_in',
  OTHER = 'other',
}

// Estados de deals/oportunidades
export enum DealStage {
  PROSPECTING = 'prospecting',
  QUALIFICATION = 'qualification',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost',
}

// Tipos de propiedades
export enum PropertyType {
  HOUSE = 'house',
  APARTMENT = 'apartment',
  LAND = 'land',
  COMMERCIAL = 'commercial',
  OFFICE = 'office',
}

// Estados de propiedades
export enum PropertyStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  SOLD = 'sold',
  RENTED = 'rented',
}

// Tipos de actividades
export enum ActivityType {
  TASK = 'task',
  EVENT = 'event',
  CALL = 'call',
  EMAIL = 'email',
  NOTE = 'note',
}

// Prioridades
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

// Estados de tareas
export enum TaskStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Estados de cotizaciones
export enum QuoteStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CLOSED = 'closed',
}

// Tipos de notificaciones
export enum NotificationType {
  ACTIVITY = 'activity',
  LEAD = 'lead',
  DEAL = 'deal',
  QUOTE = 'quote',
  SYSTEM = 'system',
  MENTION = 'mention',
}
