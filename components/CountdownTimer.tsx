'use client';

import { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface CountdownTimerProps {
  dueDate: string;
}

export default function CountdownTimer({ dueDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    isExpired: boolean;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    formattedText: string;
  } | null>(null);

  useEffect(() => {
    function calculate() {
      const target = new Date(dueDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      const isExpired = diff <= 0;
      const absoluteDiff = Math.abs(diff);

      const days = Math.floor(absoluteDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((absoluteDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((absoluteDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((absoluteDiff % (1000 * 60)) / 1000);

      let formattedText = '';
      if (isExpired) {
        if (days > 0) {
          formattedText = `Quá hạn ${days} ngày ${hours} giờ`;
        } else if (hours > 0) {
          formattedText = `Quá hạn ${hours} giờ ${minutes} phút`;
        } else {
          formattedText = `Quá hạn ${minutes} phút ${seconds} giây`;
        }
      } else {
        if (days > 0) {
          formattedText = `Còn ${days} ngày ${hours} giờ`;
        } else if (hours > 0) {
          formattedText = `Còn ${hours} giờ ${minutes} phút`;
        } else {
          formattedText = `Còn ${minutes} phút ${seconds} giây`;
        }
      }

      setTimeLeft({
        isExpired,
        days,
        hours,
        minutes,
        seconds,
        formattedText,
      });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [dueDate]);

  if (!timeLeft) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
        }}
      >
        <Clock size={15} />
        <span>Đang tính thời gian...</span>
      </span>
    );
  }

  const { isExpired, formattedText } = timeLeft;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.85rem',
        fontWeight: 600,
        backgroundColor: isExpired ? '#fee2e2' : timeLeft.days <= 2 ? '#fef3c7' : '#ecfdf5',
        color: isExpired ? '#b91c1c' : timeLeft.days <= 2 ? '#b45309' : '#047857',
        border: `1px solid ${
          isExpired ? '#fca5a5' : timeLeft.days <= 2 ? '#fcd34d' : '#a7f3d0'
        }`,
      }}
    >
      {isExpired ? (
        <AlertTriangle size={15} />
      ) : timeLeft.days <= 2 ? (
        <Clock size={15} className="animate-pulse" />
      ) : (
        <CheckCircle2 size={15} />
      )}
      <span>{formattedText}</span>
    </div>
  );
}
