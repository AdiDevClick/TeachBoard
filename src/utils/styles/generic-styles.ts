/**
 * Styles for the generic page
 *
 * @returns An object containing class names for the generic page elements.
 */
function genericStyle() {
  const genericPage = "generic-page";

  return {
    containerStyle: { className: `${genericPage}-container` },
    contentStyle: { className: `${genericPage}__content` },
    logoStyle: { className: `${genericPage}__logo` },
    logoBackgroundStyle: { className: `${genericPage}__logo--background` },
    logoIconStyle: { className: `${genericPage}__logo--icon` },
  };
}

/**
 * Generic styles for the application
 *
 * @description These styles can be imported and used across different components and pages
 * to maintain a consistent look and feel.
 *
 * {@link genericStyle()}
 */
export const {
  containerStyle: GENERIC_CONTAINER_STYLE,
  contentStyle: GENERIC_CONTENT_STYLE,
  logoStyle: GENERIC_LOGO_STYLE,
  logoBackgroundStyle: GENERIC_LOGO_BACKGROUND_STYLE,
  logoIconStyle: GENERIC_LOGO_ICON_STYLE,
} = genericStyle();
