import { PrismaSingleton } from "../infra/prismaClient";
import { TripEntity } from "../entities/trip.entity";

export class TripRepository {
  private readonly prisma = PrismaSingleton.getSession();

  async createTrip(data: TripEntity) {
    return this.prisma.trip.create({
      data,
      include: {
        driver: true,
        car: true,
      },
    });
  }

  async updateEndAt(id: string, endAt: Date) {
    return this.prisma.trip.update({
      where: { id },
      data: { endAt },
      include: {
        driver: true,
        car: true,
      },
    });
  }

  async findActiveByCar(carId: string) {
    return this.prisma.trip.findFirst({
      where: { carId, endAt: null },
      include: {
        driver: true,
        car: true,
      },
    });
  }

  async findActiveByDriver(driverId: string) {
    return this.prisma.trip.findFirst({
      where: { driverId, endAt: null },
      include: {
        driver: true,
        car: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.trip.findUnique({
      where: { id },
      include: {
        driver: true,
        car: true,
      },
    });
  }

  async listAll() {
    return this.prisma.trip.findMany({
      include: {
        driver: true,
        car: true,
      },
      orderBy: { startAt: "desc" },
    });
  }
}
