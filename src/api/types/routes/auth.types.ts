import type { User } from "@/api/store/types/app-store.types";
import type { ApiError } from "@/types/AppErrorInterface";
import type {
  ApiSuccess,
  AppRouteResponseContract,
} from "@/types/AppResponseInterface";

/**
 * Request payload accepted by the authentication login endpoint.
 */
export type AuthLoginPayload = {
  identifier: string;
  password: string;
};

export type AuthErrorStatus = 400 | 401 | 403 | 500;

/**
 * Successful response returned by the authentication login endpoint.
 */
export type AuthLoginSuccess = Extract<
  ApiSuccess<{
    // token?: string;
    // refreshToken?: string;
    user: User;
  }>,
  { status: 200 }
>;

/**
 * Known error payloads for the authentication login endpoint.
 */
export type AuthLoginError = Extract<ApiError, { status: AuthErrorStatus }>;

/**
 * Aggregate type simplifying re-use in hooks and components.
 */
export type AuthLoginResult = AppRouteResponseContract<
  AuthLoginSuccess,
  AuthLoginError
>;
