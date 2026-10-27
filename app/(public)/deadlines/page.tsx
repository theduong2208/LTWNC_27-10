import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDeadlines, getSubjects } from '@/lib/db';
import DeadlineFilter from '@/components/DeadlineFilter';
import { Calendar, RefreshCw } from 'lucide-react';

// Chiến lược: ISR (Incremental Static Regeneration), tự động làm mới sau 60 giây
export const revalidate = 60;

export const metadata = {
  title: 'Tất cả Deadline | Class Deadline Hub PTIT',
  description:
    'Danh sách tổng hợp toàn bộ bài tập và hạn nộp của các môn học lớp PTIT. Dữ liệu được cập nhật theo chu kỳ ISR 60s.',
};

export default async function DeadlinesPage() {
  const [deadlines, subjects, session] = await Promise.all([
    getDeadlines(),
    getSubjects(),
    getServerSession(authOptions),
  ]);

  return (
    <div className="container" style={{ padding: '40px 20px 80px 20px' }}>
      {/* Header section */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge-strategy">ISR - Revalidate: 60s</span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <RefreshCw size={13} />
            Tự động sinh lại trang sau mỗi 60 giây hoặc khi có dữ liệu mới
          </span>
        </div>

        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '8px' }}>
          Danh sách Deadline Toàn Lớp
        </h1>

        <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
          Theo dõi tổng cộng {deadlines.length} bài tập từ {subjects.length} môn học. Sử dụng bộ lọc để tìm kiếm bài tập của bạn.
        </p>
      </div>

      {/* Interactive Filter Client Component */}
      <DeadlineFilter
        initialDeadlines={deadlines}
        subjects={subjects}
        currentUserId={session?.user?.id}
      />
    </div>
  );
}
