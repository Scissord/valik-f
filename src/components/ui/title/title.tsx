import { titleFont } from "@/config/fonts";
import React from "react";
interface Props {
  title: string;
  subtitle?: string;
  className?: string;
  total?: number;
}
export const Title = ({
  title,
  subtitle,
  className,
  total
}: Props) => {
  return (
    <div className={`${className}`}>
      <h1
        className={`${titleFont.className} antialiased text-4xl font-semibold mb-5`}
      >
        {title}
      </h1>
      {subtitle && <h3 className="text-xl mb-5">
        {subtitle}
        {total && <span className="ml-1 font-semibold">({total})</span>}
      </h3>}
    </div>
  );
};
