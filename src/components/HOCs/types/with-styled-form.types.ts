/**
 * @fileoverview Type definitions for the withStyledForm HOC.
 */

import type { WithTitledCardProps } from "@/components/HOCs/types/with-titled-card.types";
import type { ForgottenPw } from "@/features/auth/types/auth-types";
import type { AnyObjectProps } from "@/utils/types/types.utils";

/**
 * Type definition for the props accepted by the withStyledForm HOC.
 *
 * @remarks This type extends the props of the wrapped component and adds
 *          specific props for form handling and display.
 */
// export type WithStyledFormProps<C extends object> = Readonly<
export type WithStyledFormProps<C extends AnyObjectProps> = Readonly<
  ForgottenPw & WithTitledCardProps<C>
>;
