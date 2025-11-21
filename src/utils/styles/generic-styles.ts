/**
 * Styles for the generic page
 *
 * @returns An object containing class names for the generic page elements.
 */
export function genericStyle() {
  const genericPage = "generic-page";

  return {
    containerStyle: { className: `${genericPage}-container` },
    contentStyle: { className: `${genericPage}__content` },
    logoStyle: { className: `${genericPage}__logo` },
    logoBackgroundStyle: { className: `${genericPage}__logo--background` },
    logoIconStyle: { className: `${genericPage}__logo--icon` },
  };
}
