import type { Car, MaintenanceRecord } from '@/types';

export const MAINTENANCE_TYPES = [
  'Замена масла',
  'Замена фильтров',
  'ТО тормозов',
  'Замена шин',
  'Ремонт двигателя',
  'Ремонт подвески',
  'Другое',
] as const;

export const demoCars: Car[] = [
  {
    id: 'car-1',
    brand: 'Toyota',
    model: 'Camry',
    year: 2019,
    mileage: 87400,
    createdAt: '2025-09-01T10:00:00.000Z',
  },
  {
    id: 'car-2',
    brand: 'Volkswagen',
    model: 'Polo',
    year: 2016,
    mileage: 132500,
    createdAt: '2025-09-01T10:05:00.000Z',
  },
  {
    id: 'car-3',
    brand: 'Lada',
    model: 'Vesta',
    year: 2022,
    mileage: 31200,
    createdAt: '2025-09-01T10:10:00.000Z',
  },
];

export const demoRecords: MaintenanceRecord[] = [
  {
    id: 'rec-1',
    carId: 'car-1',
    date: '2025-06-14',
    mileage: 72300,
    type: 'Замена масла',
    description: 'Масло 5W-30, масляный фильтр',
    cost: 6500,
  },
  {
    id: 'rec-2',
    carId: 'car-1',
    date: '2025-08-02',
    mileage: 79800,
    type: 'ТО тормозов',
    description: 'Замена передних колодок, диски в норме',
    cost: 11200,
  },
  {
    id: 'rec-3',
    carId: 'car-1',
    date: '2026-01-17',
    mileage: 83000,
    type: 'Замена шин',
    description: 'Переобулка на летний комплект',
    cost: 3400,
  },
  {
    id: 'rec-4',
    carId: 'car-2',
    date: '2025-10-11',
    mileage: 124800,
    type: 'Замена фильтров',
    description: 'Воздушный и салонный фильтр',
    cost: 4100,
  },
  {
    id: 'rec-5',
    carId: 'car-2',
    date: '2026-02-08',
    mileage: 131000,
    type: 'Ремонт подвески',
    description: 'Замена передних амортизаторов',
    cost: 27600,
  },
  {
    id: 'rec-6',
    carId: 'car-3',
    date: '2026-03-22',
    mileage: 29800,
    type: 'Замена масла',
    description: 'Плановое ТО-2',
    cost: 7200,
  },
  {
    id: 'rec-7',
    carId: 'car-3',
    date: '2026-04-30',
    mileage: 31200,
    type: 'ТО тормозов',
    description: 'Задние колодки',
    cost: 9800,
  },
];
