"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const MotionLink = motion.create(Link);

type Variant = "primary" | "secondary" | "light" | "accent" | "outline-light";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-background hover:bg-accent hover:text-foreground",
  secondary:
    "border border-foreground/35 text-foreground hover:bg-foreground hover:text-background hover:border-foreground",
  light: "bg-dark-foreground text-dark hover:bg-accent hover:text-dark",
  accent: "bg-accent text-dark hover:bg-dark-foreground hover:text-dark",
  "outline-light":
    "border border-dark-foreground/40 text-dark-foreground hover:bg-dark-foreground hover:text-dark",
};

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  full?: boolean;
}

export function Button({
  children,
  href,
  variant = "primary",
  arrow = true,
  className = "",
  type = "button",
  disabled,
  onClick,
  full,
}: ButtonProps) {
  const classes = `label-sub group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-[0.95rem] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
    full ? "w-full" : ""
  } ${variants[variant]} ${className}`;

  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowUpRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      )}
    </>
  );

  if (href) {
    return (
      <MotionLink
        href={href}
        className={classes}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      >
        {inner}
      </MotionLink>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      {inner}
    </motion.button>
  );
}
