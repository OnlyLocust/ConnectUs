import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // if (pathname.startsWith("/home")) {
  //   const token = req.cookies.get("token")?.value;
  //   if (!token) return NextResponse.redirect(new URL("/", req.url));    
  // }


  try {
    const token = req.cookies.get("token")?.value;
    if (!token) throw new Error("No token here, Unauthorized");

    const { payload } = await jwtVerify(token, secret);

    const id = payload.id;
    if (!id) throw new Error("Unauthorized, No ID found in token");

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("userId", id);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/home/create/:path*" , "/home/edit/:path*", "/home/explore/:path*" , "/api/:path*"], 
  // matcher: ["/home/:path*", "/api/:path*"], 
  // matcher: [ "/api/:path*"], // protect any /home page
};
