import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import type { Metadata } from "next";
import "./globals.css";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { theme } from "@/theme";
import { font } from "@/theme/font";
import { SuperTokensProvider } from "@/supertokens/provider";
import { Notifications } from "@mantine/notifications";

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
      <SuperTokensProvider>
        <body className={font.className}>
          <MantineProvider theme={theme}>
            <Notifications />
            {children}
          </MantineProvider>
        </body>
      </SuperTokensProvider>
    </html>
  );
}
