import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getUserByEmail } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 ngày
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@ptit.edu.vn' },
        password: { label: 'Mật khẩu', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Vui lòng nhập đầy đủ email và mật khẩu');
        }

        const user = await getUserByEmail(credentials.email);
        if (!user) {
          throw new Error('Tài khoản không tồn tại trong hệ thống');
        }

        if (user.password !== credentials.password) {
          throw new Error('Mật khẩu không chính xác');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          classCode: user.classCode,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.classCode = user.classCode;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.classCode = token.classCode;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'class-deadline-hub-super-secret-key-ptit-2026',
};
