import { Request, Response, NextFunction } from "express";
import { DriverService } from "../services/driver.service";
import {
  driverCreateSchema,
  driverUpdateSchema,
} from "../validators/driver.validator";
import { AppError } from "../errors/appError";

const service = new DriverService();

export class DriverController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = driverCreateSchema.safeParse(req.body);

      if (!parsed.success) throw new AppError(parsed.error.message, 400);

      const driver = await service.createDriver(parsed.data);

      return res.status(201).json(driver);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const parsed = driverUpdateSchema.safeParse(req.body);

      if (!parsed.success) throw new AppError(parsed.error.message, 400);

      const updated = await service.updateDriver(id, parsed.data);

      return res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await service.deleteDriverById(id);

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const driver = await service.getDriverById(id);

      return res.json(driver);
    } catch (err) {
      next(err);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.query;

      const filter: any = {};

      if (name) filter.name = String(name);

      const list = await service.listAll(filter);

      return res.json(list);
    } catch (err) {
      next(err);
    }
  }
}
