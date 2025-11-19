import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  description: string;
  type: 'house' | 'apartment' | 'land' | 'commercial' | 'office';
  status: 'available' | 'reserved' | 'sold' | 'rented';
  price: number;
  currency: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  features: {
    bedrooms?: number;
    bathrooms?: number;
    area: number;
    areaUnit: 'sqm' | 'sqft';
    parking?: number;
    floors?: number;
  };
  amenities: string[];
  images: string[];
  documents: {
    name: string;
    url: string;
    type: string;
  }[];
  owner?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
  {
    title: {
      type: String,
      required: [true, 'El título es requerido'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'La descripción es requerida'],
    },
    type: {
      type: String,
      enum: ['house', 'apartment', 'land', 'commercial', 'office'],
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'sold', 'rented'],
      default: 'available',
    },
    price: {
      type: Number,
      required: [true, 'El precio es requerido'],
    },
    currency: {
      type: String,
      default: 'USD',
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String },
      country: { type: String, required: true },
    },
    features: {
      bedrooms: { type: Number },
      bathrooms: { type: Number },
      area: { type: Number, required: true },
      areaUnit: { type: String, enum: ['sqm', 'sqft'], default: 'sqm' },
      parking: { type: Number },
      floors: { type: Number },
    },
    amenities: [{ type: String }],
    images: [{ type: String }],
    documents: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String },
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProperty>('Property', propertySchema);
