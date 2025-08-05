"use server";
import { cookies } from "next/headers";
import { jwtDecode, JwtPayload } from "jwt-decode";

export async function createSession(token: string) {
  const decodedJsonToken: JwtPayload = jwtDecode(token);
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(decodedJsonToken.exp! * 1000),
    sameSite: "lax",
    path: "/",
  });
}

export async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return token;
}

export async function deleteSession() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("token");
  return {
    message: "Session deleted successfully",
  };
}
