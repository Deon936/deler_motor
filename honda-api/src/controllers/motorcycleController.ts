import { Request, Response } from 'express';
import { MotorcycleService } from '../services/motorcycleService';

const motorcycleService = new MotorcycleService();

export class MotorcycleController {
  async getAll(req: Request, res: Response) {
    try {
      const motorcycles = await motorcycleService.getAllMotorcycles();
      res.json(motorcycles);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch motorcycles' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const motorcycle = await motorcycleService.getMotorcycleById(Number(req.params.id));
      if (!motorcycle) {
        return res.status(404).json({ error: 'Motorcycle not found' });
      }
      res.json(motorcycle);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch motorcycle' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const motorcycle = await motorcycleService.createMotorcycle(req.body);
      res.status(201).json(motorcycle);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create motorcycle' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const motorcycle = await motorcycleService.updateMotorcycle(Number(req.params.id), req.body);
      if (!motorcycle) {
        return res.status(404).json({ error: 'Motorcycle not found' });
      }
      res.json(motorcycle);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update motorcycle' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const success = await motorcycleService.deleteMotorcycle(Number(req.params.id));
      if (!success) {
        return res.status(404).json({ error: 'Motorcycle not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete motorcycle' });
    }
  }
}