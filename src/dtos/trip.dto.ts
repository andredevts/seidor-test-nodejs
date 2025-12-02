export interface DomainTripDTO {
  endAt?: string;
}

export interface RequestTripDTO {
  carId: string;
  driverId: string;
  startAt: string;
  reason: string;
}

export interface ResponseTripDTO {
  id: string;
  carId: string;
  driverId: string;
  startAt: string;
  endAt?: string;
  reason: string;
}
