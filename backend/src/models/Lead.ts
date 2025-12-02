import mongoose, { Document, Schema } from 'mongoose';

// Lead Status enum
export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  UNQUALIFIED = 'UNQUALIFIED',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST',
}

// Lead Source enum
export enum LeadSource {
  WEBSITE = 'WEBSITE',
  REFERRAL = 'REFERRAL',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  EMAIL_CAMPAIGN = 'EMAIL_CAMPAIGN',
  PHONE_CALL = 'PHONE_CALL',
  TRADE_SHOW = 'TRADE_SHOW',
  ADVERTISING = 'ADVERTISING',
  OTHER = 'OTHER',
}

// Lead Rating enum
export enum LeadRating {
  HOT = 'HOT',
  WARM = 'WARM',
  COLD = 'COLD',
}

export interface ILead extends Document {
  // Información básica
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  mobile?: string;
  
  // Información de la empresa
  company?: string;
  title?: string; // Cargo
  industry?: string;
  
  // Estado y clasificación
  status: LeadStatus;
  source: LeadSource;
  rating?: LeadRating;
  score?: number; // Lead scoring (0-100)
  
  // Ubicación
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  
  // Asignación
  assignedTo?: mongoose.Types.ObjectId; // Usuario asignado
  
  // Intereses y necesidades
  propertyInterest?: string[]; // Tipos de propiedad de interés
  budgetMin?: number;
  budgetMax?: number;
  notes?: string;
  
  // Conversión
  isConverted: boolean;
  convertedDate?: Date;
  convertedContactId?: mongoose.Types.ObjectId;
  convertedAccountId?: mongoose.Types.ObjectId;
  convertedDealId?: mongoose.Types.ObjectId;
  
  // Campos personalizados
  customFields?: Map<string, any>;
  
  // Metadata
  createdBy: mongoose.Types.ObjectId;
  lastContactedDate?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    // Información básica
    firstName: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      maxlength: [50, 'El nombre no puede exceder 50 caracteres'],
    },
    lastName: {
      type: String,
      required: [true, 'El apellido es requerido'],
      trim: true,
      maxlength: [50, 'El apellido no puede exceder 50 caracteres'],
    },
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Por favor ingresa un email válido',
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    
    // Información de la empresa
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'El nombre de la empresa no puede exceder 100 caracteres'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'El título no puede exceder 100 caracteres'],
    },
    industry: {
      type: String,
      trim: true,
    },
    
    // Estado y clasificación
    status: {
      type: String,
      enum: Object.values(LeadStatus),
      default: LeadStatus.NEW,
      required: true,
    },
    source: {
      type: String,
      enum: Object.values(LeadSource),
      required: [true, 'La fuente del lead es requerida'],
    },
    rating: {
      type: String,
      enum: Object.values(LeadRating),
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    
    // Ubicación
    street: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    zipCode: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default: 'México',
    },
    
    // Asignación
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    
    // Intereses y necesidades
    propertyInterest: [{
      type: String,
    }],
    budgetMin: {
      type: Number,
      min: 0,
    },
    budgetMax: {
      type: Number,
      min: 0,
    },
    notes: {
      type: String,
      maxlength: [2000, 'Las notas no pueden exceder 2000 caracteres'],
    },
    
    // Conversión
    isConverted: {
      type: Boolean,
      default: false,
    },
    convertedDate: {
      type: Date,
    },
    convertedContactId: {
      type: Schema.Types.ObjectId,
      ref: 'Contact',
    },
    convertedAccountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
    convertedDealId: {
      type: Schema.Types.ObjectId,
      ref: 'Deal',
    },
    
    // Campos personalizados
    customFields: {
      type: Map,
      of: Schema.Types.Mixed,
    },
    
    // Metadata
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastContactedDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Middleware pre-save para generar fullName
leadSchema.pre('save', function (next) {
  if (this.firstName && this.lastName) {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
  next();
});

// Índices para búsquedas rápidas
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ createdBy: 1 });
leadSchema.index({ company: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ score: -1 });

// Índice de texto para búsqueda global
leadSchema.index({
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  company: 'text',
  phone: 'text',
  mobile: 'text',
});

// Validación: budgetMax debe ser mayor que budgetMin
leadSchema.pre('save', function (next) {
  if (this.budgetMin && this.budgetMax && this.budgetMax < this.budgetMin) {
    next(new Error('El presupuesto máximo debe ser mayor que el mínimo'));
  }
  next();
});

const Lead = mongoose.model<ILead>('Lead', leadSchema);

export default Lead;
