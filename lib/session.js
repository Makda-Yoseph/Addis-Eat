import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretValue = process.env.AUTH_SECRET;

if (!secretValue) {
  throw new Error("AUTH_SECRET is missing from .env.local");
}

const secret = new TextEncoder().encode(secretValue);

const COOKIE_NAME = "session";
const SESSION_DURATION = 60 * 60 * 24 * 7;

export async function createSession(user) {
  const token = await new SignJWT({
    id: String(user.id),
    role: user.role,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.id !== "string" ||
      typeof payload.role !== "string" ||
      typeof payload.name !== "string"
    ) {
      return null;
    }

    return {
      id: payload.id,
      role: payload.role,
      name: payload.name,
    };
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
