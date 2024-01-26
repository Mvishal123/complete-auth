import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config";
import { db } from "@/lib/db";
import { getUserById } from "./utils/data";
import { getTwoFactorConfirmationByUserId } from "./utils/two-factor-auth-confiramtion";
import { UserRole } from "@prisma/client";

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

      if (existingUser.twoFactorEnabled) {
        const confirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        if (!confirmation) return false;

        //delete the confirmation so that user has to perform 2FA for every login
        await db.twoFactorConfirmation.delete({
          where: {
            userId: user.id,
          },
        });
      }

      return true;
    },
    async session({ session, token }) {
      if (session?.user && token.sub) {
        session.user.userId = token.sub;
        const dbUser = await getUserById(session.user.userId);
        session.user.role = dbUser?.role as UserRole;
        session.user.twoFactorEnabled = dbUser?.twoFactorEnabled as boolean;
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
