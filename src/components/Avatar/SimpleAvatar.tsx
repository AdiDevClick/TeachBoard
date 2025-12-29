import type {
  SimpleAvatarListProps,
  SimpleAvatarProps,
} from "@/components/Avatar/types/avatar.types.ts";
import withListMapper from "@/components/HOCs/withListMapper.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import {
  debugLogs,
  simpleAvatarPropsInvalid,
} from "@/configs/app-components.config.ts";

/**
 * Simple avatar component with image and fallback
 *
 * @param src - Image source URL
 * @param alt - Alternative text for the image
 * @param fallback - Fallback text when image is not available
 */
export function SimpleAvatar(props: Readonly<SimpleAvatarProps>) {
  if (simpleAvatarPropsInvalid(props)) {
    debugLogs("Rendering SimpleAvatar");
  }

  const { src, alt, fallback } = props;
  return (
    <Avatar>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}

/**
 * SimpleAvatar component wrapped in a list container with ListMapper.
 *
 * @example
 * ```tsx
 * <SimpleAvatarWithList items={[
 *   { id: '1', src: 'url', alt: 'text', fallback: 'AB' },
 *   { id: '2', src: 'url2', alt: 'text2', fallback: 'CD' }
 * ]} />
 * ```
 */
export function SimpleAvatarList({ items }: Readonly<SimpleAvatarListProps>) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
      <SimpleAvatarWithListMapper items={items} />
    </div>
  );
}

const SimpleAvatarWithListMapper = withListMapper(SimpleAvatar);
