import AppHeader from "@/components/AppHeader";
import AuthProvider from "@/supertokens/authProvider";

export default function ProtectedAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <main className="p-2">
        <AppHeader />
        {children}
      </main>
    </AuthProvider>
  );
}
