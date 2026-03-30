"use client";

/**
 * CatalogueSection — Résumé interactif des formations par domaine
 * Version unifiée supportant Shopify et Fallback statique
 */

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useShopifyFormations } from "@/hooks/useShopifyFormations";
import { FORMATIONS } from "@/lib/data/formations";

const ORANGE = "#D35400";
const EASE = [0.6, 0.08, 0.02, 0.99] as const;

export default function CatalogueSection() {
  const { formations: shopifyFormations, loading, isFallback } = useShopifyFormations();
  const formationsData = isFallback ? FORMATIONS : shopifyFormations;

  // Regrouper par secteur (en gérant les types Shopify et Statiques)
  const grouped = useMemo(() => {
    const map: Record<string, any[]> = {};
    formationsData.forEach((f) => {
      const secteurValue = (f as any).secteur?.value || (f as any).secteur || "Autres";
      if (!map[secteurValue]) map[secteurValue] = [];
      map[secteurValue].push(f);
    });
    return Object.entries(map);
  }, [formationsData]);

  const [openCat, setOpenCat] = useState<string | null>(null);

  if (loading) {
    return (
      <section style={{ background: "rgba(0,0,0,0.35)", padding: "10rem 2rem", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>Chargement du catalogue...</p>
      </section>
    );
  }

  return (
    <section style={{
      background: "rgba(0,0,0,0.35)",
      borderTop: `1px solid ${ORANGE}22`,
      padding: "clamp(4rem, 8vw, 7rem) clamp(1.5rem, 6vw, 8rem)",
      position: "relative",
    }}>
      {/* Ambient glow */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${ORANGE}0D 0%, transparent 60%)`,
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "2rem", marginBottom: "3rem" }}>
          <div>
            <motion.div
              initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55 }}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: ORANGE, boxShadow: `0 0 8px ${ORANGE}` }} />
              <span style={{ fontSize: "0.8rem", color: ORANGE, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700 }}>
                Pôle III · Formation
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.1, ease: [...EASE] }}
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 900,
                textTransform: "uppercase", lineHeight: 1.0, letterSpacing: "-0.02em", color: "#fff",
              }}
            >
              Catalogue<br />
              <span style={{ color: ORANGE }}>de Formations</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Link href="/contact" style={{
              display: "inline-flex", alignItems: "center", gap: "0.6rem",
              padding: "0.75rem 1.5rem",
              border: `1px solid ${ORANGE}55`,
              color: ORANGE, textDecoration: "none",
              fontSize: "0.8rem", fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              Formation sur mesure
            </Link>
          </motion.div>
        </div>

        {/* Sous-titre */}
        <motion.p
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.25, duration: 0.55 }}
          style={{
            fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)", color: "rgba(255,255,255,0.55)",
            lineHeight: 1.7, maxWidth: "600px", marginBottom: "2.5rem",
          }}
        >
          {formationsData.length} programmes disponibles, organisés par domaine — du niveau initiation à expert.
          Cliquez sur une formation pour accéder au programme complet.
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.9, ease: [...EASE] }}
          style={{ height: 1, background: `linear-gradient(90deg, ${ORANGE}44, transparent)`, originX: 0, marginBottom: "2rem" }}
        />

        {/* Accordion par catégorie */}
        <div>
          {grouped.map(([secteur, formations], gi) => (
            <motion.div
              key={secteur}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: gi * 0.06, duration: 0.45 }}
            >
              {/* En-tête catégorie */}
              <button
                onClick={() => setOpenCat(openCat === secteur ? null : secteur)}
                style={{
                  width: "100%", background: "none", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "1rem",
                  padding: "1.1rem 0",
                  borderBottom: `1px solid ${openCat === secteur ? ORANGE + "44" : "rgba(255,255,255,0.08)"}`,
                  transition: "border-color 0.2s",
                }}
              >
                {/* Icône +/- */}
                <motion.span
                  animate={{ rotate: openCat === secteur ? 45 : 0 }}
                  transition={{ duration: 0.22 }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 22, height: 22, flexShrink: 0,
                    border: `1.5px solid ${openCat === secteur ? ORANGE : "rgba(255,255,255,0.3)"}`,
                    borderRadius: "50%",
                    transition: "border-color 0.2s",
                  }}
                >
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M5 1v8M1 5h8"
                      stroke={openCat === secteur ? ORANGE : "rgba(255,255,255,0.5)"}
                      strokeWidth="1.5" strokeLinecap="round"
                    />
                  </svg>
                </motion.span>

                {/* Nom de la catégorie */}
                <span style={{
                  fontWeight: 700, fontSize: "clamp(0.9rem, 1.1vw, 1.05rem)",
                  color: openCat === secteur ? ORANGE : "rgba(255,255,255,0.85)",
                  letterSpacing: "0.04em", textAlign: "left",
                  transition: "color 0.2s", flex: 1,
                }}>
                  {secteur}
                </span>

                {/* Compteur */}
                <span style={{
                  fontSize: "0.75rem", color: "rgba(255,255,255,0.25)",
                  letterSpacing: "0.12em", flexShrink: 0,
                }}>
                  {formations.length} formation{formations.length > 1 ? "s" : ""}
                </span>
              </button>

              {/* Liste dépliable */}
              <AnimatePresence initial={false}>
                {openCat === secteur && (
                  <motion.div
                    key="list"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{ paddingBottom: "0.75rem" }}>
                      {formations.map((f, fi) => {
                        const handle = (f as any).handle || (f as any).slug;
                        const title = (f as any).title;
                        const niveau = (f as any).niveau?.value || (f as any).niveau;
                        const duree = (f as any).duree?.value || (f as any).duree;

                        return (
                          <Link key={handle} href={`/formations/${handle}`} style={{ textDecoration: "none", display: "block" }}>
                            <motion.div
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: fi * 0.04, duration: 0.3 }}
                              whileHover={{ x: 8, backgroundColor: "rgba(255,255,255,0.03)" }}
                              style={{
                                display: "flex", alignItems: "center", gap: "0.85rem",
                                padding: "0.75rem 0 0.75rem 2.5rem",
                                borderBottom: "1px solid rgba(255,255,255,0.04)",
                                cursor: "pointer",
                                transition: "background 0.2s",
                              }}
                            >
                              <span style={{ width: 5, height: 5, borderRadius: "50%", background: `${ORANGE}66`, flexShrink: 0 }} />
                              <span style={{ flex: 1, fontSize: "clamp(0.85rem, 1vw, 0.97rem)", color: "rgba(255,255,255,0.78)", lineHeight: 1.45 }}>
                                {title}
                              </span>
                              <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap", flexShrink: 0, padding: "0.15rem 0.45rem", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.2rem" }}>
                                {niveau}
                              </span>
                              <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.2)", whiteSpace: "nowrap", flexShrink: 0 }}>
                                {duree}
                              </span>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.5 }}>
                                <path d="M5 12h14M12 5l7 7-7 7" />
                              </svg>
                            </motion.div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
