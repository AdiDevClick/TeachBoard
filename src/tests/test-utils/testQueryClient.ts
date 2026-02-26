import { QueryClient } from "@tanstack/react-query";

export const testQueryClient = new QueryClient();

/**
 * Clears the state of the shared query client used during tests.
 */
export function resetTestQueryClient() {
  testQueryClient.clear();
}
