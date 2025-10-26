import { buttonVariants } from "@/components/ui/button.tsx";
import {
  IconCalendarWeekFilled,
  IconCamera,
  IconCirclePlusFilled,
  IconDatabase,
  IconFileAi,
  IconFileCertificate,
  IconFileDescription,
  IconFileWord,
  IconHelp,
  IconInnerShadowTop,
  IconLogout,
  IconMail,
  IconMoon,
  IconNotification,
  IconReport,
  IconSearch,
  IconSettings,
  IconSun,
  IconUserCircle,
} from "@tabler/icons-react";
import { GraduationCap } from "lucide-react";

export const sidebarDatas = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
    settings: [
      {
        title: "Mon Compte",
        url: "#",
        icon: IconUserCircle,
      },
      {
        title: "Notifications",
        url: "#",
        icon: IconNotification,
      },
      { title: "Déconnexion", url: "#", icon: IconLogout, divider: true },
    ],
  },
  sidebarHeader: {
    title: "TeachBoard",
    tooltip: "Outil de gestion pour enseignants",
    url: "#",
    icon: IconInnerShadowTop,
  },
  settings: {
    theme: "light",
    compactMode: false,
    sidebarCollapsed: false,
    language: "fr-FR",
  },
  navMain: {
    groupLabel: "Accès rapide",
    menus: [
      {
        title: "Créer une évaluation",
        tooltip: "Créer rapidement une évaluation",
        url: "#",
        icon: IconCirclePlusFilled,
        // style: {
        //   menuItem: "flex items-center gap-2",
        //   menuButton:
        //     "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear",
        // },
        quickButton: {
          enabled: true,
          icon: IconMail,
        },
      },
      {
        title: "Mon Calendrier",
        tooltip: "Voir mon calendrier",
        url: "#",
        icon: IconCalendarWeekFilled,
        isActive: false,
      },
      {
        title: "Evaluations",
        tooltip: "Gérer mes évaluations",
        url: "#",
        icon: IconFileCertificate,
        isActive: false,
        subMenus: [
          {
            title: "TP",
            url: "#",
            icon: GraduationCap,
          },
          {
            title: "Atelier",
            url: "#",
            icon: GraduationCap,
          },
          {
            title: "Techno",
            url: "#",
            icon: GraduationCap,
          },
        ],
      },
      {
        title: "Cours",
        tooltip: "Accéder à mes différents cours",
        url: "#",
        icon: GraduationCap,
        isActive: false,
        subMenus: [
          {
            title: "TP",
            url: "#",
            icon: GraduationCap,
          },
          {
            title: "Atelier",
            url: "#",
            icon: GraduationCap,
          },
          {
            title: "Techno",
            url: "#",
            icon: GraduationCap,
          },
        ],
        // {
        //   title: "Projects",
        //   url: "#",
        //   icon: IconFolder,
        //   isActive: false,
        // },
        // {
        //   title: "Team",
        //   url: "#",
        //   icon: IconUsers,
        //   isActive: false,
      },
    ],
  },
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Rechercher",
      url: "#",
      icon: IconSearch,
    },
    {
      title: "Paramètres",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Aide",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Dark Mode",
      url: "#",
      icon: buttonVariants({ variant: "ghost" }).includes("dark")
        ? IconMoon
        : IconSun,
      switchIcon: true,
    },
  ],
  documents: {
    label: "Documents",
    items: [
      {
        name: "Data Library",
        url: "#",
        icon: IconDatabase,
      },
      {
        name: "Reports",
        url: "#",
        icon: IconReport,
      },
      {
        name: "Word Assistant",
        url: "#",
        icon: IconFileWord,
      },
    ],
  },
};
