import React from "react";

interface Props{
  message:string 
}
export function ZodErrors({message}:Props) {
  return (
    <div className="text-pink-500 text-xs italic p-2">
      {message}
    </div>
  );
}
