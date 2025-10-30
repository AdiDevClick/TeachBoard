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
import VerticalFieldSelect from "@/components/ui/select-vertical.tsx";
import {
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconArrowLeft } from "@tabler/icons-react";

export function CreateEvaluations() {
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
        <TabsContent value="select">
          <Card
            className="test"
            style={{
              width: "97%",
              height: "100%",
              justifySelf: "center",
              boxShadow: "none",
              border: "none",
              borderLeft: "7px solid",
            }}
          >
            <CardHeader>
              <IconArrowLeft />
            </CardHeader>
            <CardContent className="grid gap-6">
              <div>
                <CardTitle>1.</CardTitle>
                <CardTitle>Sélectionner une classe</CardTitle>
                <CardDescription>
                  Choisir la classe d’élèves qui participent au TP.
                </CardDescription>
              </div>
              <Separator
                orientation="vertical"
                style={{ height: 10, width: 10 }}
              />
              <Card>
                {/* <CardHeader>
                  <CardTitle>Les classes disponibles</CardTitle>
                  <CardDescription>Les classes disponibles</CardDescription>
                </CardHeader> */}
                <CardContent className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="tabs-demo-name">
                      Les classes disponibles
                    </Label>
                    <VerticalFieldSelect
                      placeholder="Sélectionner une classe"
                      onValueChange={(value) => console.log(value)}
                    >
                      <SelectGroup>
                        <SelectLabel>BTS</SelectLabel>
                        <SelectItem value="class-1ereA">
                          1ère A - Sciences de l'Ingénieur
                        </SelectItem>
                      </SelectGroup>
                    </VerticalFieldSelect>
                  </div>
                </CardContent>
              </Card>
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-name">Name</Label>
                <Input id="tabs-demo-name" defaultValue="Pedro Duarte" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-username">Username</Label>
                <Input id="tabs-demo-username" defaultValue="@peduarte" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
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
