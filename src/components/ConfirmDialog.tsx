import { AlertTriangle } from 'lucide-react';
import Modal from '@/components/Modal';

interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Диалог подтверждения удаления */
export default function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={onCancel}>
      <div className="flex gap-3">
        <div className="shrink-0 w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertTriangle size={20} className="text-red-400" />
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed">{message}</p>
      </div>
      <div className="flex gap-3 justify-end mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors"
        >
          Отмена
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-500 transition-colors"
        >
          Удалить
        </button>
      </div>
    </Modal>
  );
}
