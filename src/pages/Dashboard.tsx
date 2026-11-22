import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car as CarIcon, Plus, Wrench, Wallet, CalendarDays } from 'lucide-react';
import type { Car, MaintenanceRecord } from '@/types';
import { useGarage } from '@/hooks/useGarage';
import Modal from '@/components/Modal';
import CarForm from '@/components/CarForm';
import RecordForm from '@/components/RecordForm';
import RecordCard from '@/components/RecordCard';
import ConfirmDialog from '@/components/ConfirmDialog';
import { formatDate, formatCost, carTitle } from '@/utils/format';

interface DashboardProps {
  cars: Car[];
  records: MaintenanceRecord[];
  addCar: ReturnType<typeof useGarage>['addCar'];
  addRecord: ReturnType<typeof useGarage>['addRecord'];
  deleteRecord: ReturnType<typeof useGarage>['deleteRecord'];
}

/** Главная страница: статистика, действия и последние записи ТО */
export default function Dashboard({
  cars,
  records,
  addCar,
  addRecord,
  deleteRecord,
}: DashboardProps) {
  const [showCarModal, setShowCarModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const totalCost = records.reduce((s, r) => s + r.cost, 0);
  const now = new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthCost = records
    .filter((r) => r.date.startsWith(monthPrefix))
    .reduce((s, r) => s + r.cost, 0);
  const lastService = [...records].sort((a, b) => b.date.localeCompare(a.date))[0];
  const recent = [...records]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const stats = [
    {
      icon: CarIcon,
      label: 'Автомобилей',
      value: String(cars.length),
      tint: 'bg-orange-500/10 text-orange-400',
    },
    {
      icon: Wallet,
      label: 'Расходы за всё время',
      value: formatCost(totalCost),
      tint: 'bg-emerald-500/10 text-emerald-400',
    },
    {
      icon: CalendarDays,
      label: 'Расходы за месяц',
      value: formatCost(monthCost),
      tint: 'bg-sky-500/10 text-sky-400',
    },
    {
      icon: Wrench,
      label: 'Последнее ТО',
      value: lastService
        ? `${lastService.type}`
        : '—',
      sub: lastService ? formatDate(lastService.date) : 'Записей пока нет',
      tint: 'bg-amber-500/10 text-amber-400',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Обзор
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Ваш гараж и расходы на обслуживание в одном месте
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCarModal(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-200 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors"
          >
            <Plus size={16} /> Добавить автомобиль
          </button>
          <button
            onClick={() => setShowRecordModal(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-colors"
          >
            <Wrench size={16} /> Добавить запись ТО
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/30 transition-all duration-200"
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.tint}`}
            >
              <s.icon size={18} />
            </div>
            <p className="text-xs text-zinc-500 mt-3">{s.label}</p>
            <p
              className="text-lg font-semibold text-white mt-1 truncate"
              title={s.value}
            >
              {s.value}
            </p>
            {s.sub && <p className="text-xs text-zinc-500 mt-0.5">{s.sub}</p>}
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Последние записи ТО</h2>
          <Link
            to="/cars"
            className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
          >
            Все автомобили
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="bg-zinc-900 border border-dashed border-zinc-800 rounded-xl p-10 text-center">
            <Wrench size={28} className="mx-auto text-zinc-600" />
            <p className="text-sm text-zinc-400 mt-3">
              Записей ещё нет. Добавьте первую запись ТО.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map((r) => {
              const car = cars.find((c) => c.id === r.carId);
              return (
                <RecordCard
                  key={r.id}
                  record={r}
                  carTitle={car ? carTitle(car) : undefined}
                  onDelete={(id) => setPendingDelete(id)}
                />
              );
            })}
          </div>
        )}
      </div>

      {showCarModal && (
        <Modal title="Добавить автомобиль" onClose={() => setShowCarModal(false)}>
          <CarForm
            onSave={(data) => {
              addCar(data);
              setShowCarModal(false);
            }}
            onCancel={() => setShowCarModal(false)}
          />
        </Modal>
      )}
      {showRecordModal && (
        <Modal title="Добавить запись ТО" onClose={() => setShowRecordModal(false)}>
          <RecordForm
            cars={cars}
            onSave={(data) => {
              addRecord(data);
              setShowRecordModal(false);
            }}
            onCancel={() => setShowRecordModal(false)}
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
