import { Role } from './index';
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'admin' | 'user';
      classCode?: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    role: 'admin' | 'user';
    classCode?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'admin' | 'user';
    classCode?: string;
  }
}
