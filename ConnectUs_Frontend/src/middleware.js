import { NextResponse } from "next/server";

// const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*" ], 
  // matcher: ["/home/:path*", "/api/:path*"], 
  // matcher: [ "/api/:path*"], // protect any /home page
};
