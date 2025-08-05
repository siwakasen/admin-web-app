import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { useGetEmployee } from "./hooks/employees.hook";

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const { employee } = await useGetEmployee();  
  // Redirect authenticated users away from login page
  if (
    token &&
    (request.nextUrl.pathname === "/" ||
      request.nextUrl.pathname.startsWith("/forget-password"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users away from /dashboard
  if (
    !token &&
    (request.nextUrl.pathname === "/dashboard" ||
      request.nextUrl.pathname.startsWith("/cars") ||
      request.nextUrl.pathname.startsWith("/employees") ||
      request.nextUrl.pathname.startsWith("/travel"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if(employee?.role.id === 1 && (
    request.nextUrl.pathname.startsWith("/travel-packages") 
    || request.nextUrl.pathname.startsWith("/cars") 
  )) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if(employee?.role.id === 2 && (
    request.nextUrl.pathname.startsWith("/employees") 
  )) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/forget-password",
    "/forget-password/:path*",
    "/dashboard",
    "/cars/:path*",
    "/employees/:path*",
    "/travel-packages/:path*",
  ],
};
