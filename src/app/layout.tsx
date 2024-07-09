import "@mantine/core/styles.css";
import type { Metadata } from "next";
import "./globals.css";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { theme } from "@/theme";
import { font } from "@/theme/font";

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
      <body className={font.className}>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
