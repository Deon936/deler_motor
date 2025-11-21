import { MotorcycleService } from '../services/motorcycleService';
import { MotorcycleModel } from '../models/Motorcycle';
import { Motorcycle } from '../types/motorcycle';

// Mock the Mongoose model
jest.mock('../models/Motorcycle');

describe('MotorcycleService', () => {
  let motorcycleService: MotorcycleService;
  
  const mockMotorcycle: Motorcycle = {
    id: 1,
    name: 'Honda CBR150R',
    category: 'sport',
    price: 38000000,
    image: 'test-image.jpg',
    specs: '150cc | 17.1 HP | 6-Speed',
    available: true
  };

  beforeEach(() => {
    motorcycleService = new MotorcycleService();
    jest.clearAllMocks();
  });

  describe('getAllMotorcycles', () => {
    it('should return all motorcycles', async () => {
      (MotorcycleModel.find as jest.Mock).mockResolvedValue([mockMotorcycle]);
      
      const result = await motorcycleService.getAllMotorcycles();
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockMotorcycle);
      expect(MotorcycleModel.find).toHaveBeenCalled();
    });
  });

  describe('getMotorcycleById', () => {
    it('should return motorcycle by id', async () => {
      (MotorcycleModel.findOne as jest.Mock).mockResolvedValue(mockMotorcycle);
      
      const result = await motorcycleService.getMotorcycleById(1);
      
      expect(result).toEqual(mockMotorcycle);
      expect(MotorcycleModel.findOne).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null if motorcycle not found', async () => {
      (MotorcycleModel.findOne as jest.Mock).mockResolvedValue(null);
      
      const result = await motorcycleService.getMotorcycleById(999);
      
      expect(result).toBeNull();
    });
  });

  describe('createMotorcycle', () => {
    it('should create new motorcycle', async () => {
      (MotorcycleModel.create as jest.Mock).mockResolvedValue(mockMotorcycle);
      
      const result = await motorcycleService.createMotorcycle(mockMotorcycle);
      
      expect(result).toEqual(mockMotorcycle);
      expect(MotorcycleModel.create).toHaveBeenCalledWith(mockMotorcycle);
    });
  });

  describe('updateMotorcycle', () => {
    it('should update existing motorcycle', async () => {
      const update = { price: 39000000 };
      const updatedMotorcycle = { ...mockMotorcycle, ...update };
      
      (MotorcycleModel.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedMotorcycle);
      
      const result = await motorcycleService.updateMotorcycle(1, update);
      
      expect(result).toEqual(updatedMotorcycle);
      expect(MotorcycleModel.findOneAndUpdate).toHaveBeenCalledWith(
        { id: 1 },
        update,
        { new: true }
      );
    });
  });

  describe('deleteMotorcycle', () => {
    it('should delete existing motorcycle', async () => {
      (MotorcycleModel.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });
      
      const result = await motorcycleService.deleteMotorcycle(1);
      
      expect(result).toBe(true);
      expect(MotorcycleModel.deleteOne).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return false if motorcycle not found', async () => {
      (MotorcycleModel.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 0 });
      
      const result = await motorcycleService.deleteMotorcycle(999);
      
      expect(result).toBe(false);
    });
  });
});