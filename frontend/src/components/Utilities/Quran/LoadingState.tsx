import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { LoadingStateProps } from "./types";

const LoadingState: React.FC<LoadingStateProps> = React.memo(({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      {/* Icon placeholder */}
      <Skeleton className="h-10 w-10 rounded-full" />

      {/* Message placeholder */}
      {message ? (
        <p className="text-muted-foreground text-sm">{message}</p>
      ) : (
        <Skeleton className="h-4 w-40" />
      )}
    </div>
  );
});

LoadingState.displayName = "LoadingState";

export default LoadingState;
