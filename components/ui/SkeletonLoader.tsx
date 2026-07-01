import React from "react";

export const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`bg-slate-200 dark:bg-slate-700 animate-pulse rounded ${className}`} />
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4,
}) => {
  return (
    <div className="w-full space-y-4">
      {/* Table Header Skeleton */}
      <div className="flex gap-4 pb-2 border-b border-slate-200">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={`h-${i}`} className="h-5 flex-1 bg-slate-300" />
        ))}
      </div>
      
      {/* Table Rows Skeleton */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={`r-${r}`} className="flex gap-4 py-3 border-b border-slate-100 items-center">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={`c-${r}-${c}`} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={`card-${i}`} className="border border-slate-200 rounded-lg p-5 bg-white space-y-4 shadow-sm">
          {/* Card Image Placeholder */}
          <Skeleton className="h-48 w-full rounded-md" />
          
          {/* Card Header Placeholder */}
          <Skeleton className="h-6 w-3/4" />
          
          {/* Card Subtitle Placeholder */}
          <Skeleton className="h-4 w-1/2" />
          
          {/* Card Description Lines */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
          
          {/* Card Footer Buttons */}
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};
