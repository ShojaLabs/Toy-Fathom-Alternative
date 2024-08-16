import AuthProvider from "@/supertokens/authProvider";
import React from "react";
import AppHeader from "./_components/layout/AppHeader";
import { Paper, ScrollArea } from "@mantine/core";

export default function ProtectedAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <main className="relative h-screen flex p-4">
        <div className="relative grow h-full flex flex-col">
          <div className="relative top-0 left-0 w-full z-10">
            <AppHeader />
          </div>
          <div className="relative grow mt-4">
            <Paper bg="dark.6" className="absolute flex flex-col h-full w-full">
              <ScrollArea className="grow">
                <div className="grow p-4 justify-center h-max">{children}</div>
              </ScrollArea>
            </Paper>
          </div>
        </div>
      </main>
    </AuthProvider>
  );
}
