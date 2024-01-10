import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {
  authRoutes,
  authAPIRoute,
  privateRoutes,
  publicRoutes,
  LOGIN_REDIRECT_URL,
  NOT_LOGIN_REDIRECT_URL,
} from "@/routes";
import { NextResponse } from "next/server";

export const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;

  const isLoggedIn = !!req.auth;

  const isAuthApiRoute = nextUrl.pathname.startsWith(authAPIRoute);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isProtectedRoute = privateRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  if (isAuthApiRoute) return null;

  if (isProtectedRoute && !isLoggedIn) {
    console.log("In here");

    return NextResponse.redirect(new URL(NOT_LOGIN_REDIRECT_URL, nextUrl));
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(LOGIN_REDIRECT_URL, nextUrl));
  }

  if (isPublicRoute) return null;

  return null;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
