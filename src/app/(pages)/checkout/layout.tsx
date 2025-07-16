"use client";

// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface ProtectedLayoutProps {
  children: ReactNode;
}
//TODO problema en checkout
export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  // const { data: session, status } = useSession();
  // const router = useRouter();

  // useEffect(() => {
  //   if (status === "unauthenticated") {
  //     router.push("/auth/login"); // Redirigir si no tiene sesión
  //   }
  // }, [status, router]);

  // if (status === "loading") {
  //   return <p>Cargando...</p>;
  // }

  // return session ? <>{children}</> : null;
  return <>{children}</>
}