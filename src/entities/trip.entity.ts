export class TripEntity {
  constructor(
    public readonly carId: string,
    public readonly driverId: string,
    public readonly startAt: Date,
    public readonly reason: string
  ) {}
}
