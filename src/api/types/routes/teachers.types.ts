import type { UUID } from "@/api/types/openapi/common.types.ts";

/**
 * Teacher item returned by GET `/teachers/`.
 */
export interface TeacherDto {
  id: UUID;
  firstName: string;
  lastName: string;
  email?: string;
  username?: string;
  role?: "ADMIN" | "TEACHER" | "STUDENT" | "STAFF";
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
