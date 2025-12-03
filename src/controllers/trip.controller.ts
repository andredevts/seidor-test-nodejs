import { Request, Response, NextFunction } from "express";
import { TripService } from "../services/trip.service";
import {
  tripCreateSchema,
  tripFinishSchema,
} from "../validators/trip.validator";
import { AppError } from "../errors/appError";
import { StatusCodes } from "http-status-codes";
import { RequestTripDTO } from "../dtos/trip.dto";

const tripService = new TripService();

export class TripController {
  static async createTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = tripCreateSchema.safeParse(req.body);

      if (!parsed.success)
        throw new AppError("Field invalid", StatusCodes.BAD_REQUEST);

      const dto: RequestTripDTO = {
        carId: parsed.data.carId,
        driverId: parsed.data.driverId,
        startAt: parsed.data.startAt,
        reason: parsed.data.reason,
      };

      const trip = await tripService.createTrip(dto);

      return res.status(StatusCodes.CREATED).json(trip);
    } catch (err) {
      next(err);
    }
  }

  static async finishTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const parsed = tripFinishSchema.safeParse(req.body);

      if (!parsed.success)
        throw new AppError("Field invalid", StatusCodes.BAD_REQUEST);

      const finished = await tripService.finishTrip(id, parsed.data.endAt);

      return res.json(finished);
    } catch (err) {
      next(err);
    }
  }

  static async listAll(req: Request, res: Response, next: NextFunction) {
    try {
      const listTrip = await tripService.listAll();

      const mapped = listTrip.map((trip: any) => ({
        id: trip.id,
        startAt: trip.startAt,
        endAt: trip.endAt,
        reason: trip.reason,
        driver: { id: trip.driver.id, name: trip.driver.name },
        car: {
          id: trip.car.id,
          plate: trip.car.plate,
          brand: trip.car.brand,
          color: trip.car.color,
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
