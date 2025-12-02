import { PrismaSingleton } from "../infra/prismaClient";
import { TripEntity } from "../entities/trip.entity";

export class TripRepository {
  private readonly prisma = PrismaSingleton.getSession();

  async createTrip(data: TripEntity) {
    return this.prisma.trip.create({ data });
  }

  async updateEndAt(id: string, endAt: Date) {
    return this.prisma.trip.update({ where: { id }, data: { endAt } });
  }

  async findActiveByCar(carId: string) {
    return this.prisma.trip.findFirst({ where: { carId, endAt: null } });
  }

  async findActiveByDriver(driverId: string) {
    return this.prisma.trip.findFirst({ where: { driverId, endAt: null } });
  }

  async findById(id: string) {
    return this.prisma.trip.findUnique({ where: { id } });
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
