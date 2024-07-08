import type { Metadata } from "next";
import { Mukta } from "next/font/google";
import "./globals.css";

import { MantineProvider, createTheme, ColorSchemeScript } from "@mantine/core";
import "@mantine/core/styles.css";
import theme from "@/theme";

const mukta = Mukta({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  style: "normal",
  display: "swap",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Tokyo",
  description: "Work Buddy!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <MantineProvider theme={theme}>
        <body className={mukta.className}>{children}</body>
      </MantineProvider>
    </html>
  );
}
