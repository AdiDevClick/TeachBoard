import type {
  ApiError,
  ServerErrorDebugs,
  ValidationViolation,
} from "@/types/AppErrorInterface";
import type { ResponseInterface } from "@/types/AppResponseInterface";

/**
 * Request payload accepted by the authentication login endpoint.
 */
export type AuthLoginPayload = {
  identifier: string;
  password: string;
};

/**
 * Successful response returned by the authentication login endpoint.
 */
export type AuthLoginSuccess = ResponseInterface & {
  // token?: string;
  // refreshToken?: string;
  success: string;
  user?: Record<string, unknown>;
};

/**
 * Known error payloads for the authentication login endpoint.
 */
export type AuthLoginError = Extract<
  ApiError,
  { status: 400 | 401 | 404 | 500 }
> & {
  type?: string;
  details?: Record<string, unknown> & ValidationViolation[];
  debugs?: Record<string, unknown> & ServerErrorDebugs;
};

/**
 * Aggregate type simplifying re-use in hooks and components.
 */
export interface AuthLoginResult {
  success: AuthLoginSuccess;
  error: AuthLoginError;
}
