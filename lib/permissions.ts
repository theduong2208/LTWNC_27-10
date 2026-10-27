import { Role, Action } from '@/types';

/**
 * Ma trận phân quyền duy nhất của hệ thống Class Deadline Hub
 *
 * Hành động           guest    user    admin
 * Xem deadline        ✓        ✓       ✓
 * Đánh dấu đã xong   ✗        ✓       ✓
 * Thêm deadline       ✗        ✗       ✓
 * Xoá deadline        ✗        ✗       ✓
 */
const PERMISSION_MATRIX: Record<Role, Record<Action, boolean>> = {
  guest: {
    view_deadline: true,
    mark_complete: false,
    create_deadline: false,
    delete_deadline: false,
  },
  user: {
    view_deadline: true,
    mark_complete: true,
    create_deadline: false,
    delete_deadline: false,
  },
  admin: {
    view_deadline: true,
    mark_complete: true,
    create_deadline: true,
    delete_deadline: true,
  },
};

/**
 * Kiểm tra xem một vai trò (role) có quyền thực hiện hành động (action) hay không
 * @param role 'admin' | 'user' | 'guest'
 * @param action 'view_deadline' | 'mark_complete' | 'create_deadline' | 'delete_deadline'
 */
export function can(role: Role | undefined | null, action: Action): boolean {
  const currentRole: Role = role || 'guest';
  const rolePermissions = PERMISSION_MATRIX[currentRole];
  if (!rolePermissions) return false;
  return !!rolePermissions[action];
}
