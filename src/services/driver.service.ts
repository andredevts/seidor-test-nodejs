import { DriverRepository } from "../repositories/driver.repository";
import {
  RequestDriverDTO,
  DomainDriverDTO,
  ResponseDriverDTO,
} from "../dtos/driver.dto";
import { AppError } from "../errors/appError";
import { StatusCodes } from "http-status-codes";

export class DriverService {
  constructor(private readonly repo = new DriverRepository()) {}

  async createDriver(data: RequestDriverDTO): Promise<ResponseDriverDTO> {
    const driverEntity = await this.repo.createDriver(data);

    const createdDriver: ResponseDriverDTO = {
      id: driverEntity.id,
      name: driverEntity.name,
      createdAt: driverEntity.createdAt,
      updatedAt: driverEntity.updatedAt,
    };

    return createdDriver;
  }

  async updateDriver(
    id: string,
    data: RequestDriverDTO
  ): Promise<ResponseDriverDTO> {
    const existingDriver = await this.repo.findById(id);

    if (!existingDriver)
      throw new AppError("Driver not found", StatusCodes.NOT_FOUND);

    const updateDriver: DomainDriverDTO = {
      name: data.name,
    };

    const driverEntity = await this.repo.updateDriver(id, updateDriver);

    const updatedDriver: ResponseDriverDTO = {
      id: driverEntity.id,
      name: driverEntity.name,
      createdAt: driverEntity.createdAt,
      updatedAt: driverEntity.updatedAt,
    };

    return updatedDriver;
  }

  async deleteDriverById(id: string): Promise<ResponseDriverDTO> {
    const existingDriver = await this.repo.findById(id);

    if (!existingDriver)
      throw new AppError("Driver not found", StatusCodes.NOT_FOUND);

    const driverEntity = await this.repo.deleteDriver(id);

    const deletedDriver: ResponseDriverDTO = {
      id: driverEntity.id,
      name: driverEntity.name,
      createdAt: driverEntity.createdAt,
      updatedAt: driverEntity.updatedAt,
    };

    return deletedDriver;
  }

  async getDriverById(id: string): Promise<ResponseDriverDTO> {
    const existingDriver = await this.repo.findById(id);

    if (!existingDriver)
      throw new AppError("Driver not found", StatusCodes.NOT_FOUND);

    const existDriver: ResponseDriverDTO = {
      id: existingDriver.id,
      name: existingDriver.name,
      createdAt: existingDriver.createdAt,
      updatedAt: existingDriver.updatedAt,
    };

    return existDriver;
  }

  async listAll(filter?: { name?: string }): Promise<ResponseDriverDTO[]> {
    const listDriverEntity = await this.repo.findAll(filter);

    const listAllDrivers: ResponseDriverDTO[] = listDriverEntity.map(
      (driver) => ({
        id: driver.id,
        name: driver.name,
        createdAt: driver.createdAt,
        updatedAt: driver.updatedAt,
      })
    );

    return listAllDrivers;
  }
}
