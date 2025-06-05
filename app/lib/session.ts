"server-only";

import { supabaseAdmin } from "./supabase";
// import { encrypt } from '@/app/lib/session'

export async function createSession(userID: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // 1. Create a session in the database

  const { data: data, error } = await supabaseAdmin
    .from("sessions")
    .insert({ expiration: expiresAt, user_id: userID })
    .select();

  const sessionID = data?.[0].session_id;
  console.log("sid", sessionID);

  if (error) throw new Error("Could not create session");

  return { sessionID, expiresAt };
}

export async function validateSession(sessionID: string) {
  const { data, error } = await supabaseAdmin
    .from("sessions")
    .select("*")
    .eq("session_id", sessionID);

  if (error) throw new Error("Invalid session");

  const userID = data?.[0].user_id;
  if (!userID) return null;

  return userID;
}
