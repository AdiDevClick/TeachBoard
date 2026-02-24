import type {
  AnyComponentLike,
  ComponentPropsOf,
} from "@/utils/types/types.utils";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  debugLogs,
  withAccordionItemPropsInvalid,
} from "@/configs/app-components.config";
import type { AccordionItemProps } from "@/features/evaluations/create/components/HOCs/types/with-accordion-item.types";

/**
 * Higher-order component that creates an AccordionItem with a given wrapper component.
 *
 * @param value - The value of the accordion item, used for controlling which item is open.
 * @param name - The name displayed on the accordion trigger.
 *
 * @param Wrapper - The component to render inside the accordion content, which will receive the rest of the props.
 */
export function withAccordionItem<C extends AnyComponentLike>(Wrapper: C) {
  return function AccordionItemWithWrapper(
    props: ComponentPropsOf<C> & AccordionItemProps,
  ) {
    if (withAccordionItemPropsInvalid(props)) {
      debugLogs("withAccordionItem HOC", props);
      return null;
    }

    const { value, name, ...rest } = props;

    return (
      <AccordionItem value={value}>
        <AccordionTrigger>{name}</AccordionTrigger>
        <AccordionContent className="border-r-card">
          <Wrapper {...(rest as ComponentPropsOf<C>)} />
        </AccordionContent>
      </AccordionItem>
    );
  };
}
