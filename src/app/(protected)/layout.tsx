import AppHeader from "@/components/AppHeader";

export default function ProtectedAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="p-1">
      <AppHeader />
      {children}
    </main>
  );
}
