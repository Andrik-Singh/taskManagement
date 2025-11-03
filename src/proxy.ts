import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

const authRoutes = ["/sign-in", "/sign-up", "/forgot-password"];

export async function proxy(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(), 
  });

  const url = req.nextUrl;

  if (!session && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (session && authRoutes.includes(url.pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
