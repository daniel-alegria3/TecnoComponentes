// Configuración de pasos, sub-pasos, iconos y descripciones para el flujo de armado de PC

export const STEP_CONFIG = {
  2: {
    name: "CPU & Placa Base",
    subSteps: {
      1: {
        title: "Elige tu Procesador",
        icon: "🖥️",
        description: "El cerebro de tu computadora - Selecciona el procesador que mejor se adapte a tus necesidades",
        gradient: "from-blue-500 to-purple-600"
      },
      2: {
        title: "Elige tu Placa Base",
        icon: "⚡",
        description: "La base de tu sistema - Elige la placa base que conectará todos tus componentes",
        gradient: "from-blue-500 to-purple-600"
      }
    }
  },
  3: {
    name: "RAM & GPU",
    subSteps: {
      1: {
        title: "Elige tu Memoria RAM",
        icon: "💾",
        description: "La memoria de tu sistema - Selecciona la RAM que mantendrá tus aplicaciones funcionando rápidamente",
        gradient: "from-green-500 to-teal-600"
      },
      2: {
        title: "Elige tu Tarjeta Gráfica",
        icon: "🎮",
        description: "El poder gráfico - Elige la tarjeta gráfica que dará vida a tus juegos y aplicaciones",
        gradient: "from-green-500 to-teal-600"
      }
    }
  },
  4: {
    name: "Almacenamiento & PSU",
    subSteps: {
      1: {
        title: "Elige tu Almacenamiento",
        icon: "💿",
        description: "Tu espacio de datos - Selecciona el almacenamiento donde guardarás todos tus archivos y programas",
        gradient: "from-orange-500 to-red-600"
      },
      2: {
        title: "Elige tu Fuente de Alimentación",
        icon: "🔌",
        description: "La energía de tu PC - Elige la fuente de alimentación que dará vida a todo tu sistema",
        gradient: "from-orange-500 to-red-600"
      }
    }
  },
  5: {
    name: "Gabinete & Refrigeración",
    subSteps: {
      1: {
        title: "Elige tu Gabinete",
        icon: "📦",
        description: "El hogar de tu PC - Selecciona el gabinete que protegerá y mostrará todos tus componentes",
        gradient: "from-purple-500 to-pink-600"
      },
      2: {
        title: "Elige tu Sistema de Refrigeración",
        icon: "❄️",
        description: "Mantén todo fresco - Elige el sistema de refrigeración que mantendrá tu PC funcionando óptimamente",
        gradient: "from-purple-500 to-pink-600"
      }
    }
  }
};

export const INITIAL_STEPS = [
  { id: 1, name: "Inicio", href: "#", status: "complete" },
  { id: 2, name: "CPU & Placa Base", href: "#", status: "current" },
  { id: 3, name: "RAM & GPU", href: "#", status: "upcoming" },
  { id: 4, name: "Almacenamiento & PSU", href: "#", status: "upcoming" },
  { id: 5, name: "Gabinete & Refrigeración", href: "#", status: "upcoming" },
  { id: 6, name: "Resumen Final", href: "#", status: "upcoming" },
];

export const INITIAL_SUB_STEPS = {
  2: 1, // Paso 2: 1 = CPU, 2 = Motherboard
  3: 1, // Paso 3: 1 = RAM, 2 = GPU
  4: 1, // Paso 4: 1 = Storage, 2 = PSU
  5: 1, // Paso 5: 1 = Case, 2 = Cooler
};

export const FILTER_OPTIONS = {
  marcas: ["Todas", "Intel", "AMD"],
  sockets: ["Todos", "LGA1700", "AM5", "AM4"],
  nucleosOptions: ["Todos", "4-8", "8-12", "12-16", "16+"],
};

export const PRODUCT_CATEGORIES = {
  cpus: ["procesador"],
  motherboards: ["placa", "mother"],
  ramModules: ["ram"],
  gpus: ["gpu", "tarjeta gráfica", "gráfica"],
  storageDevices: ["ssd", "hdd", "almacenamiento"],
  psus: ["fuente", "psu"],
  cases: ["gabinete", "case"],
  coolers: ["refrigeración", "cooler"],
};
