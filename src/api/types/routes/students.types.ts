import type { AppRoles } from "@/api/store/types/app-store.types";
import type { Email, UUID } from "@/api/types/openapi/common.types.ts";
import type { ApiError } from "@/types/AppErrorInterface";
import type {
  ApiSuccess,
  AppRouteResponseContract,
} from "@/types/AppResponseInterface";

export type StudentsErrorStatus = 400 | 401 | 500;

/**
 * Student item returned by GET `/students/not-assigned`.
 */
export interface StudentDto {
  id: UUID;
  firstName: string;
  lastName: string;
  fullName?: string;
  email?: Email;
  username?: string;
  role?: Extract<AppRoles, "STUDENT">;
  schoolName?: string;
  profilePictureUrl?: string;

  /** Legacy/FE fields sometimes returned by backend */
  img?: string;
  avatar?: string;
}

/**
 * Data payload returned by the "STUDENTS" fetch.
 */
export type StudentsFetch = StudentDto[];

export type StudentsSuccess =
  | Extract<ApiSuccess<StudentsFetch>, { status: 200 }>
  // no create route in openapi, but keep 201 in case
  | Extract<ApiSuccess<StudentsFetch>, { status: 201 }>;

export type StudentsError = Extract<ApiError, { status: StudentsErrorStatus }>;

export type StudentsRouteResult = AppRouteResponseContract<
  StudentsSuccess,
  StudentsError
>;
