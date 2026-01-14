import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const Pagination = ({ className, ...props }) => (
<<<<<<< HEAD
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
=======
    <nav
        role="navigation"
        aria-label="pagination"
        className={cn("mx-auto flex w-full justify-center", className)}
        {...props}
    />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef(
    ({ className, ...props }, ref) => (
        <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
    ),
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
    <li ref={ref} className={cn("", className)} {...props} />
>>>>>>> cdbc0ff (added auth and conversion to ts, tsx)
));
PaginationItem.displayName = "PaginationItem";

const PaginationLink = ({ className, isActive, size = "icon", ...props }) => (
<<<<<<< HEAD
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className,
    )}
    {...props}
  />
=======
    <a
        aria-current={isActive ? "page" : undefined}
        className={cn(
            buttonVariants({
                variant: isActive ? "outline" : "ghost",
                size,
            }),
            className,
        )}
        {...props}
    />
>>>>>>> cdbc0ff (added auth and conversion to ts, tsx)
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ className, ...props }) => (
<<<<<<< HEAD
  <PaginationLink aria-label="Go to previous page" size="default" className={cn("gap-1 pl-2.5", className)} {...props}>
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
=======
    <PaginationLink aria-label="Go to previous page" size="default" className={cn("gap-1 pl-2.5", className)} {...props}>
        <ChevronLeft className="h-4 w-4" />
        <span>Previous</span>
    </PaginationLink>
>>>>>>> cdbc0ff (added auth and conversion to ts, tsx)
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, ...props }) => (
<<<<<<< HEAD
  <PaginationLink aria-label="Go to next page" size="default" className={cn("gap-1 pr-2.5", className)} {...props}>
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
=======
    <PaginationLink aria-label="Go to next page" size="default" className={cn("gap-1 pr-2.5", className)} {...props}>
        <span>Next</span>
        <ChevronRight className="h-4 w-4" />
    </PaginationLink>
>>>>>>> cdbc0ff (added auth and conversion to ts, tsx)
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }) => (
<<<<<<< HEAD
  <span aria-hidden className={cn("flex h-9 w-9 items-center justify-center", className)} {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
=======
    <span aria-hidden className={cn("flex h-9 w-9 items-center justify-center", className)} {...props}>
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">More pages</span>
    </span>
>>>>>>> cdbc0ff (added auth and conversion to ts, tsx)
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
<<<<<<< HEAD
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
=======
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
>>>>>>> cdbc0ff (added auth and conversion to ts, tsx)
};
