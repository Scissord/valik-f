import { getPaginatedUsers } from "@/actions";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import React from "react";
import { UserTable } from "./ui/userTable";

export default async function pageOrder() {
  const { ok, users } = await getPaginatedUsers();

  if (!ok) {
    redirect("/");
  } else if (!users) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <Title title="Administración de usuarios" />
      <div className="mb-10">
        <UserTable users={users} />
      </div>
    </>
  );
}
