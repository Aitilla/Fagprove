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

  return { success: true };
}

export async function getUser(
  username: string
): Promise<{ success: boolean; lineRef: number; station: string; direction: string }> {
  return { success: true, lineRef: 69, station: "Krokstien", direction: "Tveita T" };
}
