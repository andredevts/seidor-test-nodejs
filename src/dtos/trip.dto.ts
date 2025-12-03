export interface DomainTripDTO {
  endAt?: string;
}

export interface RequestTripDTO {
  carId: string;
  driverId: string;
  startAt: string;
  reason: string;
  endAt?: string;
}

export interface ResponseTripDTO {
  id: string;
  carId: string;
  driverId: string;
  startAt: string;
  endAt?: string;
  reason: string;
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
