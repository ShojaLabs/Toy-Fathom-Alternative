import AppHeader from "@/components/AppHeader";
import AppNavbar from "@/components/AppNavbar";
import AuthProvider from "@/supertokens/authProvider";

export default function ProtectedAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <main className="h-screen p-2 flex flex-col">
        <AppHeader />
        <div className="flex grow pt-2">
          <AppNavbar />
          <div className="grow pl-4 pt-1">{children}</div>
        </div>
      </main>
    </AuthProvider>
  );
}
