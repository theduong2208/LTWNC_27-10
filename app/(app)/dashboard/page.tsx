import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDeadlines, getSubjects } from '@/lib/db';
import CountdownTimer from '@/components/CountdownTimer';
import MarkCompleteButton from '@/components/MarkCompleteButton';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  BookOpen,
  Calendar,
  ExternalLink,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

// Chiến lược: SSR (Server-Side Rendering) - Luôn render dữ liệu động theo phiên đăng nhập
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dashboard Cá nhân | Class Deadline Hub PTIT',
  description: 'Theo dõi tiến độ bài tập và hoàn thành deadline học tập cá nhân.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const session = await getServerSession(authOptions);

  // Tự kiểm tra session phía server (phòng thủ đa lớp)
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  const userId = session.user.id;
  const [allDeadlines, subjects] = await Promise.all([
    getDeadlines(),
    getSubjects(),
  ]);

  const activeTab = searchParams.tab || 'all';

  // Thống kê cá nhân
  const completedDeadlines = allDeadlines.filter((d) =>
    d.completedUsers.includes(userId)
  );
  const pendingDeadlines = allDeadlines.filter(
    (d) => !d.completedUsers.includes(userId)
  );

  const now = new Date().getTime();
  const overdueDeadlines = pendingDeadlines.filter(
    (d) => new Date(d.dueDate).getTime() < now
  );

  const completionRate =
    allDeadlines.length > 0
      ? Math.round((completedDeadlines.length / allDeadlines.length) * 100)
      : 0;

  // Lọc theo tab hiện tại
  let displayDeadlines = allDeadlines;
  if (activeTab === 'completed') {
    displayDeadlines = completedDeadlines;
  } else if (activeTab === 'pending') {
    displayDeadlines = pendingDeadlines;
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
      {/* Welcome Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge-strategy">SSR Page</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Phiên đăng nhập thực tế của bạn
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Xin chào, {session.user.name}! 👋
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Lớp: <strong>{session.user.classCode || 'D21CQCN01-B'}</strong> • Vai trò:{' '}
            <strong style={{ color: session.user.role === 'admin' ? '#dc2626' : '#2563eb' }}>
              {session.user.role === 'admin' ? 'Lớp trưởng (Admin)' : 'Sinh viên'}
            </strong>
          </p>
        </div>

        {session.user.role === 'admin' && (
          <Link href="/admin" className="btn btn-primary">
            <span>Đến Bảng Quản trị Admin</span>
            <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {/* Progress Cards Overview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Tổng Deadline
            </span>
            <Calendar size={18} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {allDeadlines.length}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Từ {subjects.length} môn học
          </span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Đã Hoàn Thành
            </span>
            <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--success)' }}>
            {completedDeadlines.length}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Tỷ lệ đạt: {completionRate}%
          </span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Chưa Hoàn Thành
            </span>
            <Clock size={18} style={{ color: 'var(--warning)' }} />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--warning)' }}>
            {pendingDeadlines.length}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Cần tiếp tục thực hiện
          </span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Đã Quá Hạn
            </span>
            <AlertTriangle size={18} style={{ color: 'var(--danger)' }} />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--danger)' }}>
            {overdueDeadlines.length}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Cần nộp bù gấp
          </span>
        </div>
      </div>

      {/* Progress Bar Widget */}
      <div
        className="card"
        style={{
          marginBottom: '32px',
          padding: '24px',
          backgroundColor: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>Tiến độ hoàn thành bài tập kỳ này</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>
            {completionRate}%
          </span>
        </div>

        <div
          style={{
            height: '10px',
            backgroundColor: '#e2e8f0',
            borderRadius: '9999px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${completionRate}%`,
              backgroundColor: completionRate >= 70 ? 'var(--success)' : completionRate >= 40 ? 'var(--warning)' : 'var(--primary)',
              borderRadius: '9999px',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* Deadlines List */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
            {activeTab === 'completed'
              ? 'Bài tập đã hoàn thành'
              : activeTab === 'pending'
              ? 'Bài tập cần làm gấp'
              : 'Toàn bộ bài tập của lớp'}
          </h2>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Link
              href="/dashboard"
              className={activeTab === 'all' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            >
              Tất cả ({allDeadlines.length})
            </Link>
            <Link
              href="/dashboard?tab=pending"
              className={activeTab === 'pending' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            >
              Cần làm ({pendingDeadlines.length})
            </Link>
            <Link
              href="/dashboard?tab=completed"
              className={activeTab === 'completed' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            >
              Đã xong ({completedDeadlines.length})
            </Link>
          </div>
        </div>

        {displayDeadlines.length === 0 ? (
          <div
            className="card"
            style={{ textAlign: 'center', padding: '50px 20px', backgroundColor: '#fff' }}
          >
            <CheckCircle2 size={40} style={{ color: '#16a34a', margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Không có bài tập nào trong mục này</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Tuyệt vời! Bạn không còn deadline tồn đọng ở tiêu chí này.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {displayDeadlines.map((item) => {
              const isItemCompleted = item.completedUsers.includes(userId);
              return (
                <div
                  key={item.id}
                  className="card card-interactive"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 24px',
                    borderLeft: isItemCompleted
                      ? '5px solid var(--success)'
                      : item.priority === 'high'
                      ? '5px solid var(--danger)'
                      : '5px solid var(--primary)',
                    backgroundColor: '#ffffff',
                    flexWrap: 'wrap',
                    gap: '16px',
                  }}
                >
                  <div style={{ flex: '1 1 300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: 'var(--accent)',
                          backgroundColor: 'var(--accent-light)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        {item.subjectName}
                      </span>
                      <span
                        className={`badge ${
                          item.priority === 'high'
                            ? 'badge-high'
                            : item.priority === 'medium'
                            ? 'badge-medium'
                            : 'badge-low'
                        }`}
                        style={{ fontSize: '0.7rem' }}
                      >
                        {item.priority === 'high' ? 'Gấp' : 'Bình thường'}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                        {item.maxScore}đ
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
                      <Link
                        href={`/deadlines/${item.id}`}
                        style={{
                          textDecoration: isItemCompleted ? 'line-through' : 'none',
                          color: isItemCompleted ? '#94a3b8' : 'var(--text-main)',
                        }}
                      >
                        {item.title}
                      </Link>
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        Hạn nộp: {new Date(item.dueDate).toLocaleString('vi-VN')}
                      </span>
                      <CountdownTimer dueDate={item.dueDate} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MarkCompleteButton
                      deadlineId={item.id}
                      initialCompleted={isItemCompleted}
                      size="md"
                    />

                    {item.submissionLink && (
                      <a
                        href={item.submissionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        title="Mở link nộp bài"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}

                    <Link href={`/deadlines/${item.id}`} className="btn btn-outline btn-sm">
                      <span>Xem</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
