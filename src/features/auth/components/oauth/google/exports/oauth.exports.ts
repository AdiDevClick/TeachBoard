import { lazyImport } from "@/utils/utils";

/**
 * This file is used to export the lazy loaded GoogleOAuth component. It allows us to load the component only when it is needed, which can improve the performance of our application.
 *
 * The GoogleOAuth component is responsible for handling the OAuth flow with Google. It will be rendered when the user is redirected back to our application after authenticating with Google.
 */

/**
 * Lazy loaded GoogleOAuth component
 *
 * @see src/features/auth/components/oauth/google/GoogleOAuth.tsx for the actual component implementation.
 */
export const LazyGoogleOAuth = lazyImport(
  "@/features/auth/components/oauth/google/GoogleOAuth",
  "GoogleOAuth",
);
