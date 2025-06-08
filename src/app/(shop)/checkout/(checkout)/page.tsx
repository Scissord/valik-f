"use client";
import { Title } from "@/components";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductsConfirm } from "./ui/ProductsConfirm";
import { PlaceOrden } from "./ui/PlaceOrden";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  if (!isAuthenticated) redirect("/");

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={"Verificar orden"} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="flex flex-col mt-5">
            <span className="text-xl">Ajustar elementos</span>
            <Link href={"/cart"} className="underline mb-5">
              Editar carrito
            </Link>
            {/* items */}
            <ProductsConfirm />
          </div>
          <PlaceOrden />
        </div>
      </div>
    </div>
  );
}
