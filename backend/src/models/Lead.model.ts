import mongoose, { Document, Schema } from 'mongoose';

export interface ILead extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: string;
  interestedIn?: string;
  budget?: number;
  notes?: string;
  assignedTo?: mongoose.Types.ObjectId;
  convertedToOpportunity?: mongoose.Types.ObjectId;
  activities: {
    type: 'call' | 'email' | 'meeting' | 'note';
    description: string;
    date: Date;
    createdBy: mongoose.Types.ObjectId;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    firstName: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'El apellido es requerido'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'El teléfono es requerido'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'converted', 'lost'],
      default: 'new',
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    interestedIn: {
      type: String,
      trim: true,
    },
    budget: {
      type: Number,
    },
    notes: {
      type: String,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    convertedToOpportunity: {
      type: Schema.Types.ObjectId,
      ref: 'Opportunity',
    },
    activities: [
      {
        type: {
          type: String,
          enum: ['call', 'email', 'meeting', 'note'],
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        createdBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ILead>('Lead', leadSchema);
