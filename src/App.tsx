// import "@css/App.css";
import { PageTitle } from "@/components/Header/PageTitle.tsx";
import "@css/index-tailwind.css";
import "@css/PageTitle.scss";
import { Activity, type ReactNode } from "react";
import { useLocation, useMatches } from "react-router-dom";

type MatchWithTitle = {
  loaderData?: { pageTitle?: string };
  pathname?: string;
};

/**
 * App component to wrap all pages
 *
 * @description This component serves as the main wrapper for all pages, providing a consistent layout with a page title.
 *
 * @param pageTitle Title of the page
 * @param children Page content
 */
export default function App({ children }: Readonly<{ children: ReactNode }>) {
  const location = decodeURI(useLocation().pathname);
  const matches = useMatches().find(
    (m) => m.loaderData && m.pathname === location
  ) as MatchWithTitle;
  const title = matches?.loaderData?.pageTitle ?? "TeachBoard";

  return (
    <>
      <Activity mode={title === "hidden" ? "hidden" : "visible"}>
        <PageTitle>{title}</PageTitle>
      </Activity>

      {children}
    </>
  );
}
