import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config";
import { db } from "@/lib/db";
import { getUserById } from "./utils/data";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token.sub) {
        session.user.userId = token.sub;
        const dbUser = await getUserById(session.user.userId);
        session.user.role = dbUser?.role ?? "USER";
      }
      console.log("SESSION:", { session });

      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },

  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  debug: true,
  ...authConfig,
});
