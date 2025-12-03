import { TripRepository } from "../repositories/trip.repository";
import { CarRepository } from "../repositories/car.repository";
import { DriverRepository } from "../repositories/driver.repository";
import { RequestTripDTO, ResponseTripDTO } from "../dtos/trip.dto";
import { AppError } from "../errors/appError";
import { TripEntity } from "../entities/trip.entity";
import { StatusCodes } from "http-status-codes";

export class TripService {
  constructor(
    private readonly tripRepo = new TripRepository(),
    private readonly carRepo = new CarRepository(),
    private readonly driverRepo = new DriverRepository()
  ) {}

  async createTrip(data: RequestTripDTO): Promise<ResponseTripDTO> {
    const existingCar = await this.carRepo.findById(data.carId);

    if (!existingCar)
      throw new AppError("Car not found", StatusCodes.NOT_FOUND);

    const existingDriver = await this.driverRepo.findById(data.driverId);

    if (!existingDriver)
      throw new AppError("Driver not found", StatusCodes.NOT_FOUND);

    const activeCar = await this.tripRepo.findActiveByCar(data.carId);

    if (activeCar)
      throw new AppError("Car is already in use", StatusCodes.CONFLICT);

    const activeDriver = await this.tripRepo.findActiveByDriver(data.driverId);

    if (activeDriver)
      throw new AppError(
        `Driver with code ${activeDriver.id} is already using a car ${existingCar.id}`,
        StatusCodes.CONFLICT
      );

    const start = new Date(data.startAt);

    if (Number.isNaN(start.getTime()))
      throw new AppError("Invalid startAt date", StatusCodes.BAD_REQUEST);

    const payload: TripEntity = {
      carId: data.carId,
      driverId: data.driverId,
      startAt: start,
      reason: data.reason,
    };

    const tripEntity = await this.tripRepo.createTrip(payload);

    const createdTrip: ResponseTripDTO = {
      id: tripEntity.id,
      carId: tripEntity.carId,
      driverId: tripEntity.driverId,
      startAt: tripEntity.startAt.toISOString(),
      endAt: tripEntity.endAt ? tripEntity.endAt.toISOString() : undefined,
      reason: tripEntity.reason,
      driver: {
        id: existingDriver.id,
        name: existingDriver.name,
        createdAt: existingDriver.createdAt,
        updatedAt: existingDriver.updatedAt,
      },
      car: {
        id: existingCar.id,
        plate: existingCar.plate,
        color: existingCar.color,
        brand: existingCar.brand,
        createdAt: existingCar.createdAt,
        updatedAt: existingCar.updatedAt,
      },
    };

    return createdTrip;
  }

  async finishTrip(tripId: string, endAtStr: string): Promise<ResponseTripDTO> {
    const existedTrip = await this.tripRepo.findById(tripId);

    if (!existedTrip)
      throw new AppError("Trip record not found", StatusCodes.NOT_FOUND);

    if (existedTrip.endAt)
      throw new AppError("Trip already finished", StatusCodes.BAD_REQUEST);

    const endAt = new Date(endAtStr);

    if (Number.isNaN(endAt.getTime()))
      throw new AppError("Invalid endAt date", StatusCodes.BAD_REQUEST);

    if (endAt < existedTrip.startAt)
      throw new AppError(
        "endAt cannot be before startAt",
        StatusCodes.BAD_REQUEST
      );

    const tripEntity = await this.tripRepo.updateEndAt(tripId, endAt);

    const finishedTrip: ResponseTripDTO = {
      id: tripEntity.id,
      carId: tripEntity.carId,
      driverId: tripEntity.driverId,
      startAt: tripEntity.startAt.toISOString(),
      endAt: tripEntity.endAt ? tripEntity.endAt.toISOString() : undefined,
      reason: tripEntity.reason,
      driver: {
        id: tripEntity.driver.id,
        name: tripEntity.driver.name,
        createdAt: tripEntity.driver.createdAt,
        updatedAt: tripEntity.driver.updatedAt,
      },
      car: {
        id: tripEntity.car.id,
        plate: tripEntity.car.plate,
        color: tripEntity.car.color,
        brand: tripEntity.car.brand,
        createdAt: tripEntity.car.createdAt,
        updatedAt: tripEntity.car.updatedAt,
      },
    };

    return finishedTrip;
  }

  async listAll(): Promise<ResponseTripDTO[]> {
    const listTripEntity = await this.tripRepo.listAll();

    const listAllTrips: ResponseTripDTO[] = listTripEntity.map((trip) => ({
      id: trip.id,
      carId: trip.carId,
      driverId: trip.driverId,
      startAt: trip.startAt.toISOString(),
      endAt: trip.endAt ? trip.endAt.toISOString() : undefined,
      reason: trip.reason,
      driver: {
        id: trip.driver.id,
        name: trip.driver.name,
        createdAt: trip.driver.createdAt,
        updatedAt: trip.driver.updatedAt,
      },
      car: {
        id: trip.car.id,
        plate: trip.car.plate,
        color: trip.car.color,
        brand: trip.car.brand,
        createdAt: trip.car.createdAt,
        updatedAt: trip.car.updatedAt,
      },
    }));

    return listAllTrips;
  }

  async getTrip(id: string): Promise<ResponseTripDTO> {
    const exitedTrip = await this.tripRepo.findById(id);

    if (!exitedTrip)
      throw new AppError("Usage not found", StatusCodes.NOT_FOUND);

    const trip: ResponseTripDTO = {
      id: exitedTrip.id,
      carId: exitedTrip.carId,
      driverId: exitedTrip.driverId,
      startAt: exitedTrip.startAt.toISOString(),
      endAt: exitedTrip.endAt ? exitedTrip.endAt.toISOString() : undefined,
      reason: exitedTrip.reason,
      driver: {
        id: exitedTrip.driver.id,
        name: exitedTrip.driver.name,
        createdAt: exitedTrip.driver.createdAt,
        updatedAt: exitedTrip.driver.updatedAt,
      },
      car: {
        id: exitedTrip.car.id,
        plate: exitedTrip.car.plate,
        color: exitedTrip.car.color,
        brand: exitedTrip.car.brand,
        createdAt: exitedTrip.car.createdAt,
        updatedAt: exitedTrip.car.updatedAt,
      },
    };

    return trip;
  }
}
