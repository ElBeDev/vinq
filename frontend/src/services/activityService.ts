import api from './api';

export interface Activity {
  _id: string;
  type: 'call' | 'email' | 'meeting' | 'task' | 'note';
  title: string;
  description?: string;
  status: 'pending' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completedDate?: string;
  duration?: number;
  
  relatedTo: {
    type: 'lead' | 'opportunity' | 'property' | 'user';
    id: string;
  };
  
  assignedTo: {
    _id: string;
    name: string;
    email: string;
  };
  
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  
  callDetails?: {
    phoneNumber?: string;
    outcome?: 'answered' | 'no-answer' | 'voicemail' | 'busy';
  };
  
  emailDetails?: {
    to?: string[];
    cc?: string[];
    subject?: string;
    body?: string;
    sentDate?: string;
  };
  
  meetingDetails?: {
    location?: string;
    attendees?: string[];
    meetingLink?: string;
  };
  
  reminder?: {
    enabled: boolean;
    time: string;
    sent: boolean;
  };
  
  createdAt: string;
  updatedAt: string;
}

export interface ActivityFilters {
  type?: string;
  status?: string;
  priority?: string;
  relatedType?: string;
  relatedId?: string;
  assignedTo?: string;
  startDate?: string;
  endDate?: string;
}

const activityService = {
  getActivities: async (filters?: ActivityFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const response = await api.get(`/activities?${params.toString()}`);
    return response.data.data.activities;
  },

  getActivity: async (id: string) => {
    const response = await api.get(`/activities/${id}`);
    return response.data.data.activity;
  },

  createActivity: async (data: Partial<Activity>) => {
    const response = await api.post('/activities', data);
    return response.data.data.activity;
  },

  updateActivity: async (id: string, data: Partial<Activity>) => {
    const response = await api.patch(`/activities/${id}`, data);
    return response.data.data.activity;
  },

  deleteActivity: async (id: string) => {
    await api.delete(`/activities/${id}`);
  },

  getTodayActivities: async () => {
    const response = await api.get('/activities/today');
    return response.data.data.activities;
  },

  getPendingActivities: async () => {
    const response = await api.get('/activities/pending');
    return response.data.data.activities;
  },

  completeActivity: async (id: string) => {
    const response = await api.patch(`/activities/${id}/complete`);
    return response.data.data.activity;
  },
};

export default activityService;
