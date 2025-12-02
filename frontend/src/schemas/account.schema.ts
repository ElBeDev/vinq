import { z } from 'zod';

// Account Types Enum
export enum AccountType {
  CUSTOMER = 'Customer',
  PROSPECT = 'Prospect',
  PARTNER = 'Partner',
  RESELLER = 'Reseller',
  VENDOR = 'Vendor',
  COMPETITOR = 'Competitor',
  OTHER = 'Other',
}

// Account Industry Enum
export enum AccountIndustry {
  REAL_ESTATE = 'Real Estate',
  CONSTRUCTION = 'Construction',
  FINANCE = 'Finance',
  TECHNOLOGY = 'Technology',
  HEALTHCARE = 'Healthcare',
  RETAIL = 'Retail',
  MANUFACTURING = 'Manufacturing',
  EDUCATION = 'Education',
  HOSPITALITY = 'Hospitality',
  OTHER = 'Other',
}

// Account Size Enum
export enum AccountSize {
  SMALL = 'Small (1-50)',
  MEDIUM = 'Medium (51-200)',
  LARGE = 'Large (201-1000)',
  ENTERPRISE = 'Enterprise (1000+)',
}

// Address Interface
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Base Account Interface
export interface Account {
  _id: string;
  name: string;
  accountNumber: string;
  website?: string;
  phone?: string;
  email?: string;
  type: AccountType;
  industry: AccountIndustry;
  size?: AccountSize;
  annualRevenue?: number;
  employees?: number;
  billingAddress?: Address;
  shippingAddress?: Address;
  parentAccount?: string | Account;
  assignedTo?: string | { _id: string; firstName: string; lastName: string; email: string };
  territory?: string;
  description?: string;
  rating?: number;
  isActive: boolean;
  linkedInUrl?: string;
  twitterHandle?: string;
  facebookUrl?: string;
  customFields?: Record<string, any>;
  lastActivityDate?: Date;
  createdBy?: string | { _id: string; firstName: string; lastName: string; email: string };
  createdAt: Date;
  updatedAt: Date;
  // Virtual fields
  contacts?: any[];
  deals?: any[];
  childAccounts?: Account[];
}

// Address Schema
const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().min(1, 'Country is required'),
});

// Create Account Schema
export const createAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  type: z.nativeEnum(AccountType, { required_error: 'Account type is required' }),
  industry: z.nativeEnum(AccountIndustry, { required_error: 'Industry is required' }),
  size: z.nativeEnum(AccountSize).optional(),
  annualRevenue: z.number().min(0, 'Annual revenue must be positive').optional(),
  employees: z.number().int().min(0, 'Employees must be a positive integer').optional(),
  billingAddress: addressSchema.optional(),
  shippingAddress: addressSchema.optional(),
  parentAccount: z.string().optional(),
  assignedTo: z.string().optional(),
  territory: z.string().optional(),
  description: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  isActive: z.boolean().default(true),
  linkedInUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  twitterHandle: z.string().optional(),
  facebookUrl: z.string().url('Invalid Facebook URL').optional().or(z.literal('')),
  customFields: z.record(z.any()).optional(),
});

// Update Account Schema (all fields optional)
export const updateAccountSchema = createAccountSchema.partial();

// Account Filters for Query
export interface AccountFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  type?: AccountType;
  industry?: AccountIndustry;
  size?: AccountSize;
  assignedTo?: string;
  territory?: string;
  isActive?: boolean;
  parentAccount?: string;
  search?: string;
}

// Paginated Accounts Response
export interface AccountsPaginatedResponse {
  success: boolean;
  data: {
    accounts: Account[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

// Account Stats Response
export interface AccountStats {
  total: number;
  active: number;
  inactive: number;
  byType: Record<AccountType, number>;
  byIndustry: Record<AccountIndustry, number>;
  bySize: Record<AccountSize, number>;
}

export interface AccountStatsResponse {
  success: boolean;
  data: AccountStats;
}

// Form Data Type
export type CreateAccountFormData = z.infer<typeof createAccountSchema>;
export type UpdateAccountFormData = z.infer<typeof updateAccountSchema>;
