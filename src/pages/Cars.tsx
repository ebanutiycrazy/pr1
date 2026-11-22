import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Gauge, FileText, Trash2, ArrowRight } from 'lucide-react';
import type { Car, MaintenanceRecord } from '@/types';
import { useGarage } from '@/hooks/useGarage';
import Modal from '@/components/Modal';
import CarForm from '@/components/CarForm';
import ConfirmDialog from '@/components/ConfirmDialog';
import { formatMileage, formatCost, carTotalCost, carRecordCount, carTitle } from '@/utils/format';

interface CarsProps {
  cars: Car[];
  records: MaintenanceRecord[];
  addCar: ReturnType<typeof useGarage>['addCar'];
  deleteCar: ReturnType<typeof useGarage>['deleteCar'];
}

/** Страница "Мои автомобили": карточки всех машин */
export default function Cars({ cars, records, addCar, deleteCar }: CarsProps) {
  const [showModal, setShowModal] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Мои автомобили
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            {cars.length === 0
              ? 'Пока пусто — добавьте первый автомобиль'
              : `В гараже: ${cars.length}`}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-colors"
        >
          <Plus size={16} /> Добавить автомобиль
        </button>
      </div>

      {cars.length === 0 ? (
        <div className="bg-zinc-900 border border-dashed border-zinc-800 rounded-xl p-12 text-center">
          <Plus size={28} className="mx-auto text-zinc-600" />
          <p className="text-sm text-zinc-400 mt-3">
            Здесь появится список ваших автомобилей.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {cars.map((car) => (
            <div
              key={car.id}
              className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 hover:shadow-lg hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-white truncate">
                    {carTitle(car)}
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">{car.year} год</p>
                </div>
                <button
                  onClick={() => setPendingDelete(car.id)}
                  className="p-2 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  aria-label="Удалить автомобиль"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-5 mb-5">
                <div className="bg-zinc-800/50 rounded-lg px-3 py-2.5">
                  <div className="flex items-center gap-1 text-zinc-500">
                    <Gauge size={12} />
                    <span className="text-[10px]">Пробег</span>
                  </div>
                  <p className="text-xs font-semibold text-white mt-1 truncate">
                    {formatMileage(car.mileage)}
                  </p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg px-3 py-2.5">
                  <div className="flex items-center gap-1 text-zinc-500">
                    <FileText size={12} />
                    <span className="text-[10px]">Записей</span>
                  </div>
                  <p className="text-xs font-semibold text-white mt-1">
                    {carRecordCount(records, car.id)}
                  </p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg px-3 py-2.5">
                  <span className="text-[10px] text-zinc-500">Расходы</span>
                  <p className="text-xs font-semibold text-orange-400 mt-1 truncate">
                    {formatCost(carTotalCost(records, car.id))}
                  </p>
                </div>
              </div>
              <Link
                to={`/cars/${car.id}`}
                className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-200 bg-zinc-800 group-hover:bg-orange-500 group-hover:text-white transition-colors"
              >
                Подробнее <ArrowRight size={15} />
              </Link>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="Добавить автомобиль" onClose={() => setShowModal(false)}>
          <CarForm
            onSave={(data) => {
              addCar(data);
              setShowModal(false);
            }}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
      {pendingDelete && (
        <ConfirmDialog
          title="Удалить автомобиль?"
          message="Автомобиль и все его записи ТО будут удалены безвозвратно. Это действие нельзя отменить."
          onConfirm={() => {
            deleteCar(pendingDelete);
            setPendingDelete(null);
          }}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
