import AuthProvider from "@/supertokens/authProvider";
import React from "react";
import AppNavbar from "./_components/AppNavbar";
import { AppHeader } from "./_components/appHeader";

export default function ProtectedAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <main className="relative h-screen flex">
        <div className="inherit left-0 top-0 z-10 max-w-64 h-full p-2">
          <AppNavbar />
        </div>
        <div className="relative grow h-full flex flex-col">
          <div className="relative top-0 left-0 w-full p-2 z-10 min-h-14">
            <AppHeader />
          </div>
          <div className="relative grow px-2">
            {children}
          </div>
        </div>
      </main>
    </AuthProvider>
  );
}
