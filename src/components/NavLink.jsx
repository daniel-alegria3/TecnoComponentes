import { Link } from "react-router-dom";
import { forwardRef } from "react";

const NavLink = forwardRef(({ to, children, className, ...props }, ref) => (
  <Link
    to={to}
    ref={ref}
    className={className}
    {...props}
  >
    {children}
  </Link>
));

NavLink.displayName = "NavLink";

export default NavLink;

