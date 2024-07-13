import "@/styles/globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import type { Metadata } from "next";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { theme } from "@/theme";
import { font } from "@/theme/font";
import { SuperTokensProvider } from "@/supertokens/provider";
import { Notifications } from "@mantine/notifications";
import { cssResolver } from "@/theme/cssResolvers";
import clsx from "clsx";

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
        <body className={clsx(font.className, "h-screen overflow-hidden")}>
          <MantineProvider
            theme={theme}
            cssVariablesResolver={cssResolver}
            defaultColorScheme="light"
          >
            <Notifications />
            {children}
          </MantineProvider>
        </body>
      </SuperTokensProvider>
    </html>
  );
}
