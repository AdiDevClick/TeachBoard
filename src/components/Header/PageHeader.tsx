import { AppBreadCrumb } from "@/components/BreadCrumbs/AppBreadCrumb";
import { AppBreadCrumbList } from "@/components/BreadCrumbs/AppBreadCrumbList.tsx";
import { LoginForm } from "@/components/LoginForms/LoginForm.tsx";
import { Breadcrumb } from "@/components/ui/breadcrumb.tsx";
import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog.tsx";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { inputControllers } from "@/data/loginInputControllers.ts";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import "@css/PageHeader.scss";
import { useEffect, useRef, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

/** Page header component
 *
 * @description This component renders the page header including breadcrumb navigation and action buttons.
 */
export function PageHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDialogOpen, openDialog, closeDialog } = useDialog();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      closeDialog();
    };

    globalThis.addEventListener("popstate", handlePopState);

    return () => {
      globalThis.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (isDialogOpen) {
      // Define here any actions needed when the dialog opens
    }

    // !! IMPORTANT !! Be aware that if the ref is not set, we should not proceed. As the page triggers this effect before the ref is set.
    if (!ref.current) return;

    if (!isDialogOpen && location.state?.background) {
      navigate(location.state.background, { replace: true, state: {} });
    }
  }, [isDialogOpen, location.state]);

  const handleLoginClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    openDialog();
    location.state = { background: location.pathname };
    history.pushState(location.state, "", "/login");
  };

  // Generate breadcrumb segments from the current URL path
  const splitPaths = buildBreadcrumbsFromPath(location.pathname);

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
            <AppBreadCrumb segmentsLength={splitPaths.length} />
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
          <Button
            variant="ghost"
            size="sm"
            className="actions__button dark:text-foreground"
            onClick={handleLoginClick}
          >
            Se connecter
          </Button>
          <DialogContent style={{ overflow: "hidden", padding: 0 }}>
            <LoginForm
              ref={ref}
              inputControllers={inputControllers}
              modalMode={true}
            />
          </DialogContent>
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
      acc.push({
        url: acc.map((item) => item.url).join("") + "/" + trimmedSegment,
        name: trimmedSegment.charAt(0).toUpperCase() + trimmedSegment.slice(1),
      });
      return acc;
    }, []);
}
