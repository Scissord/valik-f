import { titleFont } from "@/config/fonts";
import Image from "next/image";
import Link from "next/link";

export const PageNotFound404 = () => {
  return (
    <div className="flex flex-col p-4 mt-8  items-center text-center align-middle">
      <div className="mb-4">
        <h1 className={`${titleFont.className} text-4xl mr-4 antialiased`}>
          Pagina no encontrada 404
        </h1>
      </div>

      <Image src="/404.svg" alt={""} width={400} height={200} />
      <Link
        href="/"
        className="text-lg mt-4 hover:underline transition duration-300 hover:text-blue-400"
      >
        Volver al inicio
      </Link>
    </div>
  );
};
