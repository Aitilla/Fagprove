import { supabaseAdmin } from "../lib/supabase";

export async function setOption(
  formData: FormData,
  username: string
): Promise<{ success: boolean;}> {
  const input = {
    lineNumber: formData.get("lineNumber") as string,
    stationName: formData.get("stationName") as string,
  };

  if (!input.lineNumber || !input.stationName) {
    return { success: false};
  }

  const { data: routes, error } = await supabaseAdmin
    .from("enturRoutes")
    .insert({
      user: username,
      lineRef: input.lineNumber,
      stationName: input.stationName,
    });

  if (error) {
    console.log(error);
    return { success: false};
  }

  return {success: true,}
}

export async function getUserRoutes(username: string): Promise<{
  response: boolean;
  lineRef: number;
  stationName: string;
}> {
  const { data: userRoutes, error } = await supabaseAdmin
    .from("enturRoutes")
    .select("*")
    .eq("user", username);

  if (error) {
    console.log(error);
    return { response: false, lineRef: NaN, stationName: "" };
  }

  const userRoute = userRoutes?.[0];
  if (!userRoute) {
    console.log("feil userROute");
    return { response: false, lineRef: NaN, stationName: "" };
  }

  console.log(userRoute);

  return {
    response: true,
    lineRef: 69,
    stationName: "Krokstien",
  };
}
