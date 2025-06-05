"use server"

import { cookies } from "next/headers";
import { validateSession } from "../lib/session";
import { supabaseAdmin } from "../lib/supabase";

export async function setOption(
  formData: FormData
): Promise<{ success: boolean }> {
  const input = {
    lineNumber: formData.get("lineNumber") as string,
    stationName: formData.get("stationName") as string,
  };

  if (!input.lineNumber || !input.stationName) {
    return { success: false };
  }

  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (!session) return { success: false };
  const userID = await validateSession(session.value);
  if (!userID) return { success: false };

  const { data: routes, error } = await supabaseAdmin
    .from("entur_routes")
    .insert({
      user_id: userID,
      line_ref: input.lineNumber,
      monitored_station: input.stationName,
    });

  if (error) {
    console.log(error);
    return { success: false };
  }

  return { success: true };
}

export async function getUserRoutes(userId: string): Promise<{
  success: boolean;
  lineRef: number;
  stationName: string;
}> {
  const { data: userRoutes, error } = await supabaseAdmin
    .from("entur_routes")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.log(error);
    return { success: false, lineRef: NaN, stationName: "" };
  }

  const userRoute = userRoutes?.[0];
  if (!userRoute) {
    console.log("feil userROute");
    return { success: false, lineRef: NaN, stationName: "" };
  }

  console.log(userRoute);

  return {
    success: true,
    lineRef: 69,
    stationName: "Krokstien",
  };
}
