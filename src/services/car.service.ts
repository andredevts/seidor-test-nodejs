import { CarRepository } from "../repositories/car.repository";
import { RequestCarDTO, DomainCarDTO } from "../dtos/car.dto";
import { AppError } from "../errors/appError";
import { CarEntity } from "../entities/car.entity";
import { StatusCodes } from "http-status-codes";

export class CarService {
  constructor(private readonly repo = new CarRepository()) {}

  async createCar(data: RequestCarDTO) {
    const existingCar = await this.repo.findByPlate(data.plate!);

    if (existingCar)
      throw new AppError("Car with this plate already exists", StatusCodes.CONFLICT);

    const createdCar: CarEntity = {
      plate: data.plate!,
      color: data.color!,
      brand: data.brand!,
    };

    return this.repo.createCar(createdCar);
  }

  async updateCar(id: string, data: RequestCarDTO) {
    const existingCar = await this.repo.findById(id);

    if (!existingCar) throw new AppError("Car not found", StatusCodes.NOT_FOUND);

    if (data.plate && data.plate !== existingCar.plate) {
      const plateTaken = await this.repo.findByPlate(data.plate);

      if (plateTaken) throw new AppError("Plate already taken", StatusCodes.CONFLICT);
    }

    const updatedCar: DomainCarDTO = {
      plate: data.plate,
      color: data.color,
      brand: data.brand,
    };

    return this.repo.updateCar(id, updatedCar);
  }

  async deleteCarById(id: string) {
    const existingCar = await this.repo.findById(id);

    if (!existingCar) throw new AppError("Car not found", StatusCodes.NOT_FOUND);

    return this.repo.deleteCar(id);
  }

  async getCarById(id: string) {
    const existingCar = await this.repo.findById(id);

    if (!existingCar) throw new AppError("Car not found", StatusCodes.NOT_FOUND);

    return existingCar;
  }

  async listAll(filters?: { color?: string; brand?: string }) {
    return this.repo.findAll(filters);
  }
}
