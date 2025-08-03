import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
export async function middleware(request: NextRequest) {
  // Check if user is authenticated
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  // Redirect authenticated users away from login page
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cars", "/dashboard", "/employees", "/travel-packages"],
};
