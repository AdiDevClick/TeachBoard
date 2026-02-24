import type { COMPLETE_SIDEBAR_DATAS } from "@/configs/main.configs";
import type { EvaluationPageTabsDatas } from "@/data/EvaluationPageDatas";

type NavMenu = (typeof COMPLETE_SIDEBAR_DATAS.navMain.menus)[number];

type Loadertype<LDatas, PDatas> = {
  loaderData?: LDatas;
  pageTitle: string;
  pageDatas?: PDatas;
};

export type CreateEvaluationsLoaderData = Loadertype<
  NavMenu,
  typeof EvaluationPageTabsDatas
>;
