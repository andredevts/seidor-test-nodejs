import { DriverRepository } from "../repositories/driver.repository";
import { RequestDriverDTO, DomainDriverDTO } from "../dtos/driver.dto";
import { AppError } from "../errors/appError";

export class DriverService {
  constructor(private readonly repo = new DriverRepository()) {}

  async createDriver(data: RequestDriverDTO) {
    return this.repo.createDriver(data);
  }

  async updateDriver(id: string, data: RequestDriverDTO) {
    const existingDriver = await this.repo.findById(id);

    if (!existingDriver) throw new AppError("Driver not found", 404);

    const updateDriver: DomainDriverDTO = {
      name: data.name,
    };

    return this.repo.updateDriver(id, updateDriver);
  }

  async deleteDriver(id: string) {
    const existingDriver = await this.repo.findById(id);

    if (!existingDriver) throw new AppError("Driver not found", 404);

    return this.repo.deleteDriver(id);
  }

  async getDriver(id: string) {
    const existingDriver = await this.repo.findById(id);

    if (!existingDriver) throw new AppError("Driver not found", 404);

    return existingDriver;
  }

  async listAll(filter?: { name?: string }) {
    return this.repo.findAll(filter);
  }
}
