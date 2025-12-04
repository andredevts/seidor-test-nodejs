import { mockDeep, DeepMockProxy } from "vitest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { PrismaSingleton } from "../infra/prismaClient";
import { TripRepository } from "./trip.repository";
import { Mock } from "vitest";

vi.mock("../infra/prismaClient", () => ({
  PrismaSingleton: {
    getSession: vi.fn(),
  },
}));

describe("TripRepository", () => {
  let prismaMock: DeepMockProxy<PrismaClient>;
  let repository: TripRepository;

  beforeAll(() => {
    prismaMock = mockDeep<PrismaClient>();
    (PrismaSingleton.getSession as Mock).mockReturnValue(prismaMock);
    repository = new TripRepository();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should create the trip", async () => {
    const data = {
      id: "trip1",
      carId: "car1",
      driverId: "driver1",
      reason: "Business",
      startAt: new Date(),
      endAt: null,
    };

    prismaMock.trip.create.mockResolvedValue({ ...data } as any);

    const result = await repository.createTrip(data);

    expect(prismaMock.trip.create).toHaveBeenCalledWith({
      data,
      include: {
        driver: true,
        car: true,
      },
    });
    expect(result).toEqual(data);
  });

  test("should update the end of trip", async () => {
    const endAt = new Date();
    const updated = {
      id: "trip1",
      carId: "car1",
      driverId: "driver1",
      startAt: new Date(),
      endAt,
    };

    prismaMock.trip.update.mockResolvedValue(updated as any);

    const result = await repository.updateEndAt("trip1", endAt);

    expect(prismaMock.trip.update).toHaveBeenCalledWith({
      where: { id: "trip1" },
      data: { endAt },
      include: {
        driver: true,
        car: true,
      },
    });
    expect(result).toEqual(updated);
  });

  test("should findActiveByCar return an active trip for the car", async () => {
    const trip = { id: "trip1" };

    prismaMock.trip.findFirst.mockResolvedValue(trip as any);

    const result = await repository.findActiveByCar("car123");

    expect(prismaMock.trip.findFirst).toHaveBeenCalledWith({
      where: { carId: "car123", endAt: null },
      include: {
        driver: true,
        car: true,
      },
    });
    expect(result).toEqual(trip);
  });

  test("should findActiveByDriver return an active trip for the driver", async () => {
    const trip = { id: "trip1" };

    prismaMock.trip.findFirst.mockResolvedValue(trip as any);

    const result = await repository.findActiveByDriver("driver123");

    expect(prismaMock.trip.findFirst).toHaveBeenCalledWith({
      where: { driverId: "driver123", endAt: null },
      include: {
        driver: true,
        car: true,
      },
    });
    expect(result).toEqual(trip);
  });

  test("should findById search for trips by ID", async () => {
    const trip = { id: "trip1" };

    prismaMock.trip.findUnique.mockResolvedValue(trip as any);

    const result = await repository.findById("trip1");

    expect(prismaMock.trip.findUnique).toHaveBeenCalledWith({
      where: { id: "trip1" },
      include: {
        driver: true,
        car: true,
      },
    });
    expect(result).toEqual(trip);
  });

  test("should listAll list all trips in sorted order", async () => {
    const trips = [{ id: "trip1" }, { id: "trip2" }];

    prismaMock.trip.findMany.mockResolvedValue(trips as any);

    const result = await repository.listAll();

    expect(prismaMock.trip.findMany).toHaveBeenCalledWith({
      include: {
        driver: true,
        car: true,
      },
      orderBy: { startAt: "desc" },
    });
    expect(result).toEqual(trips);
  });
});
