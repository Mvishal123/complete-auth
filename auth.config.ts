import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

import { loginSchema } from "@/schemas";
import { getUserByEmail } from "./utils/data";

export default {
  providers: [
    CredentialsProvider({
      name: "credentials",
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          if (!email || !password) return null;

          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
