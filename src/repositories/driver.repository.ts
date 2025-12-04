import { PrismaSingleton } from "../infra/prismaClient";
import { DomainDriverDTO } from "../dtos/driver.dto";
import { DriverEntity } from "../entities/driver.entity";

export class DriverRepository {
  private readonly prisma = PrismaSingleton.getSession();

  async createDriver(data: DriverEntity) {
    return this.prisma.driver.create({ data });
  }

  async updateDriver(id: string, data: DomainDriverDTO) {
    return this.prisma.driver.update({ where: { id }, data });
  }

  async deleteDriver(id: string) {
    return this.prisma.driver.delete({ where: { id } });
  }

  async findById(id: string) {
    return this.prisma.driver.findUnique({ where: { id } });
  }

  async findAll(filter?: { name?: string }) {
    const where: any = {};

    if (filter?.name)
      where.name = { contains: filter.name, mode: "insensitive" };

    return this.prisma.driver.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }
}
