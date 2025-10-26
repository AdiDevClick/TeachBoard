import type { RouteError } from "@/pages/Error/types/PageErrorTypes";
import { useRouteError } from "react-router-dom";

/**
 * Display a generic error page
 */
export function PageError() {
  const error = useRouteError() as RouteError;
  // if (error.status === 404) return <Error404 />;

  return (
    <>
      <div className="error-page" id="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </>
  );
}
