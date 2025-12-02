import { TripRepository } from "../repositories/trip.repository";
import { CarRepository } from "../repositories/car.repository";
import { DriverRepository } from "../repositories/driver.repository";
import { RequestTripDTO } from "../dtos/trip.dto";
import { AppError } from "../errors/appError";
import { TripEntity } from "../entities/trip.entity";

export class TripService {
  constructor(
    private readonly tripRepo = new TripRepository(),
    private readonly carRepo = new CarRepository(),
    private readonly driverRepo = new DriverRepository()
  ) {}

  async createTrip(data: RequestTripDTO) {
    const existingCar = await this.carRepo.findById(data.carId);

    if (!existingCar) throw new AppError("Car not found", 404);

    const existingDriver = await this.driverRepo.findById(data.driverId);

    if (!existingDriver) throw new AppError("Driver not found", 404);

    const activeCar = await this.tripRepo.findActiveByCar(data.carId);

    if (activeCar) throw new AppError("Car is already in use", 409);

    const activeDriver = await this.tripRepo.findActiveByDriver(data.driverId);

    if (activeDriver) throw new AppError(`Driver with code ${activeDriver.id} is already using a car ${existingCar.id}`, 409);

    const start = new Date(data.startAt);

    if (Number.isNaN(start.getTime()))
      throw new AppError("Invalid startAt date", 400);

    const payload: TripEntity = {
      carId: data.carId,
      driverId: data.driverId,
      startAt: start,
      reason: data.reason,
    };

    return this.tripRepo.createTrip(payload);
  }

  async finishTrip(tripId: string, endAtStr: string) {
    const trip = await this.tripRepo.findById(tripId);

    if (!trip) throw new AppError("Trip record not found", 404);

    if (trip.endAt) throw new AppError("Trip already finished", 400);

    const endAt = new Date(endAtStr);

    if (Number.isNaN(endAt.getTime()))
      throw new AppError("Invalid endAt date", 400);

    if (endAt < trip.startAt)
      throw new AppError("endAt cannot be before startAt", 400);

    return this.tripRepo.updateEndAt(tripId, endAt);
  }

  async listAll() {
    return this.tripRepo.listAll();
  }

  async getTrip(id: string) {
    const trip = await this.tripRepo.findById(id);

    if (!trip) throw new AppError("Usage not found", 404);

    return trip;
  }
}
