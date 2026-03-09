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
}

/** Clone-signature glassmorphism button with diamond icon + gradient border */
export default function CTAButton({
  href, onClick, children, className = "", external = false,
}: CTAButtonProps) {
  const inner = (
    <div className="cta-btn__inner">
      <span className="cta-btn__icon" aria-hidden="true" />
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
      className={`cta-btn ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      {decorators}
      {inner}
    </motion.button>
  );
}
