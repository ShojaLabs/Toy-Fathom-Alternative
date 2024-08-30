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
import AnalyticsInitWebWrapper from "./AnalyticsInitWebWrapper";
import AnalyticsInitServer from "./AnalyticsInitServer";

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
        <AnalyticsInitWebWrapper>
          <AnalyticsInitServer />
          <body className={clsx(font.className, "h-screen overflow-hidden")}>
            <MantineProvider
              theme={theme}
              cssVariablesResolver={cssResolver}
              defaultColorScheme="dark"
            >
              <Notifications />
              {children}
            </MantineProvider>
          </body>
        </AnalyticsInitWebWrapper>
      </SuperTokensProvider>
    </html>
  );
}
