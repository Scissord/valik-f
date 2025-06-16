import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { z } from "zod";

// Временные фиктивные данные для демонстрации
const mockUsers = [
  {
    id: "1",
    name: "Администратор",
    email: "admin@example.com",
    password: "$2a$10$Qka1.EtdnQGnQTCVvlAFUOu.7ByBcSpqpP/Xjc3KaGHQ9h7LIkp9m", // password: 123456
    role: "admin",
    emailVerified: new Date(),
  },
  {
    id: "2",
    name: "Пользователь",
    email: "user@example.com",
    password: "$2a$10$Qka1.EtdnQGnQTCVvlAFUOu.7ByBcSpqpP/Xjc3KaGHQ9h7LIkp9m", // password: 123456
    role: "user",
    emailVerified: new Date(),
  },
];

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.data = user;
      }
      return token;
    },

    session({ session, token }) {
      session.user = token.data as any;
      return session;
    },
  },

  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        // Поиск пользователя в фиктивных данных
        // В будущем здесь будет запрос к API бэкенда
        const user = mockUsers.find(
          (user) => user.email.toLowerCase() === email.toLowerCase()
        );

        if (!user) return null;

        // Сравнение паролей
        if (!bcryptjs.compareSync(password, user.password)) return null;

        // Возврат пользователя без пароля
        const { password: _, ...rest } = user;

        return rest;
      },
    }),
  ],
};

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);