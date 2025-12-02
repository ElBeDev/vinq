import mongoose, { Document, Schema } from 'mongoose';

// Enums
export enum AccountIndustry {
  REAL_ESTATE = 'Real Estate',
  CONSTRUCTION = 'Construction',
  FINANCE = 'Finance',
  TECHNOLOGY = 'Technology',
  RETAIL = 'Retail',
  MANUFACTURING = 'Manufacturing',
  HEALTHCARE = 'Healthcare',
  EDUCATION = 'Education',
  HOSPITALITY = 'Hospitality',
  OTHER = 'Other',
}

export enum AccountType {
  CUSTOMER = 'Customer',
  PROSPECT = 'Prospect',
  PARTNER = 'Partner',
  RESELLER = 'Reseller',
  VENDOR = 'Vendor',
  COMPETITOR = 'Competitor',
  OTHER = 'Other',
}

export enum AccountSize {
  SMALL = 'Small (1-50)',
  MEDIUM = 'Medium (51-200)',
  LARGE = 'Large (201-1000)',
  ENTERPRISE = 'Enterprise (1000+)',
}

// Address interface
export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

// Account Interface
export interface IAccount extends Document {
  // Información básica
  name: string;
  accountNumber?: string;
  website?: string;
  phone?: string;
  email?: string;

  // Clasificación
  type: AccountType;
  industry: AccountIndustry;
  size?: AccountSize;
  annualRevenue?: number;
  employees?: number;

  // Direcciones
  billingAddress?: IAddress;
  shippingAddress?: IAddress;

  // Jerarquía
  parentAccount?: mongoose.Types.ObjectId;

  // Asignación y ownership
  assignedTo?: mongoose.Types.ObjectId;
  territory?: string;

  // Información adicional
  description?: string;
  rating?: number; // 1-5 estrellas
  isActive: boolean;

  // Redes sociales
  linkedInUrl?: string;
  twitterHandle?: string;
  facebookUrl?: string;

  // Campos personalizados
  customFields?: Map<string, any>;

  // Tracking
  createdBy: mongoose.Types.ObjectId;
  lastActivityDate?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Schema
const accountSchema = new Schema<IAccount>(
  {
    // Información básica
    name: {
      type: String,
      required: [true, 'El nombre de la cuenta es requerido'],
      trim: true,
      maxlength: [200, 'El nombre no puede exceder 200 caracteres'],
    },
    accountNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // Clasificación
    type: {
      type: String,
      enum: Object.values(AccountType),
      required: [true, 'El tipo de cuenta es requerido'],
      default: AccountType.PROSPECT,
    },
    industry: {
      type: String,
      enum: Object.values(AccountIndustry),
      required: [true, 'La industria es requerida'],
    },
    size: {
      type: String,
      enum: Object.values(AccountSize),
    },
    annualRevenue: {
      type: Number,
      min: [0, 'El ingreso anual no puede ser negativo'],
    },
    employees: {
      type: Number,
      min: [1, 'El número de empleados debe ser mayor a 0'],
    },

    // Direcciones
    billingAddress: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },

    // Jerarquía
    parentAccount: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },

    // Asignación
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    territory: {
      type: String,
      trim: true,
    },

    // Información adicional
    description: {
      type: String,
      maxlength: [2000, 'La descripción no puede exceder 2000 caracteres'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    isActive: {
      type: Boolean,
      default: true,
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

    // Campos personalizados
    customFields: {
      type: Map,
      of: Schema.Types.Mixed,
    },

    // Tracking
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastActivityDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
accountSchema.index({ name: 1 });
accountSchema.index({ accountNumber: 1 });
accountSchema.index({ type: 1 });
accountSchema.index({ industry: 1 });
accountSchema.index({ assignedTo: 1 });
accountSchema.index({ createdBy: 1 });
accountSchema.index({ parentAccount: 1 });
accountSchema.index({ isActive: 1 });
accountSchema.index({ createdAt: -1 });

// Text index for search
accountSchema.index({
  name: 'text',
  website: 'text',
  email: 'text',
  phone: 'text',
  description: 'text',
});

// Virtual for contacts
accountSchema.virtual('contacts', {
  ref: 'Contact',
  localField: '_id',
  foreignField: 'account',
});

// Virtual for deals
accountSchema.virtual('deals', {
  ref: 'Deal',
  localField: '_id',
  foreignField: 'account',
});

// Virtual for child accounts (subsidiaries)
accountSchema.virtual('childAccounts', {
  ref: 'Account',
  localField: '_id',
  foreignField: 'parentAccount',
});

// Pre-save middleware to generate account number
accountSchema.pre('save', async function (next) {
  if (this.isNew && !this.accountNumber) {
    const count = await mongoose.model('Account').countDocuments();
    this.accountNumber = `ACC-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

const Account = mongoose.model<IAccount>('Account', accountSchema);

export default Account;
