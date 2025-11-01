import { connection } from 'next/server';

export async function register() {
  await connection();
}
