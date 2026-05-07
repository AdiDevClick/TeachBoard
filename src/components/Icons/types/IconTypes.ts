import type { HTMLAttributes } from "react";

/**
 * Props for the Icon component, which renders an SVG icon based on the provided iconPath.
 */
export type IconPropsTypes = {
  /** A string representing the name of the icon to display */
  iconPath: string;
} & HTMLAttributes<SVGElement>;
