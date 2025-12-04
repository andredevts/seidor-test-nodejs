import { TripService } from "./../services/trip.service";
import { TripRepository } from "./../repositories/trip.repository";
import { CarRepository } from "./../repositories/car.repository";
import { DriverRepository } from "./../repositories/driver.repository";
import { mock } from "vitest-mock-extended";
import { faker } from "@faker-js/faker";
import { AppError } from "./../errors/appError";
import { StatusCodes } from "http-status-codes";

describe("TripService", () => {
  const tripRepoMock = mock<TripRepository>();
  const carRepoMock = mock<CarRepository>();
  const driverRepoMock = mock<DriverRepository>();

  let service: TripService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new TripService(tripRepoMock, carRepoMock, driverRepoMock);
  });

  const fakeCar = () => ({
    id: faker.string.uuid(),
    plate: faker.string.alphanumeric(7),
    color: faker.vehicle.color(),
    brand: faker.vehicle.manufacturer(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  });

  const fakeDriver = () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  });

  const car = fakeCar();
  const driver = fakeDriver();

  const fakeTrip = (withEndAtTrue = false) => ({
    id: faker.string.uuid(),
    carId: car.id,
    driverId: driver.id,
    startAt: faker.date.past(),
    endAt: withEndAtTrue ? faker.date.recent() : null,
    reason: faker.lorem.sentence(),
    car: car,
    driver: driver,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  });

  const trip = fakeTrip();

  it("should create a new trip", async () => {
    const dto = {
      id: trip.id,
      carId: car.id,
      startAt: trip.startAt,
      driverId: driver.id,
      reason: trip.reason,
    };

    tripRepoMock.findActiveByCar.mockResolvedValue(null);
    tripRepoMock.findActiveByDriver.mockResolvedValue(null);
    carRepoMock.findById.mockResolvedValue(car);
    driverRepoMock.findById.mockResolvedValue(driver);

    tripRepoMock.createTrip.mockResolvedValue(trip);

    const result = await service.createTrip(dto);

    expect(carRepoMock.findById).toHaveBeenCalledWith(dto.carId);
    expect(driverRepoMock.findById).toHaveBeenCalledWith(dto.driverId);
    expect(tripRepoMock.findActiveByCar).toHaveBeenCalledWith(dto.carId);
    expect(tripRepoMock.findActiveByDriver).toHaveBeenCalledWith(dto.driverId);
    expect(tripRepoMock.createTrip).toHaveBeenCalled();

    expect(result).toHaveProperty("id");
    expect(trip.carId).toBe(dto.carId);
    expect(result.carId).toBe(dto.carId);
  });

  it("should throw if car does not exist", async () => {
    carRepoMock.findById.mockResolvedValue(null);

    const dto: any = {
      carId: faker.string.uuid(),
      driverId: faker.string.uuid(),
      startAt: faker.date.recent().toISOString(),
      reason: "test",
    };

    await expect(service.createTrip(dto)).rejects.toEqual(
      new AppError("Car not found", StatusCodes.NOT_FOUND)
    );
  });

  it("should throw if driver does not exist", async () => {
    const car = fakeCar();
    carRepoMock.findById.mockResolvedValue(car);
    driverRepoMock.findById.mockResolvedValue(null);

    const dto: any = {
      carId: car.id,
      driverId: faker.string.uuid(),
      startAt: faker.date.recent().toISOString(),
      reason: "test",
    };

    await expect(service.createTrip(dto)).rejects.toEqual(
      new AppError("Driver not found", StatusCodes.NOT_FOUND)
    );
  });

  it("should throw if car already has an active trip", async () => {
    const car = fakeCar();

    carRepoMock.findById.mockResolvedValue(car);

    const driver = fakeDriver();

    driverRepoMock.findById.mockResolvedValue(driver);

    tripRepoMock.findActiveByCar.mockResolvedValue(fakeTrip());

    const dto: any = {
      carId: car.id,
      driverId: driver.id,
      startAt: faker.date.recent().toISOString(),
      reason: "test",
    };

    await expect(service.createTrip(dto)).rejects.toEqual(
      new AppError("Car is already in use", StatusCodes.CONFLICT)
    );
  });

  it("should throw if driver already has an active trip", async () => {
    const car = fakeCar();

    carRepoMock.findById.mockResolvedValue(car);

    const driver = fakeDriver();

    driverRepoMock.findById.mockResolvedValue(driver);

    tripRepoMock.findActiveByCar.mockResolvedValue(null);
    tripRepoMock.findActiveByDriver.mockResolvedValue(fakeTrip());

    const dto: any = {
      carId: car.id,
      driverId: driver.id,
      startAt: faker.date.recent().toISOString(),
      reason: "test",
    };

    await expect(service.createTrip(dto)).rejects.toBeInstanceOf(AppError);
  });

  it("should throw if startAt is invalid", async () => {
    const car = fakeCar();
    const driver = fakeDriver();

    carRepoMock.findById.mockResolvedValue(car);
    driverRepoMock.findById.mockResolvedValue(driver);
    tripRepoMock.findActiveByCar.mockResolvedValue(null);
    tripRepoMock.findActiveByDriver.mockResolvedValue(null);

    const dto: any = {
      carId: car.id,
      driverId: driver.id,
      startAt: "data_invalida",
      reason: "test",
    };

    await expect(service.createTrip(dto)).rejects.toEqual(
      new AppError("Invalid startAt date", StatusCodes.BAD_REQUEST)
    );
  });

  it("should finish a trip", async () => {
    let trip2 = fakeTrip(false);
    
    tripRepoMock.findById.mockResolvedValue(trip2);

    const endAt = faker.date.recent();
    const finished = { ...trip, endAt };

    tripRepoMock.updateEndAt.mockResolvedValue(finished);

    const result = await service.finishTrip(trip.id, endAt.toISOString());

    expect(result.endAt).toBe(endAt);
    expect(tripRepoMock.updateEndAt).toHaveBeenCalledWith(trip.id, endAt);
  });

  it("should throw if trip not found", async () => {
    tripRepoMock.findById.mockResolvedValue(null);

    await expect(
      service.finishTrip(faker.string.uuid(), faker.date.recent().toISOString())
    ).rejects.toEqual(
      new AppError("Trip record not found", StatusCodes.NOT_FOUND)
    );
  });

  it("should throw if trip already finished", async () => {
    const trip = { ...fakeTrip(), endAt: faker.date.recent() };

    tripRepoMock.findById.mockResolvedValue(trip);

    await expect(
      service.finishTrip(trip.id, faker.date.recent().toISOString())
    ).rejects.toEqual(
      new AppError("Trip already finished", StatusCodes.BAD_REQUEST)
    );
  });

  it("should throw if endAt is invalid", async () => {
    const trip = fakeTrip();

    tripRepoMock.findById.mockResolvedValue(trip);

    await expect(service.finishTrip(trip.id, "invalid")).rejects.toEqual(
      new AppError("Invalid endAt date", StatusCodes.BAD_REQUEST)
    );
  });

  it("should throw if endAt is before startAt", async () => {
    const trip = fakeTrip();

    trip.startAt = new Date();

    tripRepoMock.findById.mockResolvedValue(trip);

    const past = faker.date.past().toISOString();

    await expect(service.finishTrip(trip.id, past)).rejects.toEqual(
      new AppError("endAt cannot be before startAt", StatusCodes.BAD_REQUEST)
    );
  });

  it("should return a single trip", async () => {
    const trip = fakeTrip();
    tripRepoMock.findById.mockResolvedValue(trip);

    const result = await service.getTrip(trip.id);

    expect(result).toHaveProperty("id");
    expect(result.id).toBe(trip.id);
  });

  it("should throw if trip not found (getTrip)", async () => {
    tripRepoMock.findById.mockResolvedValue(null);

    await expect(service.getTrip(faker.string.uuid())).rejects.toEqual(
      new AppError("Usage not found", StatusCodes.NOT_FOUND)
    );
  });

  it("should list all trips", async () => {
    const trips = [fakeTrip(), fakeTrip(), fakeTrip()];

    tripRepoMock.listAll.mockResolvedValue(trips);

    const result = await service.listAll();

    expect(result.length).toBe(3);
    expect(result[0]).toHaveProperty("id");
  });
});
