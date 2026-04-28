import { AdminNav } from "./AdminNav";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
      <AdminNav />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
