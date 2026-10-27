'use client';

import { useState, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';
import { markCompleteAction } from '@/actions/deadline-actions';

interface MarkCompleteButtonProps {
  deadlineId: string;
  initialCompleted: boolean;
  size?: 'sm' | 'md';
}

export default function MarkCompleteButton({
  deadlineId,
  initialCompleted,
  size = 'md',
}: MarkCompleteButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      if (confirm('Bạn cần đăng nhập để đánh dấu deadline này là đã xong. Chuyển đến trang Đăng nhập?')) {
        router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      }
      return;
    }

    setErrorMessage(null);
    const optimisticNewState = !isCompleted;
    setIsCompleted(optimisticNewState);

    startTransition(async () => {
      const res = await markCompleteAction(deadlineId);
      if (!res.success) {
        // Hoàn tác lại nếu lỗi
        setIsCompleted(!optimisticNewState);
        setErrorMessage(res.message || 'Không thể cập nhật trạng thái');
      } else if (res.data) {
        setIsCompleted(res.data.completed);
      }
    });
  };

  const isSmall = size === 'sm';

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={isCompleted ? 'btn btn-success' : 'btn btn-secondary'}
        style={{
          fontSize: isSmall ? '0.82rem' : '0.9rem',
          padding: isSmall ? '5px 12px' : '8px 16px',
          borderRadius: 'var(--radius-md)',
          transition: 'all 0.2s ease',
          backgroundColor: isCompleted ? '#16a34a' : '#f8fafc',
          borderColor: isCompleted ? '#16a34a' : '#cbd5e1',
          color: isCompleted ? '#ffffff' : '#334155',
        }}
        title={
          session?.user
            ? isCompleted
              ? 'Click để bỏ đánh dấu hoàn thành'
              : 'Click để đánh dấu đã hoàn thành'
            : 'Đăng nhập để đánh dấu đã hoàn thành'
        }
      >
        {isPending ? (
          <Loader2 size={isSmall ? 14 : 16} className="animate-spin" />
        ) : isCompleted ? (
          <CheckCircle size={isSmall ? 14 : 16} />
        ) : (
          <Circle size={isSmall ? 14 : 16} />
        )}
        <span>{isCompleted ? 'Đã hoàn thành' : 'Đánh dấu đã xong'}</span>
      </button>

      {errorMessage && (
        <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '4px' }}>
          {errorMessage}
        </span>
      )}
    </div>
  );
}
