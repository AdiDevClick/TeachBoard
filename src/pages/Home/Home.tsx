import { ChartAreaInteractive } from "@/components/chart-area-interactive.tsx";
import { DataTable } from "@/components/data-table.tsx";
import { LoginForm } from "@/components/LoginForms/LoginForm.tsx";
import { SectionCards } from "@/components/section-cards.tsx";
import {
  DialogContent,
  DialogPortal,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { inputControllers } from "@/data/loginInputControllers.ts";
import data from "@data/data.json";

export function Home() {
  return (
    <>
      {/* <SidebarInset> */}
      {/* <SiteHeader /> */}
      <DialogTrigger>test</DialogTrigger>
      <DialogPortal>
        <DialogContent style={{ overflow: "hidden", padding: 0 }}>
          {/* <DialogHeader>
            <DialogTitle>test</DialogTitle>
            <DialogDescription>test</DialogDescription>
          </DialogHeader> */}
          <LoginForm inputControllers={inputControllers} modalMode={true} />
        </DialogContent>
      </DialogPortal>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
          </div>
        </div>
      </div>
      {/* </SidebarInset> */}
    </>
  );
}
