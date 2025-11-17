import { AppBreadCrumb } from "@/components/BreadCrumbs/AppBreadCrumb";
import { AppBreadCrumbList } from "@/components/BreadCrumbs/AppBreadCrumbList.tsx";
import { Breadcrumb } from "@/components/ui/breadcrumb.tsx";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useAppStore } from "@/hooks/store/AppStore.ts";
import "@css/Dialog.scss";
import "@css/PageHeader.scss";
import { Activity, useEffect, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

/** Page header component
 *
 * @description This component renders the page header including breadcrumb navigation and action buttons.
 */
export function PageHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openedDialogs, isDialogOpen, openDialog, closeDialog } = useDialog();
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      closeDialog("login");
    };

    globalThis.addEventListener("popstate", handlePopState);

    return () => {
      globalThis.removeEventListener("popstate", handlePopState);
    };
  }, [closeDialog]);

  const handleLoginClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    openDialog("login");
  };
  // Generate breadcrumb segments from the current URL path
  const splitPaths = buildBreadcrumbsFromPath(decodeURI(location.pathname));

  return (
    <header className="page__header-container">
      <div className="header__breadcrumb-container">
        <SidebarTrigger className="page__sidebar-trigger" />
        <Separator
          orientation="vertical"
          className="page__sidebar-trigger--separator"
        />
        {/* <h1 className="text-base font-medium">Documents</h1> */}
        <Breadcrumb>
          <AppBreadCrumbList items={splitPaths}>
            <AppBreadCrumb ischild segmentsLength={splitPaths.length} />
          </AppBreadCrumbList>
        </Breadcrumb>
        <div className="header__actions-container">
          <Button variant="ghost" asChild size="sm" className="actions__button">
            <Link
              to="https://github.com/adidevclick"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </Link>
          </Button>
          <Activity mode={isLoggedIn ? "hidden" : "visible"}>
            <Button
              variant="ghost"
              size="sm"
              className="actions__button dark:text-foreground"
              onClick={handleLoginClick}
            >
              Se connecter
            </Button>
          </Activity>
        </div>
      </div>
    </header>
  );
}

/**
 * Builds breadcrumb segments from the given URL path.
 *
 * @param pathname - Current URL path
 * @returns Array of breadcrumb segments with name and URL
 */
function buildBreadcrumbsFromPath(
  pathname: string
): { url: string; name: string }[] {
  return pathname
    .split("/")
    .filter(Boolean)
    .reduce<{ url: string; name: string }[]>((acc, segment) => {
      const trimmedSegment = segment.trim();
      // Construct url based on the url positionned at index - 1 if a route is nested (easier to produce correct urls)
      const baseUrl = acc.at(-1)?.url ?? "";
      const url = `${baseUrl}/${trimmedSegment}`;

      acc.push({
        url,
        name: trimmedSegment.charAt(0).toUpperCase() + trimmedSegment.slice(1),
      });

      return acc;
    }, []);
}
