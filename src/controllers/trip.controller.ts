import { Request, Response, NextFunction } from "express";
import { TripService } from "../services/trip.service";
import {
  tripCreateSchema,
  tripFinishSchema,
} from "../validators/trip.validator";
import { AppError } from "../errors/appError";
import { StatusCodes } from "http-status-codes";

const tripService = new TripService();

export class TripController {
  static async createTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = tripCreateSchema.safeParse(req.body);

      if (!parsed.success) throw new AppError('Field invalid', StatusCodes.BAD_REQUEST);

      const trip = await tripService.createTrip(parsed.data);

      return res.status(StatusCodes.CREATED).json(trip);
    } catch (err) {
      next(err);
    }
  }

  static async finishTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const parsed = tripFinishSchema.safeParse(req.body);

      if (!parsed.success) throw new AppError('Field invalid', StatusCodes.BAD_REQUEST);

      const finished = await tripService.finishTrip(id, parsed.data.endAt);

      return res.json(finished);
    } catch (err) {
      next(err);
    }
  }

  static async listAll(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await tripService.listAll();

      const mapped = list.map((u: any) => ({
        id: u.id,
        startAt: u.startAt,
        endAt: u.endAt,
        reason: u.reason,
        driver: { id: u.driver.id, name: u.driver.name },
        car: {
          id: u.car.id,
          plate: u.car.plate,
          brand: u.car.brand,
          color: u.car.color,
        },
      }));

      return res.json(mapped);
    } catch (err) {
      next(err);
    }
  }

  static async getTripById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const trip = await tripService.getTrip(id);

      return res.json(trip);
    } catch (err) {
      next(err);
    }
  }
}
