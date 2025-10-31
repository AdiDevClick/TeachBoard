import "@css/EvaluationPage.scss";
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
import { useSidebar } from "../ui/sidebar.tsx";

export function TabContent({ value, children, handleOnClick }) {
  const { isMobile } = useSidebar();

  return (
    <TabsContent
      value={value}
      className="evaluation-page-container"
      // style={{ height: "100%" }}
    >
      <Card
        className="evaluation-page__cards-container"
        // style={{
        //   width: "97%",
        //   height: "100%",
        //   justifySelf: "center",
        //   boxShadow: "none",
        //   border: "none",
        //   borderLeft: "7px solid",
        //   display: "flex",
        //   flexDirection: "row",
        //   // justifyContent: "space-between",
        // }}
      >
        <CardHeader className="cards-container__header">
          <IconArrowLeft onClick={handleOnClick} data-name="step-previous" />
        </CardHeader>
        {children}
        <CardContent
          className="cards-container__content"
          // className="flex gap-6 tab-card-content"
          // style={{
          //   alignItems: "center",
          //   // placeSelf: "center",
          //   width: "100%",
          //   // height: "100%",
          //   display: "grid",
          //   gridTemplateColumns: "1fr 0fr 3fr",
          // }}
        >
          <div className="content__left">
            <CardTitle>1.</CardTitle>
            <CardTitle>Sélectionner une classe</CardTitle>
            <CardDescription>
              Choisir la classe d’élèves qui participent au TP.
            </CardDescription>
          </div>
          <Separator
            className="content__separator"
            orientation={isMobile ? "vertical" : "horizontal"}
            // style={{ height: "50%", width: 1, margin: "auto" }}
          />
          <Card
            className="content__right"
            // style={{ placeSelf: "center", minWidth: "40%" }}
          >
            {/* <CardHeader>
                  <CardTitle>Les classes disponibles</CardTitle>
                  <CardDescription>Les classes disponibles</CardDescription>
                </CardHeader> */}
            <CardContent className="right__content-container">
              {/* <CardContent className="grid gap-6"> */}
              {/* <div className="grid gap-3"> */}
              <VerticalFieldSelect
                className="right__content"
                // className="grid gap-3"
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
              {/* </div> */}
            </CardContent>
          </Card>
        </CardContent>
        <CardFooter className="cards-container__footer">
          <IconArrowRightDashed onClick={handleOnClick} data-name="next-step" />
        </CardFooter>
      </Card>
    </TabsContent>
  );
}
