import type { Email, UUID } from "@/api/types/openapi/common.types.ts";
import type { AppRoles } from "@/hooks/store/types/store.types.ts";

/**
 * Student item returned by GET `/students/not-assigned`.
 */
export interface StudentDto {
  id: UUID;
  firstName: string;
  lastName: string;
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
