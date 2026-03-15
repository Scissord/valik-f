import React from "react";
import Image from "next/image";

interface Props {
  url?: string;
  name: string;
  className?: React.StyleHTMLAttributes<HTMLImageElement>["className"];
  width: number;
  height: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  priority?: boolean;
}
//"rounded w-20 h-20 object-cover"
export const ProductImage = ({
  url,
  name,
  className,
  width,
  height,
  onMouseEnter,
  onMouseLeave,
  priority = false
}: Props) => {
  // Определяем источник изображения
  const localSrc = url && url !== "undefined" && url !== "null"
    ? url.startsWith("http") || url.startsWith("/")
      ? url
      : `/products/${url}`
    : "/imgs/placeholder.png";

  return (
    <Image
      className={className}
      src={localSrc}
      alt={name}
      width={width}
      height={height}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      unoptimized={true} // ⚠️ ВРЕМЕННО: отключено из-за ошибки "private ip" в Next.js
      priority={priority}
      quality={75} // ✅ ДОБАВЛЕНО: оптимальное качество
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // ✅ ДОБАВЛЕНО
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null;
        target.src = "/imgs/placeholder.png";
      }}
    />
  );
};
