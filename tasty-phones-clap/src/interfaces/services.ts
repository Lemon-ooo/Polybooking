// src/interfaces/services.ts
export interface Service {
  id: number | string;
  name: string;
  description?: string;
  price: number;
  isActive?: boolean;
  createdAt?: string;
}

export interface ServiceListResponse {
  data: Service[];
  total: number;
}