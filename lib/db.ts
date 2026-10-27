import fs from 'fs/promises';
import path from 'path';
import { DbData, Deadline, Subject, User } from '@/types';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export async function getDbData(): Promise<DbData> {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(raw) as DbData;
  } catch (error) {
    console.error('Lỗi khi đọc file db.json:', error);
    return { subjects: [], deadlines: [], users: [] };
  }
}

export async function saveDbData(data: DbData): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getSubjects(): Promise<Subject[]> {
  const data = await getDbData();
  return data.subjects;
}

export async function getSubjectBySlug(slug: string): Promise<Subject | null> {
  const data = await getDbData();
  const subject = data.subjects.find((s) => s.slug === slug);
  return subject || null;
}

export async function getDeadlines(): Promise<Deadline[]> {
  const data = await getDbData();
  // Sắp xếp theo hạn nộp gần nhất
  return data.deadlines.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
}

export async function getDeadlineById(id: string): Promise<Deadline | null> {
  const data = await getDbData();
  const item = data.deadlines.find((d) => d.id === id);
  return item || null;
}

export async function getDeadlinesBySubject(slug: string): Promise<Deadline[]> {
  const data = await getDbData();
  return data.deadlines
    .filter((d) => d.subjectSlug === slug)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

export async function createDeadline(
  input: Omit<Deadline, 'id' | 'createdAt' | 'completedUsers'>
): Promise<Deadline> {
  const data = await getDbData();
  const newId = (
    data.deadlines.length > 0
      ? Math.max(...data.deadlines.map((d) => parseInt(d.id, 10) || 0)) + 1
      : 1
  ).toString();

  const newDeadline: Deadline = {
    ...input,
    id: newId,
    completedUsers: [],
    createdAt: new Date().toISOString(),
  };

  data.deadlines.push(newDeadline);
  await saveDbData(data);
  return newDeadline;
}

export async function deleteDeadline(id: string): Promise<boolean> {
  const data = await getDbData();
  const initialLength = data.deadlines.length;
  data.deadlines = data.deadlines.filter((d) => d.id !== id);
  if (data.deadlines.length < initialLength) {
    await saveDbData(data);
    return true;
  }
  return false;
}

export async function toggleCompleteDeadline(
  id: string,
  userId: string
): Promise<{ completed: boolean; deadline: Deadline } | null> {
  const data = await getDbData();
  const deadline = data.deadlines.find((d) => d.id === id);
  if (!deadline) return null;

  const isCompleted = deadline.completedUsers.includes(userId);
  if (isCompleted) {
    deadline.completedUsers = deadline.completedUsers.filter((u) => u !== userId);
  } else {
    deadline.completedUsers.push(userId);
  }

  await saveDbData(data);
  return { completed: !isCompleted, deadline };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const data = await getDbData();
  const user = data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  return user || null;
}
