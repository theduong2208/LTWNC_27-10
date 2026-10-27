import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { can } from '@/lib/permissions';
import { getDeadlines, getSubjects } from '@/lib/db';
import CreateDeadlineForm from '@/components/CreateDeadlineForm';
import DeleteDeadlineButton from '@/components/DeleteDeadlineButton';
import {
  ShieldAlert,
  Calendar,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Info,
} from 'lucide-react';

// Chiến lược: SSR (Server-Side Rendering) - Chỉ Admin
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Khu vực Quản trị Lớp trưởng | Class Deadline Hub PTIT',
  description: 'Trang quản trị dành riêng cho Lớp trưởng thêm và xoá deadline.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Yêu cầu 11 & 12: Phân quyền không chỉ dựa vào Middleware
  // Trang /admin tự kiểm tra quyền phía server (Defense-in-depth)
  if (!session?.user) {
    redirect('/login?callbackUrl=/admin');
  }

  if (session.user.role !== 'admin' || !can(session.user.role, 'create_deadline')) {
    redirect('/403');
  }

  const [deadlines, subjects] = await Promise.all([
    getDeadlines(),
    getSubjects(),
  ]);

  return (
    <div className="container" style={{ padding: '30px 20px 80px 20px', maxWidth: '1180px' }}>
      {/* Admin Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-strategy">SSR Page</span>
            <span className="badge badge-role-admin">
              <ShieldCheck size={12} />
              Quyền Admin Lớp trưởng
            </span>
          </div>

          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#991b1b', margin: 0 }}>
            Bảng Quản trị Deadline Lớp
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Xin chào Lớp trưởng <strong>{session.user.name}</strong> ({session.user.email}). Bạn có toàn quyền thêm và xoá deadline.
          </p>
        </div>

        <Link href="/dashboard" className="btn btn-secondary">
          <span>Xem Dashboard Sinh viên</span>
        </Link>
      </div>

      {/* Defense-in-depth Alert Note */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '16px 20px',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-md)',
          marginBottom: '32px',
          fontSize: '0.9rem',
          color: '#1e40af',
        }}
      >
        <Info size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Cơ chế Bảo mật Đa Lớp (Defense-in-Depth):</strong> Trang này và tất cả Server Actions (Thêm/Xoá deadline)
          đều được kiểm tra quyền <code>can(role, action)</code> độc lập phía máy chủ, không phụ thuộc duy nhất vào Middleware.
          Khi bạn thêm hoặc xoá bài tập, Next.js sẽ kích hoạt On-demand Revalidation (ISR) để cập nhật trang công khai ngay lập tức.
        </div>
      </div>

      {/* Form Tạo Deadline Mới */}
      <CreateDeadlineForm subjects={subjects} />

      {/* Danh sách Quản lý Deadline Hiện có */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
            Quản lý Deadline Hiện có ({deadlines.length})
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Hành động xoá sẽ gọi revalidatePath tức thì
          </span>
        </div>

        <div
          className="card"
          style={{
            overflowX: 'auto',
            padding: 0,
            backgroundColor: '#ffffff',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '780px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '14px 18px', fontWeight: 700, fontSize: '0.85rem' }}>Mã</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, fontSize: '0.85rem' }}>Môn học</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, fontSize: '0.85rem' }}>Tiêu đề Deadline</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, fontSize: '0.85rem' }}>Hạn nộp bài</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, fontSize: '0.85rem' }}>Ưu tiên</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, fontSize: '0.85rem' }}>Đã nộp</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, fontSize: '0.85rem', textAlign: 'right' }}>
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {deadlines.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    #{item.id}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '0.85rem' }}>
                    <span
                      style={{
                        backgroundColor: '#f1f5f9',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontWeight: 600,
                        color: 'var(--accent)',
                      }}
                    >
                      {item.subjectName}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 600, fontSize: '0.92rem' }}>
                    <Link
                      href={`/deadlines/${item.id}`}
                      style={{ color: 'var(--text-main)' }}
                      title="Xem trang chi tiết công khai"
                    >
                      {item.title}
                    </Link>
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                    {new Date(item.dueDate).toLocaleString('vi-VN')}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
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
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '0.85rem', fontWeight: 600 }}>
                    {item.completedUsers.length} SV
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
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
                      <DeleteDeadlineButton id={item.id} title={item.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
