import api from './api';
import type {
  Contact,
  ContactFormData,
  ContactFilters,
  ContactsPaginatedResponse,
  ContactStats,
  MergeContactsInput,
} from '../schemas/contact.schema';

/**
 * Contact Service
 * API methods for Contact CRUD operations
 */

// Get all contacts with filters and pagination
export const getContacts = async (
  filters?: ContactFilters
): Promise<ContactsPaginatedResponse> => {
  const params = new URLSearchParams();

  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.account) params.append('account', filters.account);
  if (filters?.assignedTo) params.append('assignedTo', filters.assignedTo);
  if (filters?.leadSource) params.append('leadSource', filters.leadSource);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
  if (filters?.isPrimary !== undefined)
    params.append('isPrimary', filters.isPrimary.toString());

  const response = await api.get<ContactsPaginatedResponse>(
    `/contacts?${params.toString()}`
  );
  return response.data;
};

// Get single contact by ID
export const getContact = async (id: string): Promise<Contact> => {
  const response = await api.get<{ data: Contact }>(`/contacts/${id}`);
  return response.data.data;
};

// Create new contact
export const createContact = async (
  data: ContactFormData
): Promise<Contact> => {
  const response = await api.post<{ data: Contact }>('/contacts', data);
  return response.data.data;
};

// Update existing contact
export const updateContact = async (
  id: string,
  data: Partial<ContactFormData>
): Promise<Contact> => {
  const response = await api.patch<{ data: Contact }>(
    `/contacts/${id}`,
    data
  );
  return response.data.data;
};

// Delete contact
export const deleteContact = async (id: string): Promise<void> => {
  await api.delete(`/contacts/${id}`);
};

// Bulk delete contacts
export const bulkDeleteContacts = async (ids: string[]): Promise<number> => {
  const response = await api.delete<{ data: { deletedCount: number } }>(
    '/contacts/bulk',
    {
      data: { ids },
    }
  );
  return response.data.data.deletedCount;
};

// Assign contact to user
export const assignContact = async (
  id: string,
  assignedTo: string
): Promise<Contact> => {
  const response = await api.patch<{ data: Contact }>(
    `/contacts/${id}/assign`,
    {
      assignedTo,
    }
  );
  return response.data.data;
};

// Link contact to account
export const linkToAccount = async (
  id: string,
  accountId: string,
  isPrimary: boolean = false
): Promise<Contact> => {
  const response = await api.patch<{ data: Contact }>(
    `/contacts/${id}/link-account`,
    {
      accountId,
      isPrimary,
    }
  );
  return response.data.data;
};

// Merge duplicate contacts
export const mergeContacts = async (
  data: MergeContactsInput
): Promise<Contact> => {
  const response = await api.post<{ data: Contact }>('/contacts/merge', data);
  return response.data.data;
};

// Get contact statistics
export const getContactStats = async (): Promise<ContactStats> => {
  const response = await api.get<{ data: ContactStats }>('/contacts/stats');
  return response.data.data;
};

// Export contacts to CSV
export const exportContacts = async (
  filters?: ContactFilters
): Promise<Blob> => {
  const params = new URLSearchParams();

  if (filters?.account) params.append('account', filters.account);
  if (filters?.assignedTo) params.append('assignedTo', filters.assignedTo);
  if (filters?.leadSource) params.append('leadSource', filters.leadSource);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.isPrimary !== undefined)
    params.append('isPrimary', filters.isPrimary.toString());

  const response = await api.get(`/contacts/export?${params.toString()}`, {
    responseType: 'blob',
  });
  return response.data;
};

// Import contacts from CSV
export const importContacts = async (file: File): Promise<{
  success: number;
  errors: Array<{ row: number; message: string }>;
}> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<{
    data: {
      success: number;
      errors: Array<{ row: number; message: string }>;
    };
  }>('/contacts/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

export default {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  bulkDeleteContacts,
  assignContact,
  linkToAccount,
  mergeContacts,
  getContactStats,
  exportContacts,
  importContacts,
};
