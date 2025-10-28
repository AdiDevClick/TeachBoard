// import "@css/App.css";
import { PageTitle } from "@/components/Header/PageTitle.tsx";
import "@css/index-tailwind.css";
import "@css/PageTitle.scss";
import type { ReactNode } from "react";

/**
 * App component to wrap all pages
 */
export default function App({ children }: { children: ReactNode }) {
  return (
    <>
      <PageTitle>My App</PageTitle>
      {children}
    </>
  );
}
