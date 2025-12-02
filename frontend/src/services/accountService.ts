import axios from './api';
import {
  Account,
  AccountFilters,
  AccountsPaginatedResponse,
  AccountStatsResponse,
  CreateAccountFormData,
  UpdateAccountFormData,
} from '../schemas/account.schema';

// Get all accounts with filters
export const getAccounts = async (
  filters?: AccountFilters
): Promise<AccountsPaginatedResponse> => {
  const response = await axios.get('/accounts', { params: filters });
  return response.data;
};

// Get single account by ID
export const getAccount = async (id: string): Promise<Account> => {
  const response = await axios.get(`/accounts/${id}`);
  return response.data.data;
};

// Create new account
export const createAccount = async (
  data: CreateAccountFormData
): Promise<Account> => {
  const response = await axios.post('/accounts', data);
  return response.data.data;
};

// Update existing account
export const updateAccount = async (
  id: string,
  data: UpdateAccountFormData
): Promise<Account> => {
  const response = await axios.patch(`/accounts/${id}`, data);
  return response.data.data;
};

// Delete account
export const deleteAccount = async (id: string): Promise<void> => {
  await axios.delete(`/accounts/${id}`);
};

// Bulk delete accounts
export const bulkDeleteAccounts = async (ids: string[]): Promise<number> => {
  const response = await axios.delete('/accounts/bulk', { data: { ids } });
  return response.data.data.deletedCount;
};

// Assign account to user
export const assignAccount = async (
  id: string,
  assignedTo: string
): Promise<Account> => {
  const response = await axios.patch(`/accounts/${id}/assign`, { assignedTo });
  return response.data.data;
};

// Set parent account (hierarchy)
export const setParentAccount = async (
  id: string,
  parentAccountId: string | null
): Promise<Account> => {
  const response = await axios.patch(`/accounts/${id}/set-parent`, {
    parentAccountId,
  });
  return response.data.data;
};

// Get account statistics
export const getAccountStats = async (): Promise<AccountStatsResponse> => {
  const response = await axios.get('/accounts/stats');
  return response.data;
};

// Get child accounts of a parent
export const getChildAccounts = async (
  parentAccountId: string
): Promise<Account[]> => {
  const response = await axios.get('/accounts', {
    params: { parentAccount: parentAccountId, limit: 100 },
  });
  return response.data.data.accounts;
};

// Export accounts to CSV
export const exportAccounts = async (filters?: AccountFilters): Promise<Blob> => {
  const response = await axios.get('/accounts/export', {
    params: filters,
    responseType: 'blob',
  });
  return response.data;
};

// Import accounts from CSV
export const importAccounts = async (file: File): Promise<{ imported: number; failed: number }> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post('/accounts/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};
