import type { AppRoles } from "@/api/store/types/app-store.types";
import type { Email, UUID } from "@/api/types/openapi/common.types.ts";
import type { ApiError } from "@/types/AppErrorInterface";
import type {
  ApiSuccess,
  AppRouteResponseContract,
} from "@/types/AppResponseInterface";

export type TeachersErrorStatus = 400 | 401 | 500;

/**
 * Teacher item returned by GET `/teachers/`.
 */
export interface TeacherDto {
  id: UUID;
  firstName: string;
  lastName: string;
  email?: Email;
  username?: string;
  role?: Extract<AppRoles, "TEACHER">;
  schoolName?: string;
  profilePictureUrl?: string;

  /** Legacy/FE fields sometimes returned by backend */
  img?: string;
  avatar?: string;
}

/**
 * Data payload returned by the "TEACHERS" fetch.
 */
export type TeachersFetch = TeacherDto[];

export type TeachersSuccess = Extract<
  ApiSuccess<TeachersFetch>,
  { status: 200 }
>;

export type TeachersError = Extract<ApiError, { status: TeachersErrorStatus }>;

export type TeachersRouteResult = AppRouteResponseContract<
  TeachersSuccess,
  TeachersError
>;
