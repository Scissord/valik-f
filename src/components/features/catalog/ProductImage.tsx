import React from "react";
import Image from "next/image";

interface Props {
  url?: string;
  title: string;
  className?: React.StyleHTMLAttributes<HTMLImageElement>["className"];
  width: number;
  height: number;
  onMouseEnter?:()=>void;
  onMouseLeave?:()=>void
}
//"rounded w-20 h-20 object-cover"
export const ProductImage = ({
  url,
  title,
  className,
  width,
  height,
  onMouseEnter,
  onMouseLeave
}: Props) => {
  // Определяем источник изображения
  const localSrc = url && url !== "undefined" && url !== "null"
    ? url.startsWith("http") || url.startsWith("/products/")
        ? url
        : `/products/${url}`
    : "/imgs/placeholder.png";

  return (
    <Image
      className={className}
      src={localSrc}
      alt={title}
      width={width}
      height={height}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      unoptimized={true}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null;
        target.src = "/imgs/placeholder.png";
      }}
    />
  );
};
