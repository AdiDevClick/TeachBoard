import { AppBreadCrumb } from "@/components/BreadCrumbs/AppBreadCrumb";
import { AppBreadCrumbList } from "@/components/BreadCrumbs/AppBreadCrumbList.tsx";
import { LoginForm } from "@/components/LoginForms/LoginForm.tsx";
import { Breadcrumb } from "@/components/ui/breadcrumb.tsx";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { inputControllers } from "@/data/loginInputControllers.ts";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import "@css/Dialog.scss";
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
  const { isDialogOpen, openDialog, closeDialog, onOpenChange } = useDialog();
  const ref = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (isDialogOpen("login")) {
      // Define here any actions needed when the dialog opens
      console.log("DialogOpen dans le page header");
    }

    // !! IMPORTANT !! Be aware that if the ref is not set, we should not proceed. As the page triggers this effect before the ref is set.
    if (!ref.current) return;

    if (!isDialogOpen("login") && location.state?.background) {
      navigate(location.state.background, { replace: true, state: {} });
    }
    if (!isDialogOpen("login")) {
      console.log("DialogOpen dans le page header essai de fermer");
    }
  }, [isDialogOpen, location.state]);

  const handleLoginClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    openDialog("login");
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
            <AppBreadCrumb ischild segmentsLength={splitPaths.length} />
          </AppBreadCrumbList>
        </Breadcrumb>
        <Dialog
          open={isDialogOpen("login")}
          onOpenChange={() => onOpenChange("login")}
        >
          <div className="header__actions-container">
            <Button
              variant="ghost"
              asChild
              size="sm"
              className="actions__button"
            >
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

            <DialogContent className="dialog__content--login">
              <LoginForm
                ref={ref}
                inputControllers={inputControllers}
                modalMode={true}
              />
            </DialogContent>
          </div>
        </Dialog>
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
