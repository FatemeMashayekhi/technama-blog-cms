import type { ComponentPropsWithoutRef, ElementType } from "react";

type SkeletonProps<T extends ElementType = "span"> = {
  as?: T;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function Skeleton<T extends ElementType = "span">({ as, className = "", ...props }: SkeletonProps<T>) {
  const Component = as ?? "span";
  return <Component aria-hidden="true" className={`skeleton-surface block ${className}`} {...props} />;
}

export function LoadingStatus({ label, className = "", children }: { label: string; className?: string; children: React.ReactNode }) {
  return <div aria-busy="true" aria-live="polite" className={className}><span className="sr-only">{label}</span>{children}</div>;
}
