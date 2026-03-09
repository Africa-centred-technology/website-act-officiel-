import type { Variants } from "framer-motion";

/* ─── Viewport config ─── */
export const viewport = { once: true, margin: "-80px" } as const;

/* ─── Spring configs ─── */
export const spring = {
  soft:   { type: "spring", stiffness: 70,  damping: 18 } as const,
  medium: { type: "spring", stiffness: 100, damping: 20 } as const,
  snappy: { type: "spring", stiffness: 160, damping: 22 } as const,
};

/* ─── Core variants ─── */
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 50,  filter: "blur(10px)" },
  visible: { opacity: 1, y: 0,   filter: "blur(0px)", transition: spring.soft },
};

export const fadeDown: Variants = {
  hidden:  { opacity: 0, y: -40, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0,   filter: "blur(0px)", transition: spring.soft },
};

export const fadeLeft: Variants = {
  hidden:  { opacity: 0, x: -60, filter: "blur(10px)" },
  visible: { opacity: 1, x: 0,   filter: "blur(0px)", transition: spring.soft },
};

export const fadeRight: Variants = {
  hidden:  { opacity: 0, x: 60,  filter: "blur(10px)" },
  visible: { opacity: 1, x: 0,   filter: "blur(0px)", transition: spring.soft },
};

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.82, filter: "blur(8px)" },
  visible: { opacity: 1, scale: 1,    filter: "blur(0px)", transition: spring.medium },
};

export const clipReveal: Variants = {
  hidden:  { clipPath: "inset(0 100% 0 0)", opacity: 0 },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    opacity: 1,
    transition: { duration: 0.9, ease: [0.6, 0.05, 0, 0.95] },
  },
};

/* ─── Container / stagger ─── */
export const stagger = (delay = 0.1): Variants => ({
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: delay, delayChildren: 0.1 } },
});

export const staggerFast: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

export const staggerSlow: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.2 } },
};

/* ─── Section title helpers ─── */
export const sectionTitle: Variants = {
  hidden:  { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.6, 0.05, 0, 0.95] },
  },
};
