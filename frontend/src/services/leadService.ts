import api from './api';
import {
  Lead,
  LeadFormData,
  LeadFilters,
  LeadsPaginatedResponse,
  LeadStats,
} from '@/schemas/lead.schema';

const leadService = {
  /**
   * Obtener todos los leads con filtros y paginación
   */
  async getLeads(filters?: LeadFilters): Promise<LeadsPaginatedResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.status) params.append('status', filters.status);
      if (filters.source) params.append('source', filters.source);
      if (filters.rating) params.append('rating', filters.rating);
      if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      if (filters.minScore) params.append('minScore', filters.minScore.toString());
      if (filters.maxScore) params.append('maxScore', filters.maxScore.toString());
      if (filters.minBudget) params.append('minBudget', filters.minBudget.toString());
      if (filters.maxBudget) params.append('maxBudget', filters.maxBudget.toString());
    }

    const response = await api.get(`/leads?${params.toString()}`);
    return response.data;
  },

  /**
   * Obtener un lead por ID
   */
  async getLead(id: string): Promise<Lead> {
    const response = await api.get(`/leads/${id}`);
    return response.data.data;
  },

  /**
   * Crear un nuevo lead
   */
  async createLead(data: LeadFormData): Promise<Lead> {
    const response = await api.post('/leads', data);
    return response.data.data;
  },

  /**
   * Actualizar un lead
   */
  async updateLead(id: string, data: Partial<LeadFormData>): Promise<Lead> {
    const response = await api.put(`/leads/${id}`, data);
    return response.data.data;
  },

  /**
   * Eliminar un lead
   */
  async deleteLead(id: string): Promise<void> {
    await api.delete(`/leads/${id}`);
  },

  /**
   * Eliminar múltiples leads
   */
  async bulkDeleteLeads(ids: string[]): Promise<{ deletedCount: number }> {
    const response = await api.delete('/leads/bulk', { data: { ids } });
    return response.data;
  },

  /**
   * Asignar lead a un usuario
   */
  async assignLead(id: string, userId: string): Promise<Lead> {
    const response = await api.patch(`/leads/${id}/assign`, { assignedTo: userId });
    return response.data.data;
  },

  /**
   * Convertir lead a Contact/Account/Deal
   */
  async convertLead(
    id: string,
    options: {
      createContact?: boolean;
      createAccount?: boolean;
      createDeal?: boolean;
      dealAmount?: number;
      dealStage?: string;
      dealCloseDate?: string;
      accountName?: string;
    }
  ): Promise<Lead> {
    const response = await api.post(`/leads/${id}/convert`, options);
    return response.data.data;
  },

  /**
   * Obtener estadísticas de leads
   */
  async getLeadStats(): Promise<LeadStats> {
    const response = await api.get('/leads/stats');
    return response.data.data;
  },

  /**
   * Exportar leads a CSV (futuro)
   */
  async exportLeads(filters?: LeadFilters): Promise<Blob> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`/leads/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Importar leads desde CSV (futuro)
   */
  async importLeads(file: File): Promise<{ imported: number; errors: any[] }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/leads/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default leadService;
