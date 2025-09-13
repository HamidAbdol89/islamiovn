import { cn } from "@/lib/utils";
import React from "react";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-primary/10",
        "before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:animate-[shimmer_1.5s_infinite]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
