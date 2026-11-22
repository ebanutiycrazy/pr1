import { useState } from 'react';
import type { Car } from '@/types';

interface CarFormProps {
  onSave: (data: Omit<Car, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

interface Errors {
  brand?: string;
  model?: string;
  year?: string;
  mileage?: string;
}

/** Форма добавления автомобиля с валидацией */
export default function CarForm({ onSave, onCancel }: CarFormProps) {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  function validate(): boolean {
    const e: Errors = {};
    if (!brand.trim()) e.brand = 'Укажите марку';
    if (!model.trim()) e.model = 'Укажите модель';
    const y = Number(year);
    if (!year) e.year = 'Укажите год выпуска';
    else if (!Number.isInteger(y) || y < 1900 || y > 2030)
      e.year = 'Год должен быть от 1900 до 2030';
    const m = Number(mileage);
    if (mileage === '') e.mileage = 'Укажите пробег';
    else if (!Number.isFinite(m) || m < 0) e.mileage = 'Некорректный пробег';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    onSave({
      brand: brand.trim(),
      model: model.trim(),
      year: Number(year),
      mileage: Number(mileage),
    });
  }

  const inputCls = (hasError?: string) =>
    `w-full bg-zinc-800 border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-orange-500/40 transition-colors ${
      hasError ? 'border-red-500' : 'border-zinc-700 focus:border-orange-500'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
          Марка <span className="text-orange-400">*</span>
        </label>
        <input
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Toyota"
          className={inputCls(errors.brand)}
        />
        {errors.brand && <p className="mt-1 text-xs text-red-400">{errors.brand}</p>}
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
          Модель <span className="text-orange-400">*</span>
        </label>
        <input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Camry"
          className={inputCls(errors.model)}
        />
        {errors.model && <p className="mt-1 text-xs text-red-400">{errors.model}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
            Год выпуска
          </label>
          <input
            value={year}
            onChange={(e) => setYear(e.target.value)}
            type="number"
            min={1900}
            max={2030}
            placeholder="2020"
            className={inputCls(errors.year)}
          />
          {errors.year && <p className="mt-1 text-xs text-red-400">{errors.year}</p>}
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
            placeholder="45000"
            className={inputCls(errors.mileage)}
          />
          {errors.mileage && (
            <p className="mt-1 text-xs text-red-400">{errors.mileage}</p>
          )}
        </div>
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
