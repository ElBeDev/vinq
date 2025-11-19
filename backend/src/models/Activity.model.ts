import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  type: 'call' | 'email' | 'meeting' | 'task' | 'note';
  title: string;
  description?: string;
  status: 'pending' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  completedDate?: Date;
  duration?: number; // en minutos
  
  // Relaciones
  relatedTo: {
    type: 'lead' | 'opportunity' | 'property' | 'user';
    id: mongoose.Types.ObjectId;
  };
  
  assignedTo: mongoose.Types.ObjectId; // Usuario asignado
  createdBy: mongoose.Types.ObjectId;
  
  // Para llamadas
  callDetails?: {
    phoneNumber?: string;
    outcome?: 'answered' | 'no-answer' | 'voicemail' | 'busy';
  };
  
  // Para emails
  emailDetails?: {
    to?: string[];
    cc?: string[];
    subject?: string;
    body?: string;
    sentDate?: Date;
  };
  
  // Para reuniones
  meetingDetails?: {
    location?: string;
    attendees?: string[];
    meetingLink?: string;
  };
  
  // Recordatorios
  reminder?: {
    enabled: boolean;
    time: Date;
    sent: boolean;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    type: {
      type: String,
      enum: ['call', 'email', 'meeting', 'task', 'note'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
    },
    completedDate: {
      type: Date,
    },
    duration: {
      type: Number,
    },
    relatedTo: {
      type: {
        type: String,
        enum: ['lead', 'opportunity', 'property', 'user'],
        required: true,
      },
      id: {
        type: Schema.Types.ObjectId,
        required: true,
      },
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    callDetails: {
      phoneNumber: String,
      outcome: {
        type: String,
        enum: ['answered', 'no-answer', 'voicemail', 'busy'],
      },
    },
    emailDetails: {
      to: [String],
      cc: [String],
      subject: String,
      body: String,
      sentDate: Date,
    },
    meetingDetails: {
      location: String,
      attendees: [String],
      meetingLink: String,
    },
    reminder: {
      enabled: {
        type: Boolean,
        default: false,
      },
      time: Date,
      sent: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Índices para mejorar búsquedas
activitySchema.index({ assignedTo: 1, status: 1, dueDate: 1 });
activitySchema.index({ 'relatedTo.type': 1, 'relatedTo.id': 1 });
activitySchema.index({ type: 1, createdAt: -1 });

export default mongoose.model<IActivity>('Activity', activitySchema);
