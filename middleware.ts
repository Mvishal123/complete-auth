import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {
  authRoute,
  privateRoutes,
  publicRoutes,
  LOGIN_REDIRECT_URL,
} from "@/routes";

export const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  console.log("NEXTURL:", nextUrl);

  const isLoggedIn = !!req.auth;

  const isAuthRoute = nextUrl.pathname.startsWith(authRoute);
  const isProtectedRoute = privateRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  if (isAuthRoute) return null;

  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL(LOGIN_REDIRECT_URL, nextUrl));
  }

  if (isPublicRoute) return null;

  return null
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
