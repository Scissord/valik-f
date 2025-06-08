import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={"/"}>
      <Image
        src={'/logo.svg'}
        className=""
        alt={"logo"}
        width={120}
        height={100}
      />
    </Link>
  )
}

export default Logo;
