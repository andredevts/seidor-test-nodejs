import { CarRepository } from "./../repositories/car.repository";
import { PrismaSingleton } from "./../infra/prismaClient";
import { mockDeep, DeepMockProxy } from "vitest-mock-extended";

describe("CarRepository", () => {
  let repo: CarRepository;
  let prismaMock: DeepMockProxy<any>;

  beforeEach(() => {
    vi.clearAllMocks();

    prismaMock = mockDeep();

    vi.spyOn(PrismaSingleton, "getSession").mockReturnValue(prismaMock);

    repo = new CarRepository();
  });

  it("should call prisma.car.create with correct params", async () => {
    const data = { id: "123", plate: "ABC1234" } as any;

    prismaMock.car.create.mockResolvedValue(data);

    const result = await repo.createCar(data);

    expect(prismaMock.car.create).toHaveBeenCalledWith({ data });
    expect(result).toBe(data);
  });

  it("should call prisma.car.update with correct params", async () => {
    const id = "123";
    const data = { color: "Red" } as any;

    const returned = { id, ...data };
    prismaMock.car.update.mockResolvedValue(returned);

    const result = await repo.updateCar(id, data);

    expect(prismaMock.car.update).toHaveBeenCalledWith({
      where: { id },
      data
    });

    expect(result).toBe(returned);
  });

  it("should call prisma.car.delete with correct params", async () => {
    const id = "123";
    const deleted = { id };

    prismaMock.car.delete.mockResolvedValue(deleted);

    const result = await repo.deleteCar(id);

    expect(prismaMock.car.delete).toHaveBeenCalledWith({
      where: { id }
    });

    expect(result).toBe(deleted);
  });

  it("should call prisma.car.findUnique with id", async () => {
    const id = "123";
    const car = { id };

    prismaMock.car.findUnique.mockResolvedValue(car);

    const result = await repo.findById(id);

    expect(prismaMock.car.findUnique).toHaveBeenCalledWith({
      where: { id }
    });

    expect(result).toBe(car);
  });

  it("should call prisma.car.findUnique with plate", async () => {
    const plate = "XYZ9876";
    const car = { id: "1", plate };

    prismaMock.car.findUnique.mockResolvedValue(car);

    const result = await repo.findByPlate(plate);

    expect(prismaMock.car.findUnique).toHaveBeenCalledWith({
      where: { plate }
    });

    expect(result).toBe(car);
  });

  it("should call prisma.car.findMany without filters", async () => {
    const resultData = [{ id: "1" }];
    prismaMock.car.findMany.mockResolvedValue(resultData);

    const result = await repo.findAll();

    expect(prismaMock.car.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { createdAt: "desc" }
    });

    expect(result).toBe(resultData);
  });

  it("should call prisma.car.findMany with color filter", async () => {
    const resultData = [{ id: "1", color: "Red" }];
    prismaMock.car.findMany.mockResolvedValue(resultData);

    const result = await repo.findAll({ color: "Red" });

    expect(prismaMock.car.findMany).toHaveBeenCalledWith({
      where: { color: { equals: "Red" } },
      orderBy: { createdAt: "desc" }
    });

    expect(result).toBe(resultData);
  });

  it("should call prisma.car.findMany with brand filter", async () => {
    const resultData = [{ id: "1", brand: "BMW" }];
    prismaMock.car.findMany.mockResolvedValue(resultData);

    const result = await repo.findAll({ brand: "BMW" });

    expect(prismaMock.car.findMany).toHaveBeenCalledWith({
      where: { brand: { equals: "BMW" } },
      orderBy: { createdAt: "desc" }
    });

    expect(result).toBe(resultData);
  });

  it("should call prisma.car.findMany with color and brand filter", async () => {
    const resultData = [{ id: "1", brand: "BMW", color: "Black" }];

    prismaMock.car.findMany.mockResolvedValue(resultData);

    const result = await repo.findAll({ color: "Black", brand: "BMW" });

    expect(prismaMock.car.findMany).toHaveBeenCalledWith({
      where: {
        color: { equals: "Black" },
        brand: { equals: "BMW" }
      },
      orderBy: { createdAt: "desc" }
    });

    expect(result).toBe(resultData);
  });
});
