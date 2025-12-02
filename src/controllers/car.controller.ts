import { Request, Response, NextFunction } from "express";
import { CarService } from "../services/car.service";
import { carCreateSchema, carUpdateSchema } from "../validators/car.validator";
import { AppError } from "../errors/appError";
import { RequestCarDTO } from "../dtos/car.dto";

const service = new CarService();

export class CarController {
  static async createCar(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = carCreateSchema.safeParse(req.body);
      
      if (!parsed.success) throw new AppError(parsed.error.message, 400);

      const car = await service.createCar(parsed.data);

      return res.status(201).json(car);
    } catch (err) {
      next(err);
    }
  }

  static async updateCar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const parsed = carUpdateSchema.safeParse(req.body);

      if (!parsed.success) throw new AppError(parsed.error.message, 400);

      const updated = await service.updateCar(id, parsed.data);

      return res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  static async deleteCar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await service.deleteCarById(id);

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  static async getCarById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const car = await service.getCarById(id);

      return res.json(car);
    } catch (err) {
      next(err);
    }
  }

  static async listAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { color, brand } = req.query;

      const filters: RequestCarDTO = {};

      if (color) filters.color = color as string;

      if (brand) filters.brand = brand as string;

      const list = await service.listAll(filters);

      return res.json(list);
    } catch (err) {
      next(err);
    }
  }
}
