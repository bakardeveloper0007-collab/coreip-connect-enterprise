import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

/** Type-safe links for the two catalog groups without duplicating route literals. */
export function CategoryLink({
  group,
  category,
  className,
  onClick,
  children,
}: {
  group: string;
  category: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  if (group === "software") {
    return (
      <Link to="/software/$category" params={{ category }} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <Link to="/hardware/$category" params={{ category }} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

export function GroupLink({
  group,
  className,
  onClick,
  children,
}: {
  group: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <Link to={group === "software" ? "/software" : "/hardware"} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

export function ProductLink({
  group,
  category,
  product,
  className,
  onClick,
  children,
}: {
  group: string;
  category: string;
  product: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  if (group === "software") {
    return (
      <Link
        to="/software/$category/$product"
        params={{ category, product }}
        className={className}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }
  return (
    <Link to="/hardware/$category/$product" params={{ category, product }} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}