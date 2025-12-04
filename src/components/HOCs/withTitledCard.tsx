/**
 * @fileoverview Higher-Order Component (HOC) for wrapping content with a titled card layout.
 *
 * @important LAYOUT ONLY - NO BUSINESS LOGIC
 * This HOC should ONLY be used for presentational layout purposes.
 * - ✅ DO: Use it to wrap content with consistent card styling, headers, and footers
 * - ❌ DON'T: Add any business logic, state management, or data fetching
 * - ❌ DON'T: Handle form submissions, API calls, or complex side effects
 *
 * Business logic should be implemented in the wrapped components or their parent containers.
 *
 * @example
 * // ✅ CORRECT: Business logic in the wrapped component
 * function MyForm({ form, onSubmit }) {
 *   // All business logic here
 *   return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
 * }
 *
 * const MyFormWithCard = withTitledCard(MyForm);
 *
 * // Usage:
 * <MyFormWithCard
 *   form={form}
 *   onSubmit={handleSubmit}
 *   titleProps={{ title: "My Form" }}
 *   modalMode={true}
 * />
 */

import {
  AppCardFooter,
  AppDialFooter,
} from "@/components/Footer/AppFooter.tsx";
import type { AppDialFooterProps } from "@/components/Footer/types/footer.types.ts";
import type { WithTitledCardProps } from "@/components/HOCs/types/withTitledCard.types.ts";
import {
  DialogHeaderTitle,
  HeaderTitle,
} from "@/components/Titles/ModalTitle.tsx";
import type { CardFooter } from "@/components/ui/card.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import type { ComponentProps, ComponentType } from "react";

/**
 * Higher-Order Component that wraps content with a titled card layout.
 *
 * @important This HOC is for LAYOUT purposes only - keep all business logic in wrapped components
 *
 * @template C - Type of props for the wrapped content component
 * @template F - Type of props for the optional footer component
 *
 * @param WrappedContent - The main content component to be wrapped (contains business logic)
 * @param WrappedFooter - Optional footer component
 *
 * @returns A component that renders the wrapped content inside a card with title and optional footer
 *
 * @example
 * // Example 1: Form with footer in modal mode
 * function DegreeForm({ form, onSubmit }) {
 *   // Business logic here
 *   return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
 * }
 *
 * const DegreeFormCard = withTitledCard(DegreeForm);
 *
 * <DegreeFormCard
 *   form={form}
 *   modalMode={true}
 *   footerProps={{ submitText: "Save", formState: form.formState }}
 *   titleProps={{ title: "Create Degree" }}
 * />
 *
 * @example
 * // Example 2: Content without footer
 * function LoginForm({ form }) {
 *   // Business logic here
 *   return <form>...</form>;
 * }
 *
 * const LoginCard = withTitledCard(LoginForm);
 *
 * <LoginCard
 *   form={form}
 *   displayFooter={false}
 *   titleProps={{ title: "Login" }}
 * />
 */
function withTitledCard<C extends object, F extends object = object>(
  WrappedContent: ComponentType<C>,
  WrappedFooter?: ComponentType<F & { modalMode?: boolean }>
) {
  return function Component(props: WithTitledCardProps<C, F>) {
    const {
      footerProps,
      titleProps,
      pageId,
      modalMode = false,
      ref,
      displayFooter = true,
      ...rest
    } = props;

    /**
     * Determine the title or footer component based on modal mode
     * @description Uses DialogHeaderTitle in modal mode, otherwise uses HeaderTitle
     */
    const Title = modalMode ? DialogHeaderTitle : HeaderTitle;
    const FooterContent = modalMode ? AppDialFooter : AppCardFooter;

    return (
      <Card
        ref={ref}
        id={pageId}
        data-dialog={pageId}
        {...rest}
        // style={{ justifySelf: "center" }}
      >
        <Title
          className="text-left"
          style={{
            paddingInline: `calc(var(--spacing) * 6)`,
          }}
          {...titleProps}
        />
        <CardContent>
          <WrappedContent {...(rest as C)} />
        </CardContent>
        {displayFooter && WrappedFooter && footerProps ? (
          <FooterContent
            {...(footerProps as AppDialFooterProps &
              ComponentProps<typeof CardFooter>)}
          >
            <WrappedFooter {...(rest as F)} modalMode={modalMode} />
          </FooterContent>
        ) : null}
      </Card>
    );
  };
}

export default withTitledCard;
