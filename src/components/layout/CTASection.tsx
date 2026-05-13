"use client";

import React from "react";
import { motion } from "framer-motion";
import CTAButton from "@/components/ui/CTAButton";
import { useTranslations } from "next-intl";

interface CTASectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

export default function CTASection({
  eyebrow,
  title,
  description,
  buttonText,
  buttonHref = "/contact",
}: CTASectionProps) {
  const t = useTranslations("common");
  const resolvedEyebrow = eyebrow ?? t("ctaSection.eyebrow");
  const resolvedTitle = title ?? t("ctaSection.title");
  const resolvedDescription = description ?? t("ctaSection.description");
  const resolvedButtonText = buttonText ?? t("ctaSection.buttonText");
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      style={{
        padding: "clamp(5rem, 9vw, 10rem) clamp(2rem, 8vw, 10rem)",
        background: "rgba(211,84,0,0.06)",
        borderTop: "1px solid rgba(211,84,0,0.18)",
        borderBottom: "1px solid rgba(211,84,0,0.18)",
        textAlign: "center",
      }}
    >
      <p
        style={{
          color: "#ffffff",
          fontSize: "clamp(1.1rem, 1.6vw, 1.6rem)",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          marginBottom: "1.75rem",
          opacity: 0.85,
          fontFamily: "var(--font-body)",
        }}
      >
        {resolvedEyebrow}
      </p>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: "clamp(2.5rem, 6vw, 6rem)",
          textTransform: "uppercase",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: "#fff",
          marginBottom: "2rem",
        }}
      >
        {resolvedTitle}
      </h2>
      <p
        style={{
          fontFamily: "var(--font-body)",
          color: "#ffffff",
          fontSize: "clamp(1.2rem, 1.8vw, 1.8rem)",
          lineHeight: 1.6,
          maxWidth: "800px",
          margin: "0 auto 3.5rem",
          opacity: 0.85,
          textAlign: "center",
        }}
      >
        {resolvedDescription}
      </p>
      <CTAButton href={buttonHref}>{resolvedButtonText}</CTAButton>
    </motion.section>
  );
}
