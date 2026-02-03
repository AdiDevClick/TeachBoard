import type { EvaluationPageTabsDatas } from "@/data/EvaluationPageDatas";
import type { completeDatas } from "@/main";

type NavMenu = (typeof completeDatas.navMain.menus)[number];

type Loadertype<LDatas, PDatas> = {
  loaderData?: LDatas;
  pageTitle: string;
  pageDatas?: PDatas;
};

export type CreateEvaluationsLoaderData = Loadertype<
  NavMenu,
  typeof EvaluationPageTabsDatas
>;
