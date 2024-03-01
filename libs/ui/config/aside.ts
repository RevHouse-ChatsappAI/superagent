import { RxClock, RxColorWheel, RxCountdownTimer, RxFileText, RxGear, RxHome, RxPaperPlane, RxReader, RxRocket, RxShare2, RxStack } from "react-icons/rx";
import { FiSend } from "react-icons/fi";
import { IoCodeSlashOutline } from "react-icons/io5";
import { CiCloudOn } from "react-icons/ci";
import { CiHeadphones } from "react-icons/ci";

export const workspaceNav = {
  title: "Espacio de trabajo",
  description: "Espacio de trabajo",
  items: [
    {
      title: "Inicio",
      href: "/home",
      icon: RxHome,
    },
    {
      title: "Agentes de IA",
      href: "/agents",
      icon: RxColorWheel,
    },
    {
      title: "CRM",
      href: "https://app.chatsappai.com/",
      icon: FiSend,
    }
  ],
};

export const knowledgeBaseNav = {
  title: "Base del conocimiento",
  description: "Base del conocimiento",
  items: [
    {
      title: "Fuentes de datos",
      href: "/datasources",
      icon: RxReader,
    },
    {
      title: "FAQs",
      href: "/faqs",
      icon: RxStack,
    },
  ],
};


export const apiBaseNav = {
  title: "Conexiones",
  description: "Conexiones",
  items: [
    {
      title: "APIs",
      href: "/apis",
      icon: CiCloudOn,
    },
    {
      title: "Plataformas",
      href: "/integration",
      icon: IoCodeSlashOutline,
    },
  ],
};

export const helpBaseNav = {
  title: "Obtener Ayuda",
  description: "Obtener Ayuda",
  items: [
    {
      title: "Soporte",
      href: "/faqs",
      icon: CiHeadphones,
    },
    {
      title: "Configuración",
      href: "/settings",
      icon: RxGear,
    },
  ],
};

