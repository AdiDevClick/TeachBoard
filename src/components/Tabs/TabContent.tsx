import { TabsContent } from "@radix-ui/react-tabs";
import { IconArrowLeft, IconArrowRightDashed } from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card.tsx";
import VerticalFieldSelect from "../ui/select-vertical.tsx";
import { SelectGroup, SelectItem, SelectLabel } from "../ui/select.tsx";
import { Separator } from "../ui/separator.tsx";

export function TabContent({ value, children, handleOnClick }) {
  return (
    <TabsContent
      value={value}
      className="page-content"
      style={{ height: "100%" }}
    >
      <Card
        className="test"
        style={{
          width: "97%",
          height: "100%",
          justifySelf: "center",
          boxShadow: "none",
          border: "none",
          borderLeft: "7px solid",
          display: "flex",
          flexDirection: "row",
          // justifyContent: "space-between",
        }}
      >
        <CardHeader>
          <IconArrowLeft onClick={handleOnClick} data-name="step-previous" />
        </CardHeader>
        {children}
        <CardContent
          className="flex gap-6 tab-card-content"
          style={{
            alignItems: "center",
            placeSelf: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <div style={{ width: "100%" }}>
            <CardTitle>1.</CardTitle>
            <CardTitle>Sélectionner une classe</CardTitle>
            <CardDescription>
              Choisir la classe d’élèves qui participent au TP.
            </CardDescription>
          </div>
          <Separator
            orientation="vertical"
            style={{ height: "50%", width: 1, margin: "auto" }}
          />
          <Card style={{ width: "100%" }}>
            {/* <CardHeader>
                  <CardTitle>Les classes disponibles</CardTitle>
                  <CardDescription>Les classes disponibles</CardDescription>
                </CardHeader> */}
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <VerticalFieldSelect
                  placeholder="Sélectionner une classe"
                  onValueChange={(value) => console.log(value)}
                  label="Les classes disponibles"
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
        </CardContent>
        <CardFooter>
          <IconArrowRightDashed onClick={handleOnClick} data-name="next-step" />
        </CardFooter>
      </Card>
    </TabsContent>
  );
}
