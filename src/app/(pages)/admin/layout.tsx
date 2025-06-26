import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function layoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user.role !== "admin") {
    redirect("/login");
  }
  return <>{children}</>;
}
