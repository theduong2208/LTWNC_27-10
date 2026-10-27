'use client';

import { useState, useTransition, useRef } from 'react';
import { Subject } from '@/types';
import { createDeadlineAction, ActionResult } from '@/actions/deadline-actions';
import { PlusCircle, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface CreateDeadlineFormProps {
  subjects: Subject[];
}

export default function CreateDeadlineForm({ subjects }: CreateDeadlineFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult<{ id: string }> | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResult(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await createDeadlineAction(null, formData);
      setResult(res);
      if (res.success) {
        formRef.current?.reset();
      }
    });
  };

  return (
    <div
      className="card"
      style={{
        padding: '28px',
        backgroundColor: '#ffffff',
        borderTop: '5px solid #dc2626',
        marginBottom: '40px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <PlusCircle size={22} style={{ color: '#dc2626' }} />
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
          Thêm Deadline Mới Cho Lớp
        </h2>
        <span className="badge badge-strategy" style={{ marginLeft: 'auto' }}>
          Server Action + On-Demand ISR
        </span>
      </div>

      {result?.success && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'var(--success-bg)',
            color: 'var(--success)',
            border: '1px solid var(--success-border)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            fontSize: '0.9rem',
          }}
        >
          <CheckCircle size={18} />
          <span>{result.message} Các trang ISR đã được làm mới tức thì!</span>
        </div>
      )}

      {result && !result.success && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger)',
            border: '1px solid var(--danger-border)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            fontSize: '0.9rem',
          }}
        >
          <AlertCircle size={18} />
          <span>{result.message}</span>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Tiêu đề */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label" htmlFor="title">
              Tiêu đề bài tập / Deadline <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="form-input"
              placeholder="vd: Bài tập lớn Buổi 8 - NextAuth & Phân quyền Ma trận"
            />
            {result?.errors?.title && (
              <p className="form-error">{result.errors.title}</p>
            )}
          </div>

          {/* Chọn môn học */}
          <div className="form-group">
            <label className="form-label" htmlFor="subjectSlug">
              Môn học phụ trách <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <select id="subjectSlug" name="subjectSlug" required className="form-select">
              <option value="">-- Chọn môn học --</option>
              {subjects.map((sub) => (
                <option key={sub.slug} value={sub.slug}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
            {result?.errors?.subjectSlug && (
              <p className="form-error">{result.errors.subjectSlug}</p>
            )}
          </div>

          {/* Mức độ ưu tiên */}
          <div className="form-group">
            <label className="form-label" htmlFor="priority">
              Mức độ ưu tiên
            </label>
            <select id="priority" name="priority" className="form-select" defaultValue="medium">
              <option value="high">Cao (Cần nộp gấp)</option>
              <option value="medium">Trung bình</option>
              <option value="low">Thấp</option>
            </select>
            {result?.errors?.priority && (
              <p className="form-error">{result.errors.priority}</p>
            )}
          </div>

          {/* Hạn nộp */}
          <div className="form-group">
            <label className="form-label" htmlFor="dueDate">
              Thời hạn nộp bài (Ngày & Giờ) <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="datetime-local"
              required
              className="form-input"
            />
            {result?.errors?.dueDate && (
              <p className="form-error">{result.errors.dueDate}</p>
            )}
          </div>

          {/* Thang điểm */}
          <div className="form-group">
            <label className="form-label" htmlFor="maxScore">
              Thang điểm tối đa
            </label>
            <input
              id="maxScore"
              name="maxScore"
              type="number"
              defaultValue={10}
              min={1}
              max={100}
              className="form-input"
            />
            {result?.errors?.maxScore && (
              <p className="form-error">{result.errors.maxScore}</p>
            )}
          </div>

          {/* Link nộp bài */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label" htmlFor="submissionLink">
              Đường link nộp bài (Google Drive, Classroom, Teams...) <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              id="submissionLink"
              name="submissionLink"
              type="url"
              required
              className="form-input"
              placeholder="https://classroom.google.com/..."
            />
            {result?.errors?.submissionLink && (
              <p className="form-error">{result.errors.submissionLink}</p>
            )}
          </div>

          {/* Mô tả chi tiết */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label" htmlFor="description">
              Mô tả chi tiết yêu cầu đề bài <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              className="form-textarea"
              placeholder="Nêu rõ các yêu cầu kỹ thuật, cách thức nộp file, quy ước đặt tên bài nộp..."
            />
            {result?.errors?.description && (
              <p className="form-error">{result.errors.description}</p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
          <button
            type="submit"
            disabled={isPending}
            className="btn btn-primary"
            style={{ backgroundColor: '#dc2626' }}
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Đang xử lý & Tái tạo ISR...</span>
              </>
            ) : (
              <>
                <PlusCircle size={16} />
                <span>Tạo Deadline và Cập nhật Tức thì</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
