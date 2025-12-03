export interface DomainDriverDTO {
  name?: string;
}

export interface RequestDriverDTO {
  name?: string;
}

export interface ResponseDriverDTO {
  id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}
