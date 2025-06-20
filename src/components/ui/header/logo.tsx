import { titleFont } from "@/config/fonts";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center">
      <span className={`${titleFont.className} text-xl font-bold text-orange-500`}>
        Valik.kz
      </span>
    </Link>
  )
}

export default Logo;
