import "server-only";
import bcrypt from "bcryptjs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const usersFile = path.join(process.cwd(), "data", "users.json");

async function readUsers() {
  const file = await readFile(usersFile, "utf8");
  const data = JSON.parse(file);
  return data.users;
}

export async function findUserByEmail(email) {
  const users = await readUsers();
  const normalizedEmail = email.trim().toLowerCase();

  return (
    users.find((user) => user.email.toLowerCase() === normalizedEmail) ?? null
  );
}

export async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

export async function createUser({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  const users = await readUsers();
  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = {
    id: randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: "customer",
  };

  users.push(newUser);

  await writeFile(usersFile, JSON.stringify({ users }, null, 2), "utf8");

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  };
}
