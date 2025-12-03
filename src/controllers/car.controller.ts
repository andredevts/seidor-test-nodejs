import { Request, Response, NextFunction } from "express";
import { CarService } from "../services/car.service";
import { carCreateSchema, carUpdateSchema } from "../validators/car.validator";
import { AppError } from "../errors/appError";
import { RequestCarDTO } from "../dtos/car.dto";
import { StatusCodes } from "http-status-codes";
import { driverUpdateSchema } from "../validators/driver.validator";

const service = new CarService();

export class CarController {
  static async createCar(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = carCreateSchema.safeParse(req.body);

      if (!parsed.success)
        throw new AppError("Field invalid", StatusCodes.BAD_REQUEST);

      const dto: RequestCarDTO = {
        plate: parsed.data.plate,
        color: parsed.data.color,
        brand: parsed.data.brand,
      };

      const createCar = await service.createCar(dto);

      return res.status(StatusCodes.CREATED).json(createCar);
    } catch (err) {
      next(err);
    }
  }

  static async updateCar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const parsed = carUpdateSchema.safeParse(req.body);

      if (!parsed.success)
        throw new AppError("Field invalid", StatusCodes.BAD_REQUEST);

      const dto: RequestCarDTO = {
        plate: parsed.data.plate,
        color: parsed.data.color,
        brand: parsed.data.brand,
      };

      const updatedCar = await service.updateCar(id, dto);

      return res.status(StatusCodes.OK).json(updatedCar);
    } catch (err) {
      next(err);
    }
  }

  static async deleteCar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const deletedCar = await service.deleteCarById(id);

      return res.status(StatusCodes.OK).json(deletedCar);
    } catch (err) {
      next(err);
    }
  }

  static async getCarById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const getCar = await service.getCarById(id);

      return res.status(StatusCodes.OK).json(getCar);
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

      const listAllCars = await service.listAll(filters);

      return res.status(StatusCodes.OK).json(listAllCars);
    } catch (err) {
      next(err);
    }
  }
}
