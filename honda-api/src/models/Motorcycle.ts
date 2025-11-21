import mongoose from 'mongoose';
import { Motorcycle } from '../types/motorcycle';

const motorcycleSchema = new mongoose.Schema<Motorcycle>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['sport', 'scooter', 'adventure'] },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  specs: { type: String, required: true },
  available: { type: Boolean, default: true }
});

export const MotorcycleModel = mongoose.model<Motorcycle>('Motorcycle', motorcycleSchema);