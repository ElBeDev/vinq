import mongoose, { Document, Schema } from 'mongoose';

export interface IOpportunity extends Document {
  name: string;
  client: mongoose.Types.ObjectId;
  property: mongoose.Types.ObjectId;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  value: number;
  currency: string;
  probability: number;
  expectedCloseDate?: Date;
  actualCloseDate?: Date;
  assignedTo: mongoose.Types.ObjectId;
  notes?: string;
  activities: {
    type: 'call' | 'email' | 'meeting' | 'note' | 'task';
    description: string;
    date: Date;
    createdBy: mongoose.Types.ObjectId;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const opportunitySchema = new Schema<IOpportunity>(
  {
    name: {
      type: String,
      required: [true, 'El nombre de la oportunidad es requerido'],
      trim: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
      required: [true, 'El cliente es requerido'],
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'La propiedad es requerida'],
    },
    stage: {
      type: String,
      enum: ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'],
      default: 'prospecting',
    },
    value: {
      type: Number,
      required: [true, 'El valor es requerido'],
    },
    currency: {
      type: String,
      default: 'USD',
    },
    probability: {
      type: Number,
      min: 0,
      max: 100,
      default: 10,
    },
    expectedCloseDate: {
      type: Date,
    },
    actualCloseDate: {
      type: Date,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notes: {
      type: String,
    },
    activities: [
      {
        type: {
          type: String,
          enum: ['call', 'email', 'meeting', 'note', 'task'],
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

export default mongoose.model<IOpportunity>('Opportunity', opportunitySchema);
