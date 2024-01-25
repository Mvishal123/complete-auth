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
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    linkAccount: async ({ user }) => {
      console.log("LINK ACCOUNT:", user);

      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async signIn({ account, user }) {
      // To check is the user is verified
      if (account?.provider !== "credentials") return true; // google and github accounts are already verified

      const existingUser = await db.user.findFirst({
        where: {
          id: user.id,
        },
      });

      if (!existingUser || !existingUser.emailVerified) return false;

      return true;
    },
    async session({ session, token }) {
      if (session?.user && token.sub) {
        session.user.userId = token.sub;
        const dbUser = await getUserById(session.user.userId);
        session.user.role = dbUser?.role ?? "USER";
      }

      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },

  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
