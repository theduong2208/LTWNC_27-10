export type Role = 'admin' | 'user' | 'guest';

export type Action = 'view_deadline' | 'mark_complete' | 'create_deadline' | 'delete_deadline';

export interface Subject {
  slug: string;
  code: string;
  name: string;
  credits: number;
  lecturer: string;
  description: string;
  color: string;
}

export interface Deadline {
  id: string;
  title: string;
  subjectSlug: string;
  subjectName: string;
  description: string;
  dueDate: string; // ISO string
  priority: 'high' | 'medium' | 'low';
  submissionLink: string;
  maxScore: number;
  completedUsers: string[];
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: 'admin' | 'user';
  classCode: string;
}

export interface DbData {
  subjects: Subject[];
  deadlines: Deadline[];
  users: User[];
}
