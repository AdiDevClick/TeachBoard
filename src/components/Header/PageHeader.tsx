import { LoginForm } from "@/components/LoginForms/LoginForm.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
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

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    if (isDialogOpen) {
      console.log("Dialog open state changed:", isDialogOpen);
    } else if (location.state?.background) {
      navigate(location.state.background, { replace: true, state: {} });
    }
  }, [isDialogOpen, location.state]);

  const handleLoginClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    location.state = { background: location.pathname };
    history.pushState(location.state, "", "/login");

    openDialog();
  };

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
          <BreadcrumbList>
            <BreadcrumbItem className="header__breadcrumb-item">
              <BreadcrumbLink href="#">
                Building Your Application
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="header__breadcrumb-separator" />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="header__actions-container">
          <Button variant="ghost" asChild size="sm" className="actions__button">
            <Link
              to="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
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
