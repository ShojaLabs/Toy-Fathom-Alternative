"use client";

import { createTheme } from "@mantine/core";

export const theme = createTheme({
  colors: {
    brand: [
      "#e9ebff",
      "#cfd2ff",
      "#9ba0ff",
      "#636cff",
      "#363fff",
      "#1823ff",
      "#0314ff",
      "#0009e5",
      "#0006cd",
      "#0002b5",
    ],
    gray: [
      "#FAFAFA",
      "#EBEBEB",
      "#d6d6d6",
      "#C2C2C2",
      "#ADADAD",
      "#999999",
      "#858585",
      "#707070",
      "#5C5C5C",
      "#474747",
    ],
  },
  black: "#070814",
  white: "#fffffe",
  primaryColor: "brand",
  primaryShade: 5,

  radius: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    full: "9999px",
  },
  // defaultRadius: "sm",

  components: {
    Paper: {
      styles: {
        root: {
          borderColor: "var(--mantine-color-default-border)",
        }
      }
    },
    Input: {
      styles: {
        input: {
          borderColor: "var(--mantine-color-default-border)",
        }
      }
    }
  }
});
