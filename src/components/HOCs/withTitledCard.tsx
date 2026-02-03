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
 */

import type {
  FooterProps,
  TitleProps,
} from "@/api/contexts/types/context.types";
import { ViewCardProvider } from "@/api/providers/ViewCardProvider.tsx";
import {
  AppCardFooter,
  AppDialFooter,
} from "@/components/Footer/AppFooter.tsx";
import type { AppDialFooterProps } from "@/components/Footer/types/footer.types";
import type { WithTitledCardProps } from "@/components/HOCs/types/withTitledCard.types.ts";
import {
  DialogHeaderTitle,
  HeaderTitle,
} from "@/components/Titles/ModalTitle.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator";
import { useViewCardContext } from "@/hooks/contexts/useViewCardContext.ts";
import { type ComponentProps, type ComponentType } from "react";

/**
 * Higher-order component that wraps a component in a configurable "titled card" layout.
 *
 * @description Allows a versatile card layout with title, content, and footer sections.
 *
 * @property {Component.Title} - Renders the configured title.
 * In modalMode, it will render DialogHeaderTitle; otherwise, it renders HeaderTitle. Props are shallow-merged with the configured title so you can override or extend them.
 * @property {Component.Footer} - Renders the configured footer.
 *   In modal mode it renders AppDialFooter (expects AppDialFooterProps), otherwise it
 *   renders AppCardFooter (CardFooter-compatible props). Props are shallow-merged so you can override or extend them.
 * @property {Component.Card} - A placeholder typed to match the Card component type (no default UI).
 * @property {Component.Content} - By default, renders CardContent wrapping the WrappedContent component. Props are shallow-merged with the configured content props if you provide any.
 *
 * @remarks The content is a CardContent because it does not matter if it's a modal or not - the content area is always the same and wrapped by a <Card/>.
 *
 * @remarks This HOC is strictly for layout purposes and should not contain any business logic.
 *
 * Notes:
 * - The view-card config may contain `card`, `title`, `content` and `footer` objects.
 *   Each slot shallow-merges its runtime props with the corresponding config object.
 * - When modalMode is true, title and footer rendering switch to dialog-specific components
 *   and expected prop shapes (e.g., AppDialFooterProps).
 *
 * @template C - Props type accepted by the WrappedContent component. Remaining props
 *                 (excluding pageId/modalMode/view-card config) are forwarded to WrappedContent as C.
 * @param WrappedContent - Component to render inside the card's content area.
 */
function withTitledCard<C extends object>(WrappedContent: ComponentType<C>) {
  /**
   * Component that wraps content in a titled card layout.
   *
   * @param pageId - The ID of the page/component using this controller.
   * @param modalMode - Whether the component is used in a modal dialog or not.
   * @param ref - Ref forwarded to the Card component.
   * @param card - Additional props for the Card component and its subcomponents.
   *
   * @returns The main titled card component.
   */
  const Component = (props: WithTitledCardProps<C>) => {
    const {
      pageId,
      modalMode = false,
      ref,
      card: viewCard,
      children,
      ...rest
    } = props;

    const cardId = "card-" + pageId;

    const contextValue = {
      card: viewCard?.card,
      title: viewCard?.title,
      content: viewCard?.content,
      footer: viewCard?.footer,
      modalMode,
      pageId,
      rest,
    };

    return (
      <ViewCardProvider value={contextValue}>
        <Card ref={ref} id={cardId} data-dialog={cardId} {...viewCard?.card}>
          {children}
        </Card>
      </ViewCardProvider>
    );
  };

  /**
   * Title Slot
   *
   * @param props - Props for the title component.
   */
  Component.Title = function Title(props: TitleProps) {
    const { title, modalMode } = useViewCardContext();

    const DynamicTitle = modalMode ? DialogHeaderTitle : HeaderTitle;
    const titleProps = title ? { ...title, ...props } : props;

    return (
      <>
        <DynamicTitle
          className="text-left"
          style={{
            paddingInline: `calc(var(--spacing) * 6)`,
          }}
          {...titleProps}
        >
          {props.children}
        </DynamicTitle>
        <Separator
          className="mx-auto my-2 max-w-1/3"
          orientation="horizontal"
          {...titleProps.separator}
        />
      </>
    );
  };

  /**
   * Footer Slot
   *
   * @param props - Props for the footer component, either AppDialFooterProps or CardFooter props.
   */
  Component.Footer = function Footer(props: FooterProps) {
    const { footer = {}, modalMode } = useViewCardContext();
    const footerProps = { ...footer, ...props };

    return (
      <>
        <Separator
          className="mx-auto my-2 max-w-1/3"
          orientation="horizontal"
          {...footerProps.separator}
        />
        {modalMode && (
          <AppDialFooter {...(footerProps as AppDialFooterProps)}>
            {props.children}
          </AppDialFooter>
        )}
        {!modalMode && (
          <AppCardFooter {...footerProps}>{props.children}</AppCardFooter>
        )}
      </>
    );
  };

  const CardSlot = (() => null) as ComponentType<ComponentProps<typeof Card>>;

  /**
   * Content Slot
   *
   * @param props - Props for the CardContent component.
   */
  Component.Content = function Content(
    props: ComponentProps<typeof CardContent>,
  ) {
    const { content = {}, pageId, rest } = useViewCardContext();
    const contentProps = { ...content, ...props };

    return (
      <CardContent {...contentProps}>
        <WrappedContent pageId={pageId} {...(rest as C)} />
        {props.children}
      </CardContent>
    );
  };

  Component.Card = CardSlot;

  return Component;
}

export default withTitledCard;
