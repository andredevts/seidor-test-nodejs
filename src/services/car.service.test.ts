import { CarService } from "./car.service";
import { CarRepository } from "./../repositories/car.repository";
import { mock } from "vitest-mock-extended";
import { faker } from "@faker-js/faker";
import { AppError } from "./../errors/appError";
import { StatusCodes } from "http-status-codes";
import { ResponseCarDTO } from "../dtos/car.dto";

describe("CarService", () => {
  const repoMock = mock<CarRepository>();
  const service = new CarService(repoMock);

  const fakeCar = () => ({
    id: faker.string.uuid(),
    plate: faker.string.alphanumeric(7).toUpperCase(),
    color: faker.vehicle.color(),
    brand: faker.vehicle.manufacturer(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  });

  describe("createCar", () => {
    it("should create a new car", async () => {
      const dto = {
        plate: fakeCar().plate,
        color: fakeCar().color,
        brand: fakeCar().brand,
      };

      const returnCar = () => ({
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      repoMock.findByPlate.mockResolvedValue(null);
      repoMock.createCar.mockResolvedValue(returnCar() as ResponseCarDTO);

      const result = await service.createCar(dto);

      expect(repoMock.findByPlate).toHaveBeenCalledWith(dto.plate);
      expect(repoMock.createCar).toHaveBeenCalled();
      expect(result).toHaveProperty("id");
      expect(result.plate).toBe(dto.plate);
    });

    it("should throw if plate already exists", async () => {
      const dto = {
        plate: "ABC1234",
        color: "red",
        brand: "Fiat",
      };

      repoMock.findByPlate.mockResolvedValue(fakeCar());

      await expect(service.createCar(dto)).rejects.toEqual(
        new AppError("Car with this plate already exists", StatusCodes.CONFLICT)
      );
    });
  });

  describe("updateCar", () => {
    it("should update an existing car", async () => {
      const existing = fakeCar();
      const updated = { ...existing, color: "black" };

      repoMock.findById.mockResolvedValue(existing);
      repoMock.findByPlate.mockResolvedValue(null);
      repoMock.updateCar.mockResolvedValue(updated);

      const result = await service.updateCar(existing.id, { color: "black" });

      expect(repoMock.findById).toHaveBeenCalledWith(existing.id);
      expect(result.color).toBe("black");
    });

    it("should throw if trying to update a non-existing car", async () => {
      repoMock.findById.mockResolvedValue(null);

      await expect(
        service.updateCar("invalid", { color: "red" })
      ).rejects.toEqual(new AppError("Car not found", StatusCodes.NOT_FOUND));
    });

    it("should throw if new plate is already taken", async () => {
      const existing = fakeCar();

      repoMock.findById.mockResolvedValue(existing);

      repoMock.findByPlate.mockResolvedValue(fakeCar());

      await expect(
        service.updateCar(existing.id, { plate: "NEW1234" })
      ).rejects.toEqual(
        new AppError("Plate already taken", StatusCodes.CONFLICT)
      );
    });
  });

  describe("deleteCarById", () => {
    it("should delete a car", async () => {
      const existing = fakeCar();

      repoMock.findById.mockResolvedValue(existing);
      repoMock.deleteCar.mockResolvedValue(existing);

      const result = await service.deleteCarById(existing.id);

      expect(repoMock.findById).toHaveBeenCalledWith(existing.id);
      expect(result.id).toBe(existing.id);
    });

    it("should throw if car does not exist", async () => {
      repoMock.findById.mockResolvedValue(null);

      await expect(service.deleteCarById("123")).rejects.toEqual(
        new AppError("Car not found", StatusCodes.NOT_FOUND)
      );
    });
  });

  describe("getCarById", () => {
    it("should return a car", async () => {
      const car = fakeCar();

      repoMock.findById.mockResolvedValue(car);

      const result = await service.getCarById(car.id);

      expect(result.id).toBe(car.id);
    });

    it("should throw if car not found", async () => {
      repoMock.findById.mockResolvedValue(null);

      await expect(service.getCarById("invalid")).rejects.toEqual(
        new AppError("Car not found", StatusCodes.NOT_FOUND)
      );
    });
  });

  describe("listAll", () => {
    it("should return a list of cars", async () => {
      const cars = [fakeCar(), fakeCar(), fakeCar()];

      repoMock.findAll.mockResolvedValue(cars);

      const result = await service.listAll({ color: "red" });

      expect(repoMock.findAll).toHaveBeenCalledWith({ color: "red" });
      expect(result).toHaveLength(3);
    });
  });
});
