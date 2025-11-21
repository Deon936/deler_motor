import { Motorcycle } from '../types/motorcycle';
import { MotorcycleModel } from '../models/Motorcycle';

export class MotorcycleService {
  async getAllMotorcycles(): Promise<Motorcycle[]> {
    return MotorcycleModel.find();
  }

  async getMotorcycleById(id: number): Promise<Motorcycle | null> {
    return MotorcycleModel.findOne({ id });
  }

  async createMotorcycle(motorcycle: Motorcycle): Promise<Motorcycle> {
    return MotorcycleModel.create(motorcycle);
  }

  async updateMotorcycle(id: number, motorcycle: Partial<Motorcycle>): Promise<Motorcycle | null> {
    return MotorcycleModel.findOneAndUpdate({ id }, motorcycle, { new: true });
  }

  async deleteMotorcycle(id: number): Promise<boolean> {
    const result = await MotorcycleModel.deleteOne({ id });
    return result.deletedCount === 1;
  }
}