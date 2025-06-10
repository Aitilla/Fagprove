"use server";

import { cookies } from "next/headers";
import { validateSession } from "../lib/session";
import { supabaseAdmin } from "../lib/supabase";

export async function setRoute(
  formData: FormData
): Promise<{ success: boolean }> {
  const input = {
    lineNumber: formData.get("lineNumber") as string,
    stationName: formData.get("stationName") as string,
  };

  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (!session) return { success: false };
  const userID = await validateSession(session.value);
  if (!userID) return { success: false };

  const { error } = await supabaseAdmin.from("entur_routes").insert({
    user_id: userID,
    line_ref: input.lineNumber,
    monitored_station: input.stationName,
    favorite: false,
  });

  if (error) {
    console.log(error);
    return { success: false };
  }

  return { success: true };
}
export async function getUserRoutes(): Promise<{
  success: boolean;
  userRoutes: {
    route_id: string;
    line_ref: number;
    monitored_station: string;
    favorite: boolean;
  }[];
}> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (!session)
    return {
      success: false,
      userRoutes: [],
    };

  const userID = await validateSession(session.value);
  if (!userID)
    return {
      success: false,
      userRoutes: [],
    };

  const { data: userRoutes, error } = await supabaseAdmin
    .from("entur_routes")
    .select("*")
    .eq("user_id", userID);

  if (error) {
    console.log(error);
    return {
      success: false,
      userRoutes: [],
    };
  }

  return {
    success: true,
    userRoutes: userRoutes,
  };
}

export async function toggleFavorite(
  routeID: string,
  favorite: boolean
): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (!session) return { success: false };
  const userID = await validateSession(session.value);
  if (!userID) return { success: false };

  const { error } = await supabaseAdmin
    .from("entur_routes")
    .update({ favorite: favorite })
    .eq("route_id", routeID)
    .select();

  if (error) return { success: false };

  return { success: true };
}
