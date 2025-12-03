import { CarRepository } from "../repositories/car.repository";
import { RequestCarDTO, DomainCarDTO, ResponseCarDTO } from "../dtos/car.dto";
import { AppError } from "../errors/appError";
import { CarEntity } from "../entities/car.entity";
import { StatusCodes } from "http-status-codes";

export class CarService {
  constructor(private readonly repo = new CarRepository()) {}

  async createCar(data: RequestCarDTO): Promise<ResponseCarDTO> {
    const existingCar = await this.repo.findByPlate(data.plate!);

    if (existingCar)
      throw new AppError(
        "Car with this plate already exists",
        StatusCodes.CONFLICT
      );

    const createdCar: CarEntity = {
      plate: data.plate!,
      color: data.color!,
      brand: data.brand!,
    };

    const newCarEntity = await this.repo.createCar(createdCar);

    const newCar: ResponseCarDTO = {
      id: newCarEntity.id,
      plate: newCarEntity.plate,
      color: newCarEntity.color,
      brand: newCarEntity.brand,
      createdAt: newCarEntity.createdAt,
      updatedAt: newCarEntity.updatedAt,
    };

    return newCar;
  }

  async updateCar(id: string, data: RequestCarDTO): Promise<ResponseCarDTO> {
    const existingCar = await this.repo.findById(id);

    if (!existingCar)
      throw new AppError("Car not found", StatusCodes.NOT_FOUND);

    if (data.plate && data.plate !== existingCar.plate) {
      const plateTaken = await this.repo.findByPlate(data.plate);

      if (plateTaken)
        throw new AppError("Plate already taken", StatusCodes.CONFLICT);
    }

    const updatePayload: DomainCarDTO = {
      plate: data.plate,
      color: data.color,
      brand: data.brand,
    };

    const newCarEntity = await this.repo.updateCar(id, updatePayload);

    const updatedCar: ResponseCarDTO = {
      id: newCarEntity.id,
      plate: newCarEntity.plate,
      color: newCarEntity.color,
      brand: newCarEntity.brand,
      createdAt: newCarEntity.createdAt,
      updatedAt: newCarEntity.updatedAt,
    };

    return updatedCar;
  }

  async deleteCarById(id: string): Promise<ResponseCarDTO> {
    const existingCar = await this.repo.findById(id);

    if (!existingCar)
      throw new AppError("Car not found", StatusCodes.NOT_FOUND);

    const newCarEntity = await this.repo.deleteCar(id);

    const deletedCar: ResponseCarDTO = {
      id: newCarEntity.id,
      plate: newCarEntity.plate,
      color: newCarEntity.color,
      brand: newCarEntity.brand,
      createdAt: newCarEntity.createdAt,
      updatedAt: newCarEntity.updatedAt,
    };

    return deletedCar;
  }

  async getCarById(id: string): Promise<ResponseCarDTO> {
    const existingCar = await this.repo.findById(id);

    if (!existingCar)
      throw new AppError("Car not found", StatusCodes.NOT_FOUND);

    const existCar: ResponseCarDTO = {
      id: existingCar.id,
      plate: existingCar.plate,
      color: existingCar.color,
      brand: existingCar.brand,
      createdAt: existingCar.createdAt,
      updatedAt: existingCar.updatedAt,
    };

    return existCar;
  }

  async listAll(filters?: {
    color?: string;
    brand?: string;
  }): Promise<ResponseCarDTO[]> {
    const listAllCars = await this.repo.findAll(filters);

    return listAllCars.map((car) => ({
      id: car.id,
      plate: car.plate,
      color: car.color,
      brand: car.brand,
      createdAt: car.createdAt,
      updatedAt: car.updatedAt,
    }));
  }
}
