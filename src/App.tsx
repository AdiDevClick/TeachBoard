import "@css/App.scss";
import "@css/index-tailwind.css";
import "@css/PageTitle.scss";
import { type PropsWithChildren } from "react";

/**
 * App component to wrap all pages
 *
 * @description This component serves as the main wrapper for all pages, providing a consistent layout with a page title.
 *
 * @param pageTitle Title of the page
 * @param children Page content
 */
export default function App({ children }: Readonly<PropsWithChildren>) {
  return <>{children}</>;
}
