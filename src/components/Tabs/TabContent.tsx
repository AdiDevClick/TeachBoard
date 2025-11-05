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
import { Separator } from "../ui/separator.tsx";
import { useSidebar } from "../ui/sidebar.tsx";

export function TabContent({ item, index, children, ...props }) {
  const { isMobile } = useSidebar();
  const { leftSide } = item;
  const clickProps = {
    index,
    arrayLength: props.arrayLength,
    setTabValue: props.setTabValue,
    tabValues: props.tabValues,
  } as const;

  return (
    <TabsContent value={item.tabTitle} className="evaluation-page-container">
      <Card className="evaluation-page__cards-container">
        <CardHeader className="cards-container__header">
          <IconArrowLeft
            onClick={(e) => props.handleOnClick({ e, clickProps })}
            data-name="step-previous"
          />
        </CardHeader>
        <CardContent className="cards-container__content">
          <div className="content__left">
            <CardTitle>{leftSide.number}.</CardTitle>
            <CardTitle>{leftSide.title}</CardTitle>
            <CardDescription>{leftSide.description}</CardDescription>
          </div>
          <Separator
            className="content__separator"
            orientation={isMobile ? "vertical" : "horizontal"}
          />
          {children}
          {/* <Card className="content__right"> */}
          {/* <CardHeader>
              <CardTitle>Les classes disponibles</CardTitle>
              <CardDescription>Les classes disponibles</CardDescription>
            </CardHeader> */}

          {/* <CardContent className="right__content-container">
              <VerticalFieldSelect
                className="right__content"
                placeholder="Sélectionner une classe"
                onValueChange={(value) => console.log(value)}
                label={rightSide.title}
              >
                <SelectGroup>
                  <SelectLabel>BTS</SelectLabel>
                  <SelectItem value="class-1ereA">
                    1ère A - Sciences de l'Ingénieur
                  </SelectItem>
                </SelectGroup>
              </VerticalFieldSelect>
            </CardContent>
          </Card> */}
        </CardContent>
        <CardFooter className="cards-container__footer">
          <IconArrowRightDashed
            onClick={(e) => props.handleOnClick({ e, clickProps })}
            data-name="next-step"
          />
        </CardFooter>
      </Card>
    </TabsContent>
  );
}
