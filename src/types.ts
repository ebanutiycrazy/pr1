export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  createdAt: string;
}

export interface MaintenanceRecord {
  id: string;
  carId: string;
  date: string;
  mileage: number;
  type: string;
  description?: string;
  cost: number;
}
