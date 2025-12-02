import mongoose, { Document, Schema } from 'mongoose';

// Contact Lead Source enum (same as Lead for consistency)
export enum ContactLeadSource {
  WEBSITE = 'WEBSITE',
  REFERRAL = 'REFERRAL',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  EMAIL_CAMPAIGN = 'EMAIL_CAMPAIGN',
  PHONE_CALL = 'PHONE_CALL',
  TRADE_SHOW = 'TRADE_SHOW',
  ADVERTISING = 'ADVERTISING',
  OTHER = 'OTHER',
}

export interface IContact extends Document {
  // Información básica
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  mobile?: string;
  
  // Información profesional
  title?: string; // Cargo
  department?: string;
  account?: mongoose.Types.ObjectId; // Empresa/Organización asociada
  isPrimary: boolean; // ¿Es el contacto principal de la cuenta?
  
  // Direcciones
  mailingStreet?: string;
  mailingCity?: string;
  mailingState?: string;
  mailingZipCode?: string;
  mailingCountry?: string;
  
  otherStreet?: string;
  otherCity?: string;
  otherState?: string;
  otherZipCode?: string;
  otherCountry?: string;
  
  // Información adicional
  dateOfBirth?: Date;
  leadSource?: ContactLeadSource;
  description?: string;
  
  // Redes sociales
  linkedInUrl?: string;
  twitterHandle?: string;
  facebookUrl?: string;
  
  // Asignación y tracking
  assignedTo?: mongoose.Types.ObjectId; // Usuario asignado
  createdBy: mongoose.Types.ObjectId;
  lastContactedDate?: Date;
  
  // Campos personalizados
  customFields?: Map<string, any>;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
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
    
    // Información profesional
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'El título no puede exceder 100 caracteres'],
    },
    department: {
      type: String,
      trim: true,
      maxlength: [100, 'El departamento no puede exceder 100 caracteres'],
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    
    // Dirección principal (mailing)
    mailingStreet: {
      type: String,
      trim: true,
    },
    mailingCity: {
      type: String,
      trim: true,
    },
    mailingState: {
      type: String,
      trim: true,
    },
    mailingZipCode: {
      type: String,
      trim: true,
    },
    mailingCountry: {
      type: String,
      trim: true,
      default: 'México',
    },
    
    // Dirección alternativa (other)
    otherStreet: {
      type: String,
      trim: true,
    },
    otherCity: {
      type: String,
      trim: true,
    },
    otherState: {
      type: String,
      trim: true,
    },
    otherZipCode: {
      type: String,
      trim: true,
    },
    otherCountry: {
      type: String,
      trim: true,
    },
    
    // Información adicional
    dateOfBirth: {
      type: Date,
    },
    leadSource: {
      type: String,
      enum: Object.values(ContactLeadSource),
    },
    description: {
      type: String,
      maxlength: [2000, 'La descripción no puede exceder 2000 caracteres'],
    },
    
    // Redes sociales
    linkedInUrl: {
      type: String,
      trim: true,
    },
    twitterHandle: {
      type: String,
      trim: true,
    },
    facebookUrl: {
      type: String,
      trim: true,
    },
    
    // Asignación
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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
    
    // Campos personalizados
    customFields: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Middleware pre-save para generar fullName
contactSchema.pre('save', function (next) {
  if (this.firstName && this.lastName) {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
  next();
});

// Índices para búsquedas rápidas
contactSchema.index({ email: 1 });
contactSchema.index({ account: 1 });
contactSchema.index({ assignedTo: 1 });
contactSchema.index({ createdBy: 1 });
contactSchema.index({ isPrimary: 1 });
contactSchema.index({ createdAt: -1 });

// Índice de texto para búsqueda global
contactSchema.index({
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  phone: 'text',
  mobile: 'text',
  title: 'text',
  department: 'text',
});

// Virtual para obtener deals relacionados
contactSchema.virtual('deals', {
  ref: 'Deal',
  localField: '_id',
  foreignField: 'contact',
});

const Contact = mongoose.model<IContact>('Contact', contactSchema);

export default Contact;
