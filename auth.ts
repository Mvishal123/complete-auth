import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config";
import { db } from "@/lib/db";
import { getUserById } from "./utils/data";
import { getTwoFactorConfirmationByUserId } from "./utils/two-factor-auth-confiramtion";
import { UserRole } from "@prisma/client";
import { getAccountById } from "./utils/account-details";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update
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
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (token.twoFactorEnabled && session.user) {
        session.user.twoFactorEnabled = token.twoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.isOauth = token.isOauth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }

      const existingUser = await getUserById(token.sub);
      if (!existingUser) {
        return token;
      }

      const isOauth = await getAccountById(existingUser.id);

      token.isOauth = !!isOauth;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.twoFactorEnabled = existingUser.twoFactorEnabled as boolean;

      return token;
    },
  },

  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
