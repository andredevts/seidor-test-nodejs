export interface DomainCarDTO {
  plate?: string;
  color?: string;
  brand?: string;
}

export interface RequestCarDTO {
  plate?: string;
  color?: string;
  brand?: string;
}

export interface ResponseCarDTO {
  id: string;
  plate: string;
  color: string;
  brand: string;
  createdAt: Date;
  updatedAt: Date;
}
