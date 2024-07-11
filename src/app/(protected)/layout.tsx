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
      <main className="h-screen relative">
        <div className="fixed z-50 top-0 left-0 p-2 w-full">
          <AppHeader />
        </div>
        <div className="fixed z-40 top-0 left-0 px-2 pt-[74px] pb-2 h-screen">
          <AppNavbar />
        </div>
        <div className="fixed h-screen pt-[74px] pl-64 pb-2 pr-2 w-full">{children}</div>
      </main>
    </AuthProvider>
  );
}
