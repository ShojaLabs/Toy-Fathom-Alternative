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
  defaultRadius: "sm",
});
