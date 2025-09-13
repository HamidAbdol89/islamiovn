import React, { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import QuranReader from "./QuranReader";
import "./globals.css";

interface QuranAppProps {
  className?: string;
}

const QuranApp: React.FC<QuranAppProps> = React.memo(({ className = "" }) => {
  return (
    <div className={`quran-app ${className}`}>
      <Suspense
        fallback={
          <Card className="bg-card border-border max-w-2xl mx-auto mt-8">
            <CardContent className="p-6 space-y-4">
              {/* Header skeleton */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-6 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-6 w-6 rounded-md" />
              </div>

              {/* List Surah skeleton */}
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-6 w-6 rounded-md" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-5 rounded-md" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        }
      >
        <QuranReader />
      </Suspense>
    </div>
  );
});

QuranApp.displayName = "QuranApp";

export default QuranApp;
