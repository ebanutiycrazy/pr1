import { useCallback, useEffect, useState } from 'react';
import type { Car, MaintenanceRecord } from '@/types';
import { demoCars, demoRecords } from '@/data/demoData';

const CARS_KEY = 'garagelog.cars';
const RECORDS_KEY = 'garagelog.records';

/** Читает массив из localStorage, возвращая fallback при ошибке/отсутствии */
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // переполнение хранилища игнорируем — данные в памяти останутся актуальными
  }
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Управляет машинами и записями ТО с автосохранением в localStorage.
 * При первом запуске подставляет демо-данные.
 */
export function useGarage() {
  const [cars, setCars] = useState<Car[]>(() => load(CARS_KEY, demoCars));
  const [records, setRecords] = useState<MaintenanceRecord[]>(() =>
    load(RECORDS_KEY, demoRecords)
  );

  useEffect(() => save(CARS_KEY, cars), [cars]);
  useEffect(() => save(RECORDS_KEY, records), [records]);

  const addCar = useCallback((data: Omit<Car, 'id' | 'createdAt'>) => {
    const car: Car = {
      ...data,
      id: uid(),
      createdAt: new Date().toISOString(),
    };
    setCars((prev) => [car, ...prev]);
    return car;
  }, []);

  const deleteCar = useCallback((id: string) => {
    setCars((prev) => prev.filter((c) => c.id !== id));
    setRecords((prev) => prev.filter((r) => r.carId !== id));
  }, []);

  const addRecord = useCallback(
    (data: Omit<MaintenanceRecord, 'id'>) => {
      const record: MaintenanceRecord = { ...data, id: uid() };
      setRecords((prev) => [record, ...prev]);
      // пробег авто обновляем, если новая запись пробега больше
      setCars((prev) =>
        prev.map((c) =>
          c.id === data.carId && data.mileage > c.mileage
            ? { ...c, mileage: data.mileage }
            : c
        )
      );
      return record;
    },
    []
  );

  const deleteRecord = useCallback((id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { cars, records, addCar, deleteCar, addRecord, deleteRecord };
}
