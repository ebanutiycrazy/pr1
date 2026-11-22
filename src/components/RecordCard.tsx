import { Trash2 } from 'lucide-react';
import type { MaintenanceRecord } from '@/types';
import { formatDate, formatMileage, formatCost } from '@/utils/format';
import { TypeIcon, typeColor } from '@/components/TypeIcon';

interface RecordCardProps {
  record: MaintenanceRecord;
  carTitle?: string;
  onDelete: (id: string) => void;
}

/** Карточка записи ТО для списков на дашборде и в истории */
export default function RecordCard({
  record,
  carTitle,
  onDelete,
}: RecordCardProps) {
  return (
    <div className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 flex gap-3 sm:gap-4 items-start hover:shadow-lg hover:shadow-black/30 transition-all duration-200">
      <div
        className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${typeColor(record.type)}`}
      >
        <TypeIcon type={record.type} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {record.type}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">
              {formatDate(record.date)} · {formatMileage(record.mileage)}
              {carTitle && <span> · {carTitle}</span>}
            </p>
            {record.description && (
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                {record.description}
              </p>
            )}
          </div>
          <div className="shrink-0 flex flex-col items-end gap-2">
            <span className="text-sm font-semibold text-orange-400 whitespace-nowrap">
              {formatCost(record.cost)}
            </span>
            <button
              onClick={() => onDelete(record.id)}
              className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all sm:opacity-0 max-sm:opacity-100"
              aria-label="Удалить запись"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
