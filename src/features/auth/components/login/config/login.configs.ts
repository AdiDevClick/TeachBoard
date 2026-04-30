/**
 * @fileoverview Login form configuration
 */

import type { ViewCardContextType } from "@/api/contexts/types/context.types";

export const LOGIN_CARD = {
  card: { className: "grid gap-4" },
  title: {
    title: "Welcome Back !",
    description: "Connectez-vous à votre compte TeachBoard.",
    className: "text-center",
  },
  content: { className: "grid gap-6" },
} satisfies ViewCardContextType;
