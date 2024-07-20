"use client";
import { CSSVariablesResolver } from "@mantine/core";

export const cssResolver: CSSVariablesResolver = (theme) => ({
  variables: {
    // '--mantine-hero-height': theme.other.heroHeight,
  },
  light: {
    "--mantine-color-default-border": theme.colors.gray[1],
  },
  dark: {
    "--mantine-color-default-border": theme.colors.dark[5],
  },
});
