import { NavLink as RouterNavLink } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

<<<<<<< HEAD
const NavLink = forwardRef(({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
  return (
    <RouterNavLink
      ref={ref}
      to={to}
      className={({ isActive, isPending }) =>
        cn(className, isActive && activeClassName, isPending && pendingClassName)
      }
      {...props}
    />
  );
});
=======
const NavLink = forwardRef(
    ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
        return (
            <RouterNavLink
                ref={ref}
                to={to}
                className={({ isActive, isPending }) =>
                    cn(className, isActive && activeClassName, isPending && pendingClassName)
                }
                {...props}
            />
        );
    },
);
>>>>>>> cdbc0ff (added auth and conversion to ts, tsx)

NavLink.displayName = "NavLink";

export { NavLink };
