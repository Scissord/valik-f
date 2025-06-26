"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IoCartOutline } from "react-icons/io5";

export default function EmptyPage() {
  const {  status } = useSession();
  console.log(status)
  
  if (status === "loading") {
    return <p>Cargando...</p>;
  }
  if (status === "unauthenticated") {
    redirect("/auth/login"); // Redirigir si no tiene sesión
  }

  return (
    <div className="flex justify-center items-center h-[800px]">
      <IoCartOutline size={80} />
      <div className="flex flex-col items-center">
        <h1 className="text-xl font-semibold"> Tu carrito esta vacío</h1>
        <Link href={"/"} className="text-blue-500 mt-2 text-3xl">
          Regresar
        </Link>
      </div>
    </div>
  );
}
