import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabContent } from "../../components/Tabs/TabContent.tsx";

export function CreateEvaluations() {
  const handleOnClick = (e: React.MouseEvent<SVGElement>) => {
    e.preventDefault();
    console.log(e.currentTarget.dataset.name + " IconArrow clicked");
  };

  return (
    <div className="flex w-full flex-col gap-6 h-full">
      <Tabs
        defaultValue="select"
        className="h-full"
        style={{
          border: "1px solid var(--border)",
          borderRadius: 10,
          paddingBottom: 10,
          marginBottom: 5,
        }}
      >
        <TabsList style={{ translate: "0 -20px" }}>
          <TabsTrigger value="select">Sélectionner une classe</TabsTrigger>
          <TabsTrigger value="present">Elèves présents</TabsTrigger>
          <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
          <TabsTrigger value="archive">Archiver</TabsTrigger>
        </TabsList>
        <TabContent value="select" handleOnClick={handleOnClick} />
        <TabsContent value="present">
          <Card>
            <CardHeader>
              <CardTitle>Elèves présents</CardTitle>
              <CardDescription>
                Change your password here. After saving, you&apos;ll be logged
                out.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-current">
                  Current élèves présents
                </Label>
                <Input id="tabs-demo-current" type="password" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-new">New élèves présents</Label>
                <Input id="tabs-demo-new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save élèves présents</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
