export interface DomainTripDTO {
  endAt?: Date;
}

export interface RequestTripDTO {
  carId: string;
  driverId: string;
  reason: string;
  startAt: Date;
  endAt?: Date;
}

export interface ResponseTripDTO {
  id: string;
  carId: string;
  driverId: string;
  startAt: Date;
  endAt?: Date;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
  driver: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
  car: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    plate: string;
    color: string;
    brand: string;
  };
}
