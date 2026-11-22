import {
  Droplets,
  Filter,
  Disc3,
  RefreshCw,
  Wrench,
  Cog,
  MoreHorizontal,
  type LucideIcon,
} from 'lucide-react';

const TYPE_ICONS: Record<string, LucideIcon> = {
  'Замена масла': Droplets,
  'Замена фильтров': Filter,
  'ТО тормозов': Disc3,
  'Замена шин': RefreshCw,
  'Ремонт двигателя': Wrench,
  'Ремонт подвески': Cog,
  'Другое': MoreHorizontal,
};

/** Иконка для типа работы ТО */
export function TypeIcon({ type, size = 18 }: { type: string; size?: number }) {
  const Icon = TYPE_ICONS[type] ?? MoreHorizontal;
  return <Icon size={size} />;
}

/** Цветовой акцент для типа работы */
export function typeColor(type: string): string {
  const map: Record<string, string> = {
    'Замена масла': 'bg-orange-500/10 text-orange-400',
    'Замена фильтров': 'bg-sky-500/10 text-sky-400',
    'ТО тормозов': 'bg-red-500/10 text-red-400',
    'Замена шин': 'bg-emerald-500/10 text-emerald-400',
    'Ремонт двигателя': 'bg-amber-500/10 text-amber-400',
    'Ремонт подвески': 'bg-teal-500/10 text-teal-400',
  };
  return map[type] ?? 'bg-zinc-500/10 text-zinc-400';
}
