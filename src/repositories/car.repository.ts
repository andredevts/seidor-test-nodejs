import { PrismaSingleton } from "../../src/infra/prismaClient";
import { DomainCarDTO } from "../dtos/car.dto";
import { CarEntity } from "../entities/car.entity";

export class CarRepository {
  private readonly prisma = PrismaSingleton.getSession();

  async createCar(data: CarEntity) {
    return this.prisma.car.create({ data });
  }

  async updateCar(id: string, data: DomainCarDTO) {
    return this.prisma.car.update({ where: { id }, data });
  }

  async deleteCar(id: string) {
    return this.prisma.car.delete({ where: { id } });
  }

  async findById(id: string) {
    return this.prisma.car.findUnique({ where: { id } });
  }

  async findAll(filters?: { color?: string; brand?: string }) {
    const where: any = {};

    if (filters?.color) where.color = { equals: filters.color };

    if (filters?.brand) where.brand = { equals: filters.brand };

    return this.prisma.car.findMany({ where, orderBy: { createdAt: "desc" } });
  }

  async findByPlate(plate: string) {
    return this.prisma.car.findUnique({ where: { plate } });
  }
}
