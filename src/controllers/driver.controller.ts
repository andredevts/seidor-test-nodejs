import { Request, Response, NextFunction } from "express";
import { DriverService } from "../services/driver.service";
import {
  driverCreateSchema,
  driverUpdateSchema,
} from "../validators/driver.validator";
import { AppError } from "../errors/appError";
import { StatusCodes } from "http-status-codes";

const service = new DriverService();

export class DriverController {
  static async createDriver(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = driverCreateSchema.safeParse(req.body);

      if (!parsed.success)
        throw new AppError(parsed.error.message, StatusCodes.BAD_REQUEST);

      const driver = await service.createDriver(parsed.data);

      return res.status(StatusCodes.CREATED).json(driver);
    } catch (err) {
      next(err);
    }
  }

  static async updateDriver(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const parsed = driverUpdateSchema.safeParse(req.body);

      if (!parsed.success)
        throw new AppError(parsed.error.message, StatusCodes.BAD_REQUEST);

      const updated = await service.updateDriver(id, parsed.data);

      return res.status(StatusCodes.OK).json(updated);
    } catch (err) {
      next(err);
    }
  }

  static async deleteDriver(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const deletedCar = await service.deleteDriverById(id);

      return res.status(StatusCodes.OK).send(deletedCar);
    } catch (err) {
      next(err);
    }
  }

  static async getDriver(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const driver = await service.getDriverById(id);

      return res.status(StatusCodes.OK).send(driver);
    } catch (err) {
      next(err);
    }
  }

  static async listAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.query;

      const filter: any = {};

      if (name) filter.name = String(name);

      const listAllDrivers = await service.listAll(filter);

      return res.status(StatusCodes.OK).send(listAllDrivers);
    } catch (err) {
      next(err);
    }
  }
}
