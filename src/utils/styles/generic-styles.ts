/**
 * Styles for the generic page
 *
 * @returns An object containing class names for the generic page elements.
 */
export function generateStyle(genericName = "generic-page") {
  const container = `${genericName}--container`;
  const header = `${genericName}__header`;
  const content = `${genericName}__content`;
  const logo = `${genericName}__logo`;
  const logoBackground = `${genericName}__logo--background`;
  const logoIcon = `${genericName}__logo--icon`;

  return {
    containerStyle: { className: container },
    contentStyle: { className: content },
    headerStyle: { className: header },
    logoStyle: {
      className: logo,
      iconStyle: { className: logoIcon },
      backGroundStyle: { className: logoBackground },
    },
  };
}

/**
 * Generic styles for the application
 *
 * @description These styles can be imported and used across different components and pages
 * to maintain a consistent look and feel.
 *
 * {@link generateStyle()}
 */
export const {
  containerStyle: GENERIC_CONTAINER_STYLE,
  contentStyle: GENERIC_CONTENT_STYLE,
  logoStyle: GENERIC_LOGO_STYLE,
  headerStyle: GENERIC_HEADER_STYLE,
} = generateStyle();

export const {
  backGroundStyle: GENERIC_LOGO_BACKGROUND_STYLE,
  iconStyle: GENERIC_LOGO_ICON_STYLE,
} = GENERIC_LOGO_STYLE;
