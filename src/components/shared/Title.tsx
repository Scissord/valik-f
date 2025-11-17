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
    <div className={`mb-10 ${className || ''}`}>
      <div className="border-l-4 border-orange-500 pl-4">
        <h1
          className={`${titleFont.className} antialiased text-4xl font-bold text-gray-900`}
        >
          {title}
        </h1>
        
        {subtitle && (
          <div className="flex items-center mt-2">
            <h3 className="text-xl text-gray-600">
              {subtitle}
            </h3>
            {total !== undefined && (
              <span className="ml-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                {total}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
