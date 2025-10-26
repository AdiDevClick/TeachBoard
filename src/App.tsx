import "@css/App.css";
import "@css/index-tailwind.css";
import type { ReactNode } from "react";

/**
 * App component to wrap all pages
 */
export default function App({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
