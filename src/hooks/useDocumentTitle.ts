import { CompleteDatas } from "@/main.tsx";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Hook to set the document title based on navigation data
 *
 * @param data Sidebar navigation data
 * @description This hook updates the document title according to the current active menu item in the sidebar navigation.
 */
export function useDocumentTitle(data) {
  const [done, setDone] = useState(false);
  const location = useLocation().pathname;

  useEffect(() => {
    if (done) return;

    const oldTitle = document.title;

    CompleteDatas.navMain.menus.map((element) => {
      if (done) return;

      element.isActive = "/" + element.url === location;

      if (element.isActive) {
        document.title = "TeachBoard - " + element.title;
        setDone(true);
      }

      return () => {
        document.title = oldTitle;
        setDone(false);
      };
    });
  }, [done, location]);
}
