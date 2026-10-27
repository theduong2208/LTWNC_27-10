import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
      }}
    >
      <Loader2 size={44} className="animate-spin" style={{ color: 'var(--primary)' }} />
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>
          Đang tải dữ liệu Class Deadline Hub...
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Vui lòng đợi trong giây lát
        </p>
      </div>
    </div>
  );
}
