import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSubjectBySlug, getSubjects, getDeadlinesBySubject } from '@/lib/db';
import CountdownTimer from '@/components/CountdownTimer';
import MarkCompleteButton from '@/components/MarkCompleteButton';
import { BookOpen, User, Award, Calendar, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';

// Chiến lược: SSG (Static Site Generation)
export const dynamic = 'force-static';

export async function generateStaticParams() {
  const subjects = await getSubjects();
  return subjects.map((subject) => ({
    slug: subject.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const subject = await getSubjectBySlug(params.slug);
  if (!subject) {
    return {
      title: 'Môn học không tồn tại',
    };
  }

  return {
    title: `Môn ${subject.name} (${subject.code}) | Class Deadline Hub`,
    description: subject.description,
    openGraph: {
      title: `${subject.name} - Deadline lớp PTIT`,
      description: subject.description,
    },
  };
}

export default async function SubjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const subject = await getSubjectBySlug(params.slug);

  if (!subject) {
    notFound();
  }

  const deadlines = await getDeadlinesBySubject(params.slug);

  return (
    <div className="container" style={{ padding: '40px 20px 80px 20px' }}>
      {/* Back button & Breadcrumb */}
      <div style={{ marginBottom: '24px' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={16} />
          <span>Quay lại Trang chủ</span>
        </Link>
      </div>

      {/* Subject Header Card */}
      <div
        className="card"
        style={{
          borderTop: `6px solid ${subject.color}`,
          marginBottom: '36px',
          padding: '32px',
          backgroundColor: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              backgroundColor: '#f1f5f9',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              color: '#334155',
            }}
          >
            MÃ MÔN: {subject.code}
          </span>
          <span className="badge-strategy">SSG Page</span>
        </div>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.25 }}>
          {subject.name}
        </h1>

        <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '24px' }}>
          {subject.description}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={20} style={{ color: subject.color }} />
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>
                Giảng viên phụ trách
              </span>
              <strong style={{ fontSize: '0.92rem' }}>{subject.lecturer}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={20} style={{ color: subject.color }} />
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>
                Số tín chỉ
              </span>
              <strong style={{ fontSize: '0.92rem' }}>{subject.credits} Tín chỉ học phần</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={20} style={{ color: subject.color }} />
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>
                Tổng số Deadline
              </span>
              <strong style={{ fontSize: '0.92rem' }}>{deadlines.length} bài tập</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Deadlines Section */}
      <div>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            Danh sách bài tập & Deadline môn {subject.name}
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Theo dõi thời hạn và nộp bài đúng hạn
          </p>
        </div>

        {deadlines.length === 0 ? (
          <div
            className="card"
            style={{ textAlign: 'center', padding: '40px', backgroundColor: '#fff' }}
          >
            <p style={{ color: 'var(--text-muted)' }}>Môn học này hiện chưa có deadline nào.</p>
          </div>
        ) : (
          <div className="grid-cols-2">
            {deadlines.map((item) => (
              <div
                key={item.id}
                className="card card-interactive"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffffff',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px',
                    }}
                  >
                    <span
                      className={`badge ${
                        item.priority === 'high'
                          ? 'badge-high'
                          : item.priority === 'medium'
                          ? 'badge-medium'
                          : 'badge-low'
                      }`}
                    >
                      {item.priority === 'high'
                        ? 'Ưu tiên Cao'
                        : item.priority === 'medium'
                        ? 'Trung bình'
                        : 'Ưu tiên Thấp'}
                    </span>

                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>
                      Thang điểm: {item.maxScore}đ
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>
                    <Link href={`/deadlines/${item.id}`}>{item.title}</Link>
                  </h3>

                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-muted)',
                      marginBottom: '16px',
                      lineHeight: 1.5,
                    }}
                  >
                    {item.description}
                  </p>
                </div>

                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 0',
                      borderTop: '1px solid var(--border)',
                      marginBottom: '14px',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Hạn nộp: {new Date(item.dueDate).toLocaleString('vi-VN')}
                    </span>
                    <CountdownTimer dueDate={item.dueDate} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <MarkCompleteButton
                      deadlineId={item.id}
                      initialCompleted={false}
                      size="sm"
                    />

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {item.submissionLink && (
                        <a
                          href={item.submissionLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm"
                        >
                          <ExternalLink size={14} />
                          <span>Link nộp</span>
                        </a>
                      )}
                      <Link href={`/deadlines/${item.id}`} className="btn btn-outline btn-sm">
                        <span>Chi tiết</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
