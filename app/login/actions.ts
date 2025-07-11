"use server";

import { cookies } from "next/headers";
import { encrypt, verify } from "../lib/encrypt";
import { createSession } from "../lib/session";
import { supabaseAdmin, supabase } from "../lib/supabase";

export async function auth(
  formData: FormData,
  mode: string
): Promise<{ success: number }> {
  if (mode === "signup") {
    return await signup(formData);
  } else {
    return await login(formData);
  }
}

export async function login(formData: FormData): Promise<{ success: number }> {
  const input = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  };
  const { data: users, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("username", input.username);

  if (error) {
    console.log(error);
    return { success: 3 }; // 3 means unsuccessful
  }

  const user = users?.[0];
  if (!user) return { success: 3 };

  const isValid = await verify(input.password, user.password);
  if (!isValid) return { success: 3 };

  const { sessionID, expiresAt } = await createSession(user.user_id);

  const cookieStore = await cookies();
  cookieStore.set("session", sessionID, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  return { success: 1 }; // 1 means successful login
}

export async function signup(formData: FormData): Promise<{ success: number }> {
  const input = {
    email: formData.get("email") as string,
    username: formData.get("username") as string,
    password: await encrypt(formData.get("password") as string),
  };
  const { error } = await supabase.from("users").insert({
    email: input.email,
    username: input.username,
    password: input.password,
  });
  if (error) {
    console.log(error);
    return { success: 3 };
  }
  return { success: 2 }; // 2 means succesfull singup
}
