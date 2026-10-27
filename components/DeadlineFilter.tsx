'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Deadline, Subject } from '@/types';
import CountdownTimer from './CountdownTimer';
import MarkCompleteButton from './MarkCompleteButton';
import { Search, Filter, Calendar, ExternalLink, ArrowRight, Tag } from 'lucide-react';

interface DeadlineFilterProps {
  initialDeadlines: Deadline[];
  subjects: Subject[];
  currentUserId?: string;
}

export default function DeadlineFilter({
  initialDeadlines,
  subjects,
  currentUserId,
}: DeadlineFilterProps) {
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'dueDateAsc' | 'dueDateDesc' | 'scoreDesc'>('dueDateAsc');

  const filteredDeadlines = useMemo(() => {
    return initialDeadlines
      .filter((item) => {
        // Tìm kiếm
        const query = search.toLowerCase();
        const matchesQuery =
          !query ||
          item.title.toLowerCase().includes(query) ||
          item.subjectName.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query);

        // Môn học
        const matchesSubject =
          selectedSubject === 'all' || item.subjectSlug === selectedSubject;

        // Mức độ ưu tiên
        const matchesPriority =
          selectedPriority === 'all' || item.priority === selectedPriority;

        // Trạng thái (nếu có currentUserId)
        const isCompleted = currentUserId
          ? item.completedUsers.includes(currentUserId)
          : false;

        let matchesStatus = true;
        if (statusFilter === 'completed') matchesStatus = isCompleted;
        if (statusFilter === 'pending') matchesStatus = !isCompleted;

        return matchesQuery && matchesSubject && matchesPriority && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDateAsc') {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (sortBy === 'dueDateDesc') {
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        }
        if (sortBy === 'scoreDesc') {
          return b.maxScore - a.maxScore;
        }
        return 0;
      });
  }, [
    initialDeadlines,
    search,
    selectedSubject,
    selectedPriority,
    statusFilter,
    sortBy,
    currentUserId,
  ]);

  return (
    <div>
      {/* Search & Filter Bar */}
      <div
        className="card"
        style={{
          marginBottom: '28px',
          padding: '20px',
          backgroundColor: '#ffffff',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            alignItems: 'flex-end',
          }}
        >
          {/* Search Input */}
          <div style={{ gridColumn: 'span 2' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Search size={15} />
              <span>Tìm kiếm deadline</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Nhập tên bài tập, nội dung, mã môn..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter by Subject */}
          <div>
            <label className="form-label">Môn học</label>
            <select
              className="form-select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="all">Tất cả môn học ({subjects.length})</option>
              {subjects.map((sub) => (
                <option key={sub.slug} value={sub.slug}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Priority */}
          <div>
            <label className="form-label">Mức độ ưu tiên</label>
            <select
              className="form-select"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="all">Mọi mức độ</option>
              <option value="high">Cao (Gấp)</option>
              <option value="medium">Trung bình</option>
              <option value="low">Thấp</option>
            </select>
          </div>

          {/* Sắp xếp */}
          <div>
            <label className="form-label">Sắp xếp</label>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="dueDateAsc">Hạn nộp gần nhất</option>
              <option value="dueDateDesc">Hạn nộp xa nhất</option>
              <option value="scoreDesc">Điểm số cao nhất</option>
            </select>
          </div>
        </div>

        {/* Trạng thái hoàn thành (nếu đã đăng nhập) */}
        {currentUserId && (
          <div
            style={{
              marginTop: '16px',
              paddingTop: '14px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Trạng thái cá nhân:
            </span>
            <button
              onClick={() => setStatusFilter('all')}
              className={statusFilter === 'all' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            >
              Tất cả ({initialDeadlines.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={statusFilter === 'pending' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            >
              Chưa hoàn thành
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={statusFilter === 'completed' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            >
              Đã hoàn thành
            </button>
          </div>
        )}
      </div>

      {/* Kết quả thống kê */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', margin: 0 }}>
          Tìm thấy <strong>{filteredDeadlines.length}</strong> deadline phù hợp
        </p>
        {(search || selectedSubject !== 'all' || selectedPriority !== 'all' || statusFilter !== 'all') && (
          <button
            onClick={() => {
              setSearch('');
              setSelectedSubject('all');
              setSelectedPriority('all');
              setStatusFilter('all');
            }}
            style={{
              fontSize: '0.85rem',
              color: 'var(--primary)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Xoá bộ lọc
          </button>
        )}
      </div>

      {/* Danh sách Deadline Cards */}
      {filteredDeadlines.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '50px 20px',
            backgroundColor: '#ffffff',
          }}
        >
          <Filter size={40} style={{ color: '#94a3b8', margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Không tìm thấy deadline nào
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt các tiêu chí lọc.
          </p>
        </div>
      ) : (
        <div className="grid-cols-2">
          {filteredDeadlines.map((item) => {
            const isCompleted = currentUserId
              ? item.completedUsers.includes(currentUserId)
              : false;
            const priorityClass =
              item.priority === 'high'
                ? 'badge-high'
                : item.priority === 'medium'
                ? 'badge-medium'
                : 'badge-low';

            const priorityText =
              item.priority === 'high'
                ? 'Ưu tiên Cao'
                : item.priority === 'medium'
                ? 'Trung bình'
                : 'Ưu tiên Thấp';

            const dueDateFormatted = new Date(item.dueDate).toLocaleString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                className="card card-interactive"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderLeft: isCompleted
                    ? '4px solid var(--success)'
                    : item.priority === 'high'
                    ? '4px solid var(--danger)'
                    : '4px solid var(--primary)',
                }}
              >
                <div>
                  {/* Subject Tag & Priority */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <Link
                      href={`/subjects/${item.subjectSlug}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--accent)',
                        backgroundColor: 'var(--accent-light)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      <Tag size={12} />
                      <span>{item.subjectName}</span>
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={`badge ${priorityClass}`}>{priorityText}</span>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          backgroundColor: '#f1f5f9',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          color: '#475569',
                        }}
                      >
                        {item.maxScore}đ
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.35 }}>
                    <Link
                      href={`/deadlines/${item.id}`}
                      style={{ color: 'var(--text-main)', transition: 'color 0.2s' }}
                    >
                      {item.title}
                    </Link>
                  </h3>

                  {/* Description preview */}
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-muted)',
                      marginBottom: '16px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.description}
                  </p>
                </div>

                <div>
                  {/* Due date & Countdown */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                      padding: '10px 0',
                      borderTop: '1px solid var(--border)',
                      borderBottom: '1px solid var(--border)',
                      marginBottom: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <Calendar size={14} />
                      <span>Hạn: {dueDateFormatted}</span>
                    </div>
                    <CountdownTimer dueDate={item.dueDate} />
                  </div>

                  {/* Action buttons */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px',
                    }}
                  >
                    <MarkCompleteButton
                      deadlineId={item.id}
                      initialCompleted={isCompleted}
                      size="sm"
                    />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {item.submissionLink && (
                        <a
                          href={item.submissionLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm"
                          title="Mở liên kết nộp bài"
                        >
                          <ExternalLink size={14} />
                          <span>Link nộp</span>
                        </a>
                      )}
                      <Link
                        href={`/deadlines/${item.id}`}
                        className="btn btn-outline btn-sm"
                      >
                        <span>Chi tiết</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
