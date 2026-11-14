import { apiRequest } from "./apiClient";

export async function checkSystemApi(
  signal?: AbortSignal,
): Promise<void> {
  await apiRequest<unknown>("/system/status", {
    method: "GET",
    signal,
  });
}