"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface CTAButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  noIcon?: boolean;
  disabled?: boolean;
}

/** Clone-signature glassmorphism button with diamond icon + gradient border */
export default function CTAButton({
  href, onClick, children, className = "", external = false, type = "button", icon, iconPosition = "left", noIcon = false, disabled = false
}: CTAButtonProps) {
  const renderedIcon = !noIcon ? (
    icon ? (
      <span className="cta-btn__custom-icon" aria-hidden="true" style={{ color: "#D35400", display: "flex", alignItems: "center" }}>
        {icon}
      </span>
    ) : (
      <span className="cta-btn__icon" aria-hidden="true" />
    )
  ) : null;

  const inner = (
    <div className="cta-btn__inner" style={{ flexDirection: iconPosition === "right" ? "row-reverse" : "row" }}>
      {renderedIcon}
      <span className="cta-btn__text">{children}</span>
    </div>
  );

  const decorators = (
    <>
      <div className="cta-btn__border" aria-hidden="true" />
      <div className="cta-btn__blur"   aria-hidden="true" />
      <div className="cta-btn__background" aria-hidden="true" />
    </>
  );

  if (href) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className={className}>
        <Link
          href={href}
          className="cta-btn"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {decorators}
          {inner}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`cta-btn ${className}`}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.65 : 1,
      }}
    >
      {decorators}
      {inner}
    </motion.button>
  );
}
