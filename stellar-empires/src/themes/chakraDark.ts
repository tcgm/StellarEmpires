// src/themes/chakraDark.ts
import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: "#e6ecfa",
      100: "#b7bec7",
      200: "#d0d6df",
      300: "#cde4fd",
      400: "#fde4cd",
      500: "#253a54",
      600: "#4b3721",
      // Add any other custom colors here
    },
    // Override grays for a more harmonious dark/light
    gray: {
      50: "#f7fafc",
      100: "#e6ecfa",
      200: "#b7bec7",
      300: "#a0aec0",
      400: "#718096",
      500: "#4a5568",
      600: "#2d3748",
      700: "#1a202c",
      800: "#171923",
      900: "#0d1117",   // github dark
    },
    blue: {
      100: "#cde4fd",
      200: "#2a3988",
      300: "#2a3988",
      400: "#253a54",
      500: "#122c4b",
      600: "#1d3557",
      700: "#274472",
      800: "#193154",
      900: "#111b2b",
    },
    orange: {
      100: "#fde4cd",
      500: "#ff9800",
      600: "#fb8c00",
    }
  },
  styles: {
    global: (props: { colorMode: string; }) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.900" : "gray.50",
        color: props.colorMode === "dark" ? "gray.100" : "gray.900",
      },
    }),
  },
  components: {
    // Example: Set a default border radius for all boxes
    Box: {
      baseStyle: {
        borderRadius: "2xl",
      },
    },
  },
});

export default theme;
