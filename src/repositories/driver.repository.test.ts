import { DriverRepository } from "./../repositories/driver.repository";
import { PrismaSingleton } from "./../infra/prismaClient";
import { mockDeep, DeepMockProxy } from "vitest-mock-extended";

describe("DriverRepository", () => {
  let repo: DriverRepository;
  let prismaMock: DeepMockProxy<any>;

  beforeEach(() => {
    vi.clearAllMocks();

    prismaMock = mockDeep();

    vi.spyOn(PrismaSingleton, "getSession").mockReturnValue(prismaMock);

    repo = new DriverRepository();
  });

  it("should call prisma.driver.create with correct params", async () => {
    const payload = { id: "1", name: "John Doe" } as any;

    prismaMock.driver.create.mockResolvedValue(payload);

    const result = await repo.createDriver(payload);

    expect(prismaMock.driver.create).toHaveBeenCalledWith({ data: payload });
    expect(result).toBe(payload);
  });

  it("should call prisma.driver.update with correct params", async () => {
    const id = "driver123";
    const updateData = { name: "New Name" };

    const returned = { id, name: updateData.name };
    prismaMock.driver.update.mockResolvedValue(returned);

    const result = await repo.updateDriver(id, updateData);

    expect(prismaMock.driver.update).toHaveBeenCalledWith({
      where: { id },
      data: updateData,
    });

    expect(result).toBe(returned);
  });

  it("should call prisma.driver.delete with correct params", async () => {
    const id = "driver123";
    const deleted = { id };

    prismaMock.driver.delete.mockResolvedValue(deleted);

    const result = await repo.deleteDriver(id);

    expect(prismaMock.driver.delete).toHaveBeenCalledWith({
      where: { id },
    });
    expect(result).toBe(deleted);
  });

  it("should call prisma.driver.findUnique with id", async () => {
    const id = "driver123";
    const entity = { id };

    prismaMock.driver.findUnique.mockResolvedValue(entity);

    const result = await repo.findById(id);

    expect(prismaMock.driver.findUnique).toHaveBeenCalledWith({
      where: { id },
    });

    expect(result).toBe(entity);
  });

  it("should call prisma.driver.findMany without filter", async () => {
    const list = [{ id: "1", name: "John" }];

    prismaMock.driver.findMany.mockResolvedValue(list);

    const result = await repo.findAll();

    expect(prismaMock.driver.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { createdAt: "desc" },
    });

    expect(result).toBe(list);
  });

  it("should call prisma.driver.findMany with name filter", async () => {
    const list = [{ id: "1", name: "John" }];

    prismaMock.driver.findMany.mockResolvedValue(list);

    const result = await repo.findAll({ name: "Jo" });

    expect(prismaMock.driver.findMany).toHaveBeenCalledWith({
      where: {
        name: {
          contains: "Jo",
          mode: "insensitive",
        },
      },
      orderBy: { createdAt: "desc" },
    });

    expect(result).toBe(list);
  });
});
