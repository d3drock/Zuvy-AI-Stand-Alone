"use client";

import { usePathname } from "next/navigation";
import { getUser } from "@/store/store";
import MainLayout from "@/components/layout/MainLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = getUser();

  const roleFromPath = pathname.split("/")[1]?.toLowerCase() || "";
  const userRole = user?.rolesList?.[0]?.toLowerCase() || "";

  return (
    <div className="font-body">
      <MainLayout>{children}</MainLayout>
    </div>
  );
}
