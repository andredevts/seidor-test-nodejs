import { DriverService } from "../../src/services/driver.service";
import { DriverRepository } from "../../src/repositories/driver.repository";
import { mock } from "vitest-mock-extended";
import { faker } from "@faker-js/faker";
import { AppError } from "../../src/errors/appError";

describe("DriverService", () => {
  const repoMock = mock<DriverRepository>();
  let service: DriverService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new DriverService(repoMock);
  });

  const fakeDriver = (data?: Partial<any>) => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...data,
  });

  it("should create a new driver", async () => {
    const dto = {
      name: faker.person.fullName(),
    };

    repoMock.createDriver.mockResolvedValue(fakeDriver(dto));

    const result = await service.createDriver(dto);

    expect(repoMock.createDriver).toHaveBeenCalledWith(dto);
    expect(result).toHaveProperty("id");
    expect(result.name).toBe(dto.name);
  });

  it("should update an existing driver", async () => {
    const id = faker.string.uuid();
    const existing = fakeDriver({ id });

    repoMock.findById.mockResolvedValue(existing);

    const dto = {
      name: faker.person.fullName(),
    };

    repoMock.updateDriver.mockResolvedValue(fakeDriver({ id, ...dto }));

    const result = await service.updateDriver(id, dto);

    expect(repoMock.findById).toHaveBeenCalledWith(id);
    expect(repoMock.updateDriver).toHaveBeenCalledWith(id, {
      name: dto.name,
    });
    expect(result.name).toBe(dto.name);
  });

  it("should throw if updating a driver that does not exist", async () => {
    const id = faker.string.uuid();

    repoMock.findById.mockResolvedValue(null);

    const payload = { name: faker.person.fullName() };

    await expect(service.updateDriver(id, payload)).rejects.toThrow(AppError);

    expect(repoMock.findById).toHaveBeenCalledWith(id);
    expect(repoMock.updateDriver).not.toHaveBeenCalled();
  });

  it("should delete a driver", async () => {
    const id = faker.string.uuid();
    const existing = fakeDriver({ id });

    repoMock.findById.mockResolvedValue(existing);
    repoMock.deleteDriver.mockResolvedValue(existing);

    const result = await service.deleteDriverById(id);

    expect(repoMock.findById).toHaveBeenCalledWith(id);
    expect(repoMock.deleteDriver).toHaveBeenCalledWith(id);
    expect(result.id).toBe(id);
  });

  it("should throw when deleting a non-existing driver", async () => {
    const id = faker.string.uuid();

    repoMock.findById.mockResolvedValue(null);

    await expect(service.deleteDriverById(id)).rejects.toThrow(AppError);

    expect(repoMock.findById).toHaveBeenCalledWith(id);
    expect(repoMock.deleteDriver).not.toHaveBeenCalled();
  });

  it("should get a driver by id", async () => {
    const id = faker.string.uuid();
    const existing = fakeDriver({ id });

    repoMock.findById.mockResolvedValue(existing);

    const result = await service.getDriverById(id);

    expect(repoMock.findById).toHaveBeenCalledWith(id);
    expect(result.id).toBe(id);
  });

  it("should throw if driver does not exist", async () => {
    const id = faker.string.uuid();

    repoMock.findById.mockResolvedValue(null);

    await expect(service.getDriverById(id)).rejects.toThrow(AppError);

    expect(repoMock.findById).toHaveBeenCalledWith(id);
  });

  it("should list all drivers", async () => {
    const list = [fakeDriver(), fakeDriver(), fakeDriver()];

    repoMock.findAll.mockResolvedValue(list);

    const result = await service.listAll();

    expect(repoMock.findAll).toHaveBeenCalled();
    expect(result.length).toBe(3);
  });

  it("should filter drivers by name", async () => {
    const filter = { name: "John" };

    const list = [fakeDriver({ name: "John Doe" })];

    repoMock.findAll.mockResolvedValue(list);

    const result = await service.listAll(filter);

    expect(repoMock.findAll).toHaveBeenCalledWith(filter);
    expect(result[0].name).toContain("John");
  });
});
