import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { theme } from "@/theme";
import { font } from "@/theme/font";
import { SuperTokensProvider } from "@/supertokens/provider";
import { Notifications } from "@mantine/notifications";
import { cssResolver } from "@/theme/cssResolvers";
import clsx from "clsx";
import { CSPostHogProvider } from "./posthogProvider";
import Analytics from "./analytics";

export const metadata: Metadata = {
  title: "Shoja AI",
  description: "Collaboration Co-pilot for teams!",
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <SuperTokensProvider>
        <CSPostHogProvider>
          <body className={clsx(font.className, "h-screen overflow-hidden")}>
            <MantineProvider
              theme={theme}
              cssVariablesResolver={cssResolver}
              defaultColorScheme="dark"
            >
              <Analytics />
              <Notifications />
              {children}
            </MantineProvider>
          </body>
        </CSPostHogProvider>
      </SuperTokensProvider>
    </html>
  );
}
