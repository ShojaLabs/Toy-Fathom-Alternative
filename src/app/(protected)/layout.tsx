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
      <main className="h-screen p-2 flex flex-col bg-[#FAFAFA]">
        <AppHeader />
        <div className="flex grow mt-2">
          <AppNavbar />
          <div className="grow">{children}</div>
        </div>
      </main>
    </AuthProvider>
  );
}
