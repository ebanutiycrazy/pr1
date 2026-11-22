import type { Car, MaintenanceRecord } from '@/types';

const MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

/** Форматирует дату "2026-03-22" как "22 марта 2026" */
export function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** Форматирует пробег с разделителями: 87400 -> "87 400 км" */
export function formatMileage(mileage: number): string {
  return `${mileage.toLocaleString('ru-RU')} км`;
}

/** Форматирует стоимость: 6500 -> "6 500 ₽" */
export function formatCost(cost: number): string {
  return `${cost.toLocaleString('ru-RU')} ₽`;
}

/** Итоговые расходы по автомобилю */
export function carTotalCost(records: MaintenanceRecord[], carId: string): number {
  return records
    .filter((r) => r.carId === carId)
    .reduce((sum, r) => sum + r.cost, 0);
}

/** Число записей ТО по автомобилю */
export function carRecordCount(records: MaintenanceRecord[], carId: string): number {
  return records.filter((r) => r.carId === carId).length;
}

/** Последняя по дате запись ТО автомобиля (или undefined) */
export function lastRecord(
  records: MaintenanceRecord[],
  carId: string
): MaintenanceRecord | undefined {
  return records
    .filter((r) => r.carId === carId)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
}

/** Записи ТО автомобиля, отсортированные по дате (новые сверху) */
export function recordsForCar(
  records: MaintenanceRecord[],
  carId: string
): MaintenanceRecord[] {
  return records
    .filter((r) => r.carId === carId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function carTitle(car: Car): string {
  return `${car.brand} ${car.model}`;
}
