import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "ADMIN";
    const isModerator = token?.role === "MODERATOR";
    const isUser = token?.role === "USER";

    // Admin/Moderator dashboard protection
    if (req.nextUrl.pathname.startsWith("/dashboard") && !isAdmin && !isModerator) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // User dashboard protection
    if (req.nextUrl.pathname.startsWith("/user-dashboard") && !isUser && !isAdmin && !isModerator) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // Redirect admin/moderator from user dashboard to admin dashboard
    if (req.nextUrl.pathname.startsWith("/user-dashboard") && (isAdmin || isModerator)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Redirect regular users from admin dashboard to user dashboard
    if (req.nextUrl.pathname.startsWith("/dashboard") && isUser) {
      return NextResponse.redirect(new URL("/user-dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/user-dashboard/:path*"],
};