import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center">
      <Image 
        src="/logo.svg"
        alt="Valik.kz"
        width={120}
        height={40}
        priority
      />
    </Link>
  )
}

export default Logo;
