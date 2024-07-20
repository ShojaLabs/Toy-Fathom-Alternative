import AuthProvider from "@/supertokens/authProvider";
import React from "react";
import AppNavbar from "./_components/layout/AppNavbar";
import { AppHeader } from "./_components/layout/appHeader";
import { Paper, ScrollArea } from "@mantine/core";

export default function ProtectedAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <main className="relative h-screen flex p-2">
        <div className="inherit left-0 top-0 z-10 max-w-64 h-full pr-2">
          <AppNavbar />
        </div>
        <div className="relative grow h-full flex flex-col">
          <div className="relative top-0 left-0 w-full z-10 min-h-14">
            <AppHeader />
          </div>
          <Paper bg="dark.6" className="relative grow mt-2">
            <div className="absolute flex flex-col h-full w-full">
              <ScrollArea>
                <div className="p-4 justify-center">{children}</div>
              </ScrollArea>
            </div>
          </Paper>
        </div>
      </main>
    </AuthProvider>
  );
}
