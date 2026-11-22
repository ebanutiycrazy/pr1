import { useState } from 'react';
import type { Car, MaintenanceRecord } from '@/types';
import { MAINTENANCE_TYPES } from '@/data/demoData';

interface RecordFormProps {
  cars: Car[];
  /** Если задан — форма привязана к одному авто и выбор скрыт */
  fixedCarId?: string;
  onSave: (data: Omit<MaintenanceRecord, 'id'>) => void;
  onCancel: () => void;
}

interface Errors {
  carId?: string;
  date?: string;
  mileage?: string;
  type?: string;
  cost?: string;
}

function todayStr() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** Форма добавления записи ТО с валидацией */
export default function RecordForm({
  cars,
  fixedCarId,
  onSave,
  onCancel,
}: RecordFormProps) {
  const [carId, setCarId] = useState(fixedCarId ?? cars[0]?.id ?? '');
  const [date, setDate] = useState(todayStr());
  const [mileage, setMileage] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  function validate(): boolean {
    const e: Errors = {};
    if (!carId) e.carId = 'Сначала добавьте автомобиль';
    if (!date) e.date = 'Укажите дату';
    const m = Number(mileage);
    if (mileage === '') e.mileage = 'Укажите пробег';
    else if (!Number.isFinite(m) || m < 0) e.mileage = 'Некорректный пробег';
    if (!type) e.type = 'Выберите тип работы';
    const c = Number(cost);
    if (cost === '') e.cost = 'Укажите стоимость';
    else if (!Number.isFinite(c) || c < 0) e.cost = 'Некорректная стоимость';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    onSave({
      carId,
      date,
      mileage: Number(mileage),
      type,
      description: description.trim() || undefined,
      cost: Number(cost),
    });
  }

  const inputCls = (hasError?: string) =>
    `w-full bg-zinc-800 border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-orange-500/40 transition-colors ${
      hasError ? 'border-red-500' : 'border-zinc-700 focus:border-orange-500'
    }`;

  if (cars.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-zinc-300">
          Сначала добавьте автомобиль, затем записи ТО.
        </p>
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            Понятно
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {!fixedCarId && (
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
            Автомобиль <span className="text-orange-400">*</span>
          </label>
          <select
            value={carId}
            onChange={(e) => setCarId(e.target.value)}
            className={inputCls(errors.carId)}
          >
            {cars.map((c) => (
              <option key={c.id} value={c.id}>
                {c.brand} {c.model} ({c.year})
              </option>
            ))}
          </select>
          {errors.carId && <p className="mt-1 text-xs text-red-400">{errors.carId}</p>}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
            Дата
          </label>
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            className={inputCls(errors.date)}
          />
          {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
            Пробег, км <span className="text-orange-400">*</span>
          </label>
          <input
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            type="number"
            min={0}
            placeholder="87000"
            className={inputCls(errors.mileage)}
          />
          {errors.mileage && (
            <p className="mt-1 text-xs text-red-400">{errors.mileage}</p>
          )}
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
          Тип работы <span className="text-orange-400">*</span>
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={inputCls(errors.type)}
        >
          <option value="">Выберите тип работы…</option>
          {MAINTENANCE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.type && <p className="mt-1 text-xs text-red-400">{errors.type}</p>}
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
          Описание
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Необязательно: что именно было сделано"
          className={`${inputCls()} resize-none`}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
          Стоимость, ₽ <span className="text-orange-400">*</span>
        </label>
        <input
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          type="number"
          min={0}
          placeholder="6500"
          className={inputCls(errors.cost)}
        />
        {errors.cost && <p className="mt-1 text-xs text-red-400">{errors.cost}</p>}
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors"
        >
          Сохранить
        </button>
      </div>
    </form>
  );
}
