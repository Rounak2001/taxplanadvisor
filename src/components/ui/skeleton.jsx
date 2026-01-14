import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
<<<<<<< HEAD
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
=======
    return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
>>>>>>> cdbc0ff (added auth and conversion to ts, tsx)
}

export { Skeleton };
