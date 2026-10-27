'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { can } from '@/lib/permissions';
import {
  createDeadline,
  deleteDeadline,
  getSubjectBySlug,
  toggleCompleteDeadline,
  getDeadlineById,
} from '@/lib/db';

export type ActionResult<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string>;
};

/**
 * Server Action: Đánh dấu hoàn thành deadline cho sinh viên đăng nhập
 * Phân quyền: can(role, 'mark_complete') - User và Admin được phép
 */
export async function markCompleteAction(deadlineId: string): Promise<ActionResult<{ completed: boolean }>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Bạn cần đăng nhập để đánh dấu hoàn thành deadline.',
      };
    }

    // Kiểm tra quyền theo ma trận
    if (!can(session.user.role, 'mark_complete')) {
      return {
        success: false,
        message: 'Tài khoản của bạn không có quyền đánh dấu deadline.',
      };
    }

    if (!deadlineId || typeof deadlineId !== 'string') {
      return {
        success: false,
        message: 'Mã deadline không hợp lệ.',
      };
    }

    const existing = await getDeadlineById(deadlineId);
    if (!existing) {
      return {
        success: false,
        message: 'Deadline không tồn tại trong hệ thống.',
      };
    }

    const result = await toggleCompleteDeadline(deadlineId, session.user.id);
    if (!result) {
      return {
        success: false,
        message: 'Không thể cập nhật trạng thái deadline.',
      };
    }

    // Revalidate các trang liên quan
    revalidatePath('/deadlines');
    revalidatePath(`/deadlines/${deadlineId}`);
    revalidatePath('/dashboard');
    revalidatePath('/');

    return {
      success: true,
      data: { completed: result.completed },
      message: result.completed ? 'Đã đánh dấu hoàn thành!' : 'Đã bỏ đánh dấu hoàn thành.',
    };
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái deadline:', error);
    return {
      success: false,
      message: 'Đã xảy ra lỗi máy chủ, vui lòng thử lại sau.',
    };
  }
}

/**
 * Server Action: Thêm deadline mới
 * Phân quyền: can(role, 'create_deadline') - Chỉ Admin (Lớp trưởng)
 */
export async function createDeadlineAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Vui lòng đăng nhập với tài khoản Lớp trưởng.',
      };
    }

    // Kiểm tra quyền nghiêm ngặt tại Server Action
    if (!can(session.user.role, 'create_deadline')) {
      return {
        success: false,
        message: 'Lỗi phân quyền: Chỉ Lớp trưởng (Admin) mới có quyền tạo deadline.',
      };
    }

    // Trích xuất dữ liệu form
    const title = (formData.get('title') as string || '').trim();
    const subjectSlug = (formData.get('subjectSlug') as string || '').trim();
    const description = (formData.get('description') as string || '').trim();
    const dueDate = (formData.get('dueDate') as string || '').trim();
    const priority = (formData.get('priority') as 'high' | 'medium' | 'low') || 'medium';
    const submissionLink = (formData.get('submissionLink') as string || '').trim();
    const maxScore = Number(formData.get('maxScore')) || 10;

    // Validate dữ liệu đầu vào
    const errors: Record<string, string> = {};

    if (!title || title.length < 5) {
      errors.title = 'Tiêu đề deadline phải có ít nhất 5 ký tự.';
    } else if (title.length > 200) {
      errors.title = 'Tiêu đề không được vượt quá 200 ký tự.';
    }

    if (!subjectSlug) {
      errors.subjectSlug = 'Vui lòng chọn môn học.';
    }

    const subject = await getSubjectBySlug(subjectSlug);
    if (!subject) {
      errors.subjectSlug = 'Môn học được chọn không hợp lệ.';
    }

    if (!description || description.length < 10) {
      errors.description = 'Mô tả chi tiết phải có ít nhất 10 ký tự.';
    }

    if (!dueDate) {
      errors.dueDate = 'Vui lòng chọn thời hạn nộp bài.';
    } else {
      const parsedDate = new Date(dueDate);
      if (isNaN(parsedDate.getTime())) {
        errors.dueDate = 'Thời hạn nộp bài không đúng định dạng ngày giờ.';
      }
    }

    if (!['high', 'medium', 'low'].includes(priority)) {
      errors.priority = 'Mức độ ưu tiên không hợp lệ.';
    }

    if (!submissionLink) {
      errors.submissionLink = 'Vui lòng nhập đường link nộp bài.';
    } else {
      try {
        new URL(submissionLink);
      } catch {
        errors.submissionLink = 'Đường link nộp bài phải là một URL hợp lệ (ví dụ: https://...).';
      }
    }

    if (maxScore < 1 || maxScore > 100) {
      errors.maxScore = 'Thang điểm phải từ 1 đến 100.';
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Dữ liệu không hợp lệ, vui lòng kiểm tra lại các trường bị lỗi.',
        errors,
      };
    }

    // Thêm deadline vào DB file
    const newDeadline = await createDeadline({
      title,
      subjectSlug,
      subjectName: subject!.name,
      description,
      dueDate,
      priority,
      submissionLink,
      maxScore,
    });

    // Làm mới ISR ngay lập tức cho các trang
    revalidatePath('/deadlines');
    revalidatePath(`/deadlines/${newDeadline.id}`);
    revalidatePath(`/subjects/${subjectSlug}`);
    revalidatePath('/dashboard');
    revalidatePath('/admin');
    revalidatePath('/');

    return {
      success: true,
      message: 'Thêm deadline mới thành công!',
      data: { id: newDeadline.id },
    };
  } catch (error) {
    console.error('Lỗi khi tạo deadline:', error);
    return {
      success: false,
      message: 'Đã xảy ra lỗi máy chủ trong quá trình thêm deadline.',
    };
  }
}

/**
 * Server Action: Xoá deadline
 * Phân quyền: can(role, 'delete_deadline') - Chỉ Admin (Lớp trưởng)
 */
export async function deleteDeadlineAction(id: string): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Vui lòng đăng nhập với tài khoản Lớp trưởng.',
      };
    }

    // Kiểm tra quyền nghiêm ngặt
    if (!can(session.user.role, 'delete_deadline')) {
      return {
        success: false,
        message: 'Lỗi phân quyền: Chỉ Lớp trưởng mới có quyền xoá deadline.',
      };
    }

    if (!id) {
      return {
        success: false,
        message: 'Mã deadline không hợp lệ.',
      };
    }

    const item = await getDeadlineById(id);
    if (!item) {
      return {
        success: false,
        message: 'Deadline cần xoá không tồn tại.',
      };
    }

    const success = await deleteDeadline(id);
    if (!success) {
      return {
        success: false,
        message: 'Không thể xoá deadline khỏi cơ sở dữ liệu.',
      };
    }

    // Làm mới ISR ngay lập tức
    revalidatePath('/deadlines');
    revalidatePath(`/deadlines/${id}`);
    revalidatePath(`/subjects/${item.subjectSlug}`);
    revalidatePath('/dashboard');
    revalidatePath('/admin');
    revalidatePath('/');

    return {
      success: true,
      message: 'Đã xoá deadline thành công.',
    };
  } catch (error) {
    console.error('Lỗi khi xoá deadline:', error);
    return {
      success: false,
      message: 'Đã xảy ra lỗi máy chủ trong quá trình xoá deadline.',
    };
  }
}
