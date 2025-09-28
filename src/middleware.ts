import { NextResponse, NextRequest } from "next/server";
export { default } from "next-auth/jwt";
//helper from NextAuth that extracts the user’s JWT from cookies (if the user is logged in).
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (
    (token && url.pathname.startsWith("/sign-in")) ||
    url.pathname.startsWith("/sign-up") ||
    url.pathname.startsWith("/verify") ||
    url.pathname.startsWith("/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.redirect(new URL("/home", request.url));
}

//in config we tell the places where this middlewares need to run
export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
};
