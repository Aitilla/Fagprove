"use server";

import { cookies } from "next/headers";

export async function logout(): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  cookieStore.delete("session");

  if (!cookieStore) return { success: false };

  return { success: true };
}