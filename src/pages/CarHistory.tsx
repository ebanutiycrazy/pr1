import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Wrench, Trash2 } from 'lucide-react';
import type { Car, MaintenanceRecord } from '@/types';
import { useGarage } from '@/hooks/useGarage';
import Modal from '@/components/Modal';
import RecordForm from '@/components/RecordForm';
import ConfirmDialog from '@/components/ConfirmDialog';
import { formatDate, formatMileage, formatCost, recordsForCar, carTitle, carTotalCost } from '@/utils/format';
import { TypeIcon, typeColor } from '@/components/TypeIcon';

interface CarHistoryProps {
  cars: Car[];
  records: MaintenanceRecord[];
  addRecord: ReturnType<typeof useGarage>['addRecord'];
  deleteRecord: ReturnType<typeof useGarage>['deleteRecord'];
}

/** Страница истории ТО конкретного автомобиля */
export default function CarHistory({
  cars,
  records,
  addRecord,
  deleteRecord,
}: CarHistoryProps) {
  const { carId } = useParams<{ carId: string }>();
  const [showModal, setShowModal] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const car = cars.find((c) => c.id === carId);
  const carRecords = car ? recordsForCar(records, car.id) : [];

  if (!car) {
    return (
      <div className="bg-zinc-900 border border-dashed border-zinc-800 rounded-xl p-12 text-center max-w-md mx-auto mt-10">
        <Wrench size={28} className="mx-auto text-zinc-600" />
        <p className="text-sm text-zinc-400 mt-3">Автомобиль не найден.</p>
        <Link
          to="/cars"
          className="mt-4 inline-flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300"
        >
          <ArrowLeft size={15} /> К списку автомобилей
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/cars"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={15} /> Назад к списку авто
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {carTitle(car)}
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            {car.year} год · пробег {formatMileage(car.mileage)} · расходы{' '}
            <span className="text-orange-400 font-medium">
              {formatCost(carTotalCost(records, car.id))}
            </span>
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-colors"
        >
          <Plus size={16} /> Добавить запись ТО
        </button>
      </div>

      {carRecords.length === 0 ? (
        <div className="bg-zinc-900 border border-dashed border-zinc-800 rounded-xl p-12 text-center">
          <Wrench size={28} className="mx-auto text-zinc-600" />
          <p className="text-sm text-zinc-400 mt-3">
            У этого автомобиля пока нет записей ТО.
          </p>
        </div>
      ) : (
        <>
          {/* Таблица для десктопа */}
          <div className="hidden md:block bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-left text-xs text-zinc-500 uppercase tracking-wide">
                  <th className="px-5 py-3.5 font-medium">Дата</th>
                  <th className="px-5 py-3.5 font-medium">Пробег</th>
                  <th className="px-5 py-3.5 font-medium">Тип работы</th>
                  <th className="px-5 py-3.5 font-medium">Описание</th>
                  <th className="px-5 py-3.5 font-medium text-right">Стоимость</th>
                  <th className="px-3 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {carRecords.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className="px-5 py-4 text-zinc-300 whitespace-nowrap">
                      {formatDate(r.date)}
                    </td>
                    <td className="px-5 py-4 text-zinc-400 whitespace-nowrap">
                      {formatMileage(r.mileage)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${typeColor(r.type)}`}
                      >
                        <TypeIcon type={r.type} size={13} />
                        {r.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-zinc-400 max-w-xs">
                      <span className="block truncate" title={r.description ?? ''}>
                        {r.description || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-orange-400 whitespace-nowrap">
                      {formatCost(r.cost)}
                    </td>
                    <td className="px-3 py-4">
                      <button
                        onClick={() => setPendingDelete(r.id)}
                        className="p-2 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        aria-label="Удалить запись"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Карточки для мобильных */}
          <div className="md:hidden space-y-3">
            {carRecords.map((r) => (
              <div
                key={r.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:shadow-lg hover:shadow-black/30 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${typeColor(r.type)}`}
                  >
                    <TypeIcon type={r.type} size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{r.type}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {formatDate(r.date)} · {formatMileage(r.mileage)}
                    </p>
                    {r.description && (
                      <p className="text-xs text-zinc-400 mt-1.5">{r.description}</p>
                    )}
                    <p className="text-sm font-semibold text-orange-400 mt-2">
                      {formatCost(r.cost)}
                    </p>
                  </div>
                  <button
                    onClick={() => setPendingDelete(r.id)}
                    className="p-2 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    aria-label="Удалить запись"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showModal && (
        <Modal title="Добавить запись ТО" onClose={() => setShowModal(false)}>
          <RecordForm
            cars={cars}
            fixedCarId={car.id}
            onSave={(data) => {
              addRecord(data);
              setShowModal(false);
            }}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
      {pendingDelete && (
        <ConfirmDialog
          title="Удалить запись?"
          message="Запись ТО будет удалена безвозвратно. Это действие нельзя отменить."
          onConfirm={() => {
            deleteRecord(pendingDelete);
            setPendingDelete(null);
          }}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
