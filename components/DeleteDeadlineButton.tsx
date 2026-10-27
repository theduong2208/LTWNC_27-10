'use client';

import { useState, useTransition } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteDeadlineAction } from '@/actions/deadline-actions';

interface DeleteDeadlineButtonProps {
  id: string;
  title: string;
}

export default function DeleteDeadlineButton({ id, title }: DeleteDeadlineButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (confirm(`Bạn có chắc chắn muốn xoá deadline "${title}" không? Hành động này sẽ cập nhật lại trang ISR ngay lập tức!`)) {
      setError(null);
      startTransition(async () => {
        const res = await deleteDeadlineAction(id);
        if (!res.success) {
          setError(res.message || 'Không thể xoá deadline');
        }
      });
    }
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="btn btn-danger btn-sm"
        title="Xoá deadline này khỏi hệ thống"
      >
        {isPending ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Trash2 size={14} />
        )}
        <span>{isPending ? 'Đang xoá...' : 'Xoá'}</span>
      </button>

      {error && (
        <span style={{ fontSize: '0.72rem', color: 'var(--danger)', marginTop: '4px' }}>
          {error}
        </span>
      )}
    </div>
  );
}
