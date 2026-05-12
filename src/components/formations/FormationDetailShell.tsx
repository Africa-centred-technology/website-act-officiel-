"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, RefreshCw } from "lucide-react";
import FooterStrip from "../layout/FooterStrip";
import FormationInscriptionModal from "./FormationInscriptionModal";
import BrochureRequestModal from "./BrochureRequestModal";
import AnnouncementBar from "../layout/AnnouncementBar";
import {
  DEFAULT_MARQUEE_ITEMS,
  DEFAULT_TRUST_STATS,
  DEFAULT_PAIN_POINTS,
  DEFAULT_AUDIENCE_CARDS,
  getDefaultPricingPlans,
  getDefaultFaqItems,
  DEFAULT_FINAL_CTA,
} from "@/lib/data/formation-defaults";

/* ── Tracking helpers (GTM dataLayer + Meta Pixel + GA4) ── */
type TrackingWindow = Window & {
  dataLayer?: Record<string, unknown>[];
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
};

function trackCtaClick(location: string, formationSlug: string, extras: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as TrackingWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: "cta_click", cta_location: location, formation_slug: formationSlug, ...extras });
  if (typeof w.fbq === "function") {
    w.fbq("trackCustom", "CtaClick", { location, formation_slug: formationSlug, ...extras });
  }
}

function trackInitiateCheckout(formationTitle: string, formationSlug: string, price?: string, currency = "MAD") {
  if (typeof window === "undefined") return;
  const w = window as TrackingWindow;
  const numericValue = price ? parseFloat(price.replace(/[^\d.]/g, "")) : undefined;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({
    event: "begin_checkout",
    formation_slug: formationSlug,
    formation_title: formationTitle,
    value: numericValue,
    currency,
  });
  if (typeof w.fbq === "function") {
    w.fbq("track", "InitiateCheckout", {
      content_name: formationTitle,
      content_category: "formation",
      content_ids: [formationSlug],
      value: numericValue,
      currency,
    });
  }
  if (typeof w.gtag === "function") {
    w.gtag("event", "begin_checkout", {
      currency,
      value: numericValue,
      items: [{ item_id: formationSlug, item_name: formationTitle, item_category: "formation" }],
    });
  }
}

function trackLead(formationTitle: string, formationSlug: string, plan: string) {
  if (typeof window === "undefined") return;
  const w = window as TrackingWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: "generate_lead", formation_slug: formationSlug, formation_title: formationTitle, plan });
  if (typeof w.fbq === "function") {
    w.fbq("track", "Lead", { content_name: formationTitle, content_category: plan, content_ids: [formationSlug] });
  }
  if (typeof w.gtag === "function") {
    w.gtag("event", "generate_lead", { plan, items: [{ item_id: formationSlug, item_name: formationTitle }] });
  }
}

/* ── Palette (dark theme — Landing Formation IA) ─ */
const ACT_DARK      = "#0A1410";
const ACT_DARK_DEEP = "#0A1410";
const ACT_GREEN     = "#1B3022";
const ACT_GREEN_MID = "#2C4A35";
const ACT_ORANGE    = "#D35400";
const ACT_ORANGE_HOT= "#FF6B00";
const ACT_GOLD      = "#F39C12";
const ACT_CREAM     = "#FCF9F2";
const WHITE         = "#FFFFFF";

const TXT           = "#FFFFFF";
const TXT_SOFT      = "rgba(255,255,255,0.78)";
const TXT_MID       = "rgba(255,255,255,0.60)";
const TXT_LOW       = "rgba(255,255,255,0.40)";
const LINE          = "rgba(255,255,255,0.1)";
const LINE_SOFT     = "rgba(255,255,255,0.06)";

const FONT_DISPLAY = "'Lora', 'Times New Roman', serif";
const FONT_BODY    = "'Poppins', -apple-system, system-ui, sans-serif";
const FONT_LABEL   = "'Poppins', system-ui, sans-serif";

interface FormationDetail {
  id: string;
  slug: string;
  title: string;
  secteur: string;
  categorie: string;
  niveau: string;
  duree: string;
  format: string;
  parcours?: string;
  prix?: string;
  accroche: string;
  publicCible: string;
  prerequis: string;
  objectifs: string[];
  programme: { module: string; description: string }[];
  livrables: string[];
  methode: string;
  imageUrl?: string;
  images?: string[];
  descriptionHtml?: string;
  pricingPlans?: {
    title: string;
    description: string;
    amount: string;
    currency?: string;
    old_price?: string;
    badge?: string;
    featured?: boolean;
    cta_label: string;
    cta_type: "inscription" | "contact" | "external";
    cta_url?: string;
    features: string[];
  }[];
  experts?: { nom: string; role: string; bio?: string; photo?: string }[];
  outilsCouverts?: { name: string; color?: "gold" | "orange" }[];
  brochureUrl?: string;
  hookPain?: string;
  hookPainQuestion?: string;
  promesseTitre?: string;
  taglineAction?: string;
  sessionDate?: string;
  sessionLieu?: string;
  sessionDateCourte?: string;
  uspBanner?: string;
  cafeLabel?: string;
  painPoints?: { title: string; text: string; image_url?: string }[];
  announcementItems?: string[];
  faqItems?: { question: string; answer: string }[];
}

/* ── Diamond (brand marker) ──────────────────────────────── */
const Diamond = ({ color = ACT_ORANGE, size = 10 }: { color?: string; size?: number }) => (
  <span style={{
    display: "inline-block",
    width: size, height: size,
    background: color,
    transform: "rotate(-43.264deg)",
    flexShrink: 0,
  }} />
);

const Eyebrow = ({ children, centered = false }: { children: React.ReactNode; centered?: boolean }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: 12,
    fontFamily: FONT_LABEL, fontSize: 12, letterSpacing: "0.24em",
    textTransform: "uppercase", color: ACT_ORANGE, fontWeight: 600,
    justifyContent: centered ? "center" : "flex-start",
  }}>
    <Diamond />
    {children}
  </div>
);

/* ── Grain texture (overlay blend for dark bg) ───────────── */
const Grain = () => (
  <div aria-hidden style={{
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    backgroundSize: "160px 160px",
    opacity: 0.04,
    mixBlendMode: "overlay",
  }} />
);


const bubbleStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.18)",
  padding: "2px 8px",
  fontVariantNumeric: "tabular-nums",
  borderRadius: 2,
  fontWeight: 600,
};

/* ── CTA Button ──────────────────────────────────────────── */
type BtnVariant = "primary" | "ghost" | "dark";
const Btn = ({
  children, variant = "primary", onClick, href, style, minWidth,
}: {
  children: React.ReactNode;
  variant?: BtnVariant;
  onClick?: () => void;
  href?: string;
  style?: React.CSSProperties;
  minWidth?: string | number;
}) => {
  const base: React.CSSProperties = {
    position: "relative", display: "inline-flex", alignItems: "center", gap: 14,
    padding: "16px 28px", fontFamily: FONT_LABEL, fontSize: 12, fontWeight: 600,
    letterSpacing: "0.18em", textTransform: "uppercase",
    cursor: "pointer", border: "none", whiteSpace: "nowrap",
    transition: "transform 0.25s cubic-bezier(0.6,0.08,0.02,0.99), box-shadow 0.25s, background 0.25s, border-color 0.25s",
    textDecoration: "none", minWidth, justifyContent: minWidth ? "space-between" : undefined,
  };
  const variants: Record<BtnVariant, React.CSSProperties> = {
    primary: {
      background: ACT_ORANGE, color: ACT_CREAM,
      boxShadow: "0 14px 40px -10px rgba(211,84,0,0.55)",
    },
    ghost: {
      background: "rgba(255,255,255,0.04)", color: TXT,
      border: `1px solid rgba(255,255,255,0.14)`,
      backdropFilter: "blur(6px)",
    },
    dark: {
      background: ACT_DARK, color: ACT_CREAM,
      border: `1px solid rgba(252,249,242,0.15)`,
    },
  };
  const inner = (
    <span
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={(e) => {
        if (variant === "primary") (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        if (variant === "ghost") { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.borderColor = ACT_ORANGE; }
        if (variant === "dark")  { (e.currentTarget as HTMLElement).style.background = ACT_GREEN; }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "";
        if (variant === "ghost") { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.14)"; }
        if (variant === "dark")  { (e.currentTarget as HTMLElement).style.background = ACT_DARK; }
      }}
    >
      {children}
    </span>
  );
  if (href) return <a href={href}>{inner}</a>;
  return <button onClick={onClick} style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>{inner}</button>;
};

/* ── FAQ Item ────────────────────────────────────────────── */
function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderBottom: `1px solid ${LINE}` }}>
      <button onClick={onToggle} style={{
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20,
        padding: "28px 0", width: "100%", background: "none", border: "none", cursor: "pointer",
        textAlign: "left", color: open ? ACT_ORANGE : TXT, transition: "color 0.2s",
      }}>
        <span style={{
          fontFamily: FONT_DISPLAY, fontSize: 22, lineHeight: 1.25,
          letterSpacing: "-0.015em", fontWeight: 500,
        }}>{q}</span>
        <span style={{
          width: 32, height: 32, border: `1px solid ${open ? ACT_ORANGE : "rgba(255,255,255,0.2)"}`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          position: "relative", transition: "all 0.3s",
          background: open ? ACT_ORANGE : "transparent",
          color: open ? ACT_CREAM : TXT,
        }}>
          <span style={{ position: "absolute", width: 12, height: 1, background: "currentColor" }} />
          {!open && <span style={{ position: "absolute", width: 1, height: 12, background: "currentColor" }} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div style={{
              padding: "0 0 28px 0", fontFamily: FONT_BODY, fontSize: 15, lineHeight: 1.65,
              color: "rgba(255,255,255,0.72)", fontWeight: 300, maxWidth: 720,
            }}>
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────── */
export default function FormationDetailShell({ slug }: { slug: string }) {
  const router = useRouter();
  const [formation, setFormation] = useState<FormationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [openModule, setOpenModule] = useState<number | null>(0);
  const [openObjectif, setOpenObjectif] = useState<number | null>(0);
  const [isInscriptionOpen, setIsInscriptionOpen] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen]       = useState(false);

  const loadFormation = async () => {
    setIsLoading(true);
    setFetchError(false);
    try {
      const res = await fetch(`/api/shopify/formations/${slug}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setFormation(json.formation ?? null);
    } catch (err) {
      console.error("[FormationDetailShell] fetch failed:", err);
      setFetchError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadFormation(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [slug]);

  /* ── Sticky CTA bar visibility ─ */
  const [showStickyBar, setShowStickyBar] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      setShowStickyBar(y > 600 && y + winHeight < totalHeight - 900);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const audience = useMemo(() => {
    if (!formation?.publicCible) return [];
    return formation.publicCible.split(",").map(p => p.trim()).filter(Boolean);
  }, [formation]);

  /* ── Loading / Error states ─ */
  if (isLoading) {
    return (
      <div style={loadingStyle}>
        <Loader2 size={40} color={ACT_ORANGE} style={{ animation: "spin 1s linear infinite" }} />
        <style jsx global>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  if (fetchError || !formation) {
    return (
      <div style={loadingStyle}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 32, color: TXT, marginBottom: 16 }}>
            Impossible de charger la formation
          </h2>
          <Btn variant="primary" onClick={loadFormation}>
            <RefreshCw size={14} /> Réessayer
          </Btn>
        </div>
      </div>
    );
  }

  /* ── Derived content ─ valeurs par défaut partagées (hybride) ─ */
  const marqueeItems  = DEFAULT_MARQUEE_ITEMS;
  const trustStats    = DEFAULT_TRUST_STATS;
  const painCards     = DEFAULT_PAIN_POINTS;
  const outils        = formation.outilsCouverts ?? [];
  const hasOutils     = outils.length > 0;
  const toolsRow1     = outils.slice(0, Math.ceil(outils.length / 2));
  const toolsRow2     = outils.slice(Math.ceil(outils.length / 2));
  const audienceCards = DEFAULT_AUDIENCE_CARDS;
  const pricing       = (formation.pricingPlans && formation.pricingPlans.length > 0)
    ? formation.pricingPlans
    : getDefaultPricingPlans(formation.prix);
  const faqs          = (formation.faqItems && formation.faqItems.length > 0)
    ? formation.faqItems
    : getDefaultFaqItems(formation.prerequis);
  const finalCta      = DEFAULT_FINAL_CTA;

  const featuredPlan = formation.pricingPlans?.find((p) => p.featured) ?? formation.pricingPlans?.[0];
  const heroPrixBarre = featuredPlan?.old_price;
  const heroPromoLabel = featuredPlan?.badge;

  const scrollTo = (id: string) => () => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const goInscription = (location: string) => {
    trackCtaClick(location, slug, { formation_title: formation.title });
    trackInitiateCheckout(formation.title, slug, formation.prix);
    setIsInscriptionOpen(true);
  };

  const goContact = (location: string, plan: string) => {
    trackCtaClick(location, slug, { formation_title: formation.title, plan });
    trackLead(formation.title, slug, plan);
    router.push(`/contact?formation=${slug}&plan=${encodeURIComponent(plan.toLowerCase())}`);
  };

  return (
    <div style={{ background: ACT_DARK, color: TXT, fontFamily: FONT_BODY, overflowX: "hidden" }}>
      <Grain />


      {/* ════════════ HERO ════════════ */}
      <header className="act-hero" style={{ position: "relative", padding: "100px 0 120px", overflow: "hidden", borderBottom: `1px solid ${LINE}` }}>
        <div aria-hidden style={heroBgStyle} />
        {(formation.images?.[0] || formation.imageUrl) && (
          <div aria-hidden style={{
            ...heroBgImgStyle,
            backgroundImage: `url('${formation.images?.[0] || formation.imageUrl}')`,
          }} />
        )}
        <div className="act-container" style={containerStyle}>
          <div className="act-hero-grid" style={heroGridStyle}>
            {/* ── Left column ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
             
              <Eyebrow>Formation </Eyebrow>
              <h1 style={{
                fontFamily: FONT_DISPLAY, fontSize: "clamp(46px, 6.4vw, 96px)",
                lineHeight: 0.98, fontWeight: 500, letterSpacing: "-0.025em",
                margin: "28px 0 32px", color: TXT, textWrap: "balance",
              }}>
                {formation.title.split("IA").map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && <em style={{ color: ACT_ORANGE, fontStyle: "italic", fontWeight: 500 }}>IA</em>}
                  </React.Fragment>
                ))}
              </h1>
              <p style={ledeStyle}>{formation.accroche}</p>

              <div className="act-hero-btns" style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                <Btn variant="primary" onClick={() => goInscription("hero_primary")}>Je m'inscris →</Btn>
                <Btn variant="ghost" onClick={() => { trackCtaClick("hero_voir_programme", slug); scrollTo("programme")(); }}>
                  <Diamond /> Voir le programme
                </Btn>
              </div>

              <div style={heroTrustStyle}>
                {trustStats.map((t) => (
                  <div key={t.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{
                      fontFamily: FONT_DISPLAY, fontSize: 32, fontStyle: "italic",
                      color: ACT_ORANGE, letterSpacing: "-0.02em", lineHeight: 1,
                    }}>{t.value}</span>
                    <span style={trustLabelStyle}>{t.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── Right column: product card ── */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}>
              <div className="act-hero-card" style={heroCardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <span style={cardTagStyle}>
                    <Diamond color={ACT_CREAM} size={7} /> {formation.sessionDateCourte || formation.secteur || "Session · 2026"}
                  </span>
                  <span style={{ ...monoStyle, color: ACT_GOLD }}>
                    ● Inscriptions ouvertes
                  </span>
                </div>
                <h3 style={{
                  fontFamily: FONT_DISPLAY, fontSize: 28, lineHeight: 1.15,
                  marginTop: 20, letterSpacing: "-0.02em", color: TXT, fontWeight: 500,
                }}>{formation.title}</h3>

                <div className="act-card-meta" style={cardMetaStyle}>
                  <div>
                    <div style={metaLabelStyle}>Durée</div>
                    <div style={metaValueStyle}>{formation.duree || "2 jours · 14h"} Heures</div>
                  </div>
                  <div>
                    <div style={metaLabelStyle}>Format</div>
                    <div style={metaValueStyle}>{formation.format || "Présentiel + live"}</div>
                  </div>
                  <div>
                    <div style={metaLabelStyle}>Niveau</div>
                    <div style={metaValueStyle}>{formation.niveau || "Tous niveaux"}</div>
                  </div>
                  {formation.sessionDate ? (
                    <div>
                      <div style={metaLabelStyle}>Prochaine session</div>
                      <div style={metaValueStyle}>{formation.sessionDate}</div>
                    </div>
                  ) : formation.secteur && (
                    <div>
                      <div style={metaLabelStyle}>Secteur</div>
                      <div style={metaValueStyle}>{formation.secteur}</div>
                    </div>
                  )}
                  {formation.sessionLieu && (
                    <div style={{ gridColumn: "1 / -1" }}>
                      <div style={metaLabelStyle}>Lieu</div>
                      <div style={metaValueStyle}>📍 {formation.sessionLieu}</div>
                    </div>
                  )}
                </div>

                <div style={cardPriceRowStyle}>
                  <div>
                    <div style={{ ...monoStyle, marginBottom: 4 }}>{heroPromoLabel ? "Tarif promotionnel" : "Tarif"}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                      <span className="act-hero-price" style={{
                        fontFamily: FONT_DISPLAY, fontSize: 52, color: ACT_ORANGE,
                        letterSpacing: "-0.03em", lineHeight: 1, fontStyle: "italic",
                      }}>{formation.prix || "Sur devis"}</span>
                      {formation.prix && <span style={{ fontFamily: FONT_LABEL, fontSize: 14, color: TXT_MID }}>MAD HT</span>}
                    </div>
                    {heroPrixBarre && (
                      <div style={{ textDecoration: "line-through", color: "rgba(255,255,255,0.35)", fontSize: 16, marginTop: 4 }}>
                        {heroPrixBarre}
                      </div>
                    )}
                  </div>
                  {heroPromoLabel && (
                    <div style={{
                      background: ACT_GOLD, color: ACT_DARK, padding: "4px 10px",
                      fontFamily: FONT_LABEL, fontSize: 10, fontWeight: 700,
                      letterSpacing: "0.16em", textTransform: "uppercase",
                    }}>{heroPromoLabel}</div>
                  )}
                </div>

                <Btn variant="primary" onClick={() => goInscription("hero_card")} style={{ marginTop: 20, width: "100%", justifyContent: "center" }}>
                  Je m'inscris →
                </Btn>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* ════════════ MARQUEE ════════════ */}
      <div style={marqueeStyle}>
        <div style={{ display: "flex", gap: 72, animation: "marqueeScroll 45s linear infinite", width: "max-content", alignItems: "center" }}>
          {[...marqueeItems, ...marqueeItems].map((t, i) => (
            <span key={i} style={{
              fontFamily: FONT_DISPLAY, fontStyle: "italic", fontSize: 22,
              color: TXT_LOW, letterSpacing: "-0.01em", whiteSpace: "nowrap",
              display: "inline-flex", alignItems: "center", gap: 18,
            }}>
              <Diamond color={ACT_ORANGE} /> {t}
            </span>
          ))}
        </div>
      </div>

      {/* ════════════ PAIN ════════════ */}
      <section className="act-section" style={secStyle}>
        <div className="act-container" style={containerStyle}>
          <div style={secHeadStyle}>
            <Eyebrow>Le constat</Eyebrow>
            <h2 style={h2Style}>
              {formation.hookPain || (
                <>Même outils, même brief :<br /><em style={emStyle}>résultats pas à la hauteur</em> de vos attentes.</>
              )}
            </h2>
          </div>

          {/* Bloc Question / Réponse — moment dramatique */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={painQABlockStyle}
          >
            <div style={painQuestionStyle}>
              {formation.hookPainQuestion || "Vous vous demandez pourquoi ?"}
            </div>
            <div style={painAnswerStyle}>
              <span style={{ color: ACT_ORANGE, marginRight: 14, fontWeight: 700, fontStyle: "normal" }}>→</span>
              {formation.promesseTitre || "La réponse n'est pas dans l'outil, mais dans la méthode."}
            </div>
          </motion.div>

          <div style={painSubheadStyle}>
            <Diamond color={ACT_GOLD} size={6} />  Les problèmes récurrents que vous rencontrez :
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {(formation.painPoints && formation.painPoints.length > 0
              ? formation.painPoints
              : painCards.map((p) => ({ title: p.title, text: p.text, image_url: undefined }))
            ).slice(0, 3).map((p, i) => {
              const productImages = formation.images && formation.images.length > 0 ? formation.images : [];
              const imgUrl = p.image_url || productImages[i % Math.max(productImages.length, 1)];
              return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                style={painCardStyle}
              >
                {imgUrl && (
                  <div style={{
                    aspectRatio: "16/10", backgroundImage: `url(${imgUrl})`,
                    backgroundSize: "cover", backgroundPosition: "center",
                    margin: "-32px -32px 24px", filter: "grayscale(0.3) contrast(1.05)",
                    position: "relative",
                  }}>
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(180deg, rgba(10,20,16,0.1) 0%, rgba(10,20,16,0.85) 100%)",
                    }} />
                  </div>
                )}
                <div style={{ fontFamily: FONT_DISPLAY, fontStyle: "italic", fontSize: 54, color: "rgba(255,255,255,0.1)", lineHeight: 1 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 26, lineHeight: 1.15, marginTop: 14, color: TXT, fontWeight: 500 }}>{p.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.68)", marginTop: 14, fontWeight: 300 }}>{p.text}</p>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════ VALUE ════════════ */}
      <section className="act-section" style={{ ...secStyle, background: ACT_DARK_DEEP }}>
        <div className="act-container" style={containerStyle}>
          <div style={secHeadStyle}>
            <Eyebrow>Ce que vous repartirez avec</Eyebrow>
            <h2 style={h2Style}>Pas une formation.<br />Un <em style={emStyle}>déclic</em> opérationnel.</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 60, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {formation.objectifs.slice(0, 6).map((obj, i) => {
                const isOpen = openObjectif === i;
                const truncated = obj.length > 80;
                const preview = truncated ? obj.slice(0, 80) + "…" : obj;
                const isClickable = truncated;
                return (
                  <div key={i} style={{ borderTop: `1px solid rgba(255,255,255,0.1)` }}>
                    <button
                      onClick={() => isClickable && setOpenObjectif(isOpen ? null : i)}
                      style={{
                        display: "grid", gridTemplateColumns: "40px 1fr 36px", gap: 24,
                        width: "100%", padding: "28px 0", textAlign: "left",
                        background: "none", border: "none",
                        cursor: isClickable ? "pointer" : "default",
                        color: TXT, alignItems: "start",
                      }}
                    >
                      <div style={valueNumStyle}>{String(i + 1).padStart(2, "0")}</div>
                      <h3 style={{
                        fontFamily: FONT_DISPLAY, fontSize: 24, lineHeight: 1.25,
                        color: isOpen ? ACT_ORANGE : TXT, fontWeight: 500, margin: 0,
                        transition: "color 0.25s",
                      }}>
                        {isOpen ? obj : preview}
                      </h3>
                      {isClickable && (
                        <span style={{
                          width: 28, height: 28, marginTop: 4,
                          border: `1px solid ${isOpen ? ACT_ORANGE : "rgba(255,255,255,0.2)"}`,
                          background: isOpen ? ACT_ORANGE : "transparent",
                          color: isOpen ? ACT_CREAM : TXT,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          position: "relative", transition: "all 0.3s", justifySelf: "end",
                        }}>
                          <span style={{ position: "absolute", width: 11, height: 1, background: "currentColor" }} />
                          {!isOpen && <span style={{ position: "absolute", width: 1, height: 11, background: "currentColor" }} />}
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {formation.experts && formation.experts.length > 0 && (
              <div className="act-value-visual" style={valueVisualStyle}>
                <div>
                  <div style={{ ...monoStyle, color: ACT_CREAM, opacity: 0.8 }}>L'équipe pédagogique</div>
                  <h4 style={{ fontFamily: FONT_DISPLAY, fontSize: 42, lineHeight: 1.05, letterSpacing: "-0.02em", marginTop: 16, color: TXT, fontWeight: 500 }}>
                    Conçue par<br /><em style={emStyle}>{formation.experts.length} experts</em><br />de leur domaine.
                  </h4>
                </div>
                <div className="act-experts-grid" style={{
                  display: "grid",
                  gridTemplateColumns: formation.experts.length > 2 ? "1fr 1fr" : "1fr",
                  gap: 20, marginTop: 24,
                }}>
                  {formation.experts.slice(0, 4).map((e, i) => (
                    <div key={i} style={expertCardStyle}>
                      <div style={{
                        width: 56, height: 56, borderRadius: "50%",
                        backgroundImage: e.photo ? `url(${e.photo})` : undefined,
                        backgroundColor: e.photo ? undefined : "rgba(255,255,255,0.08)",
                        backgroundSize: "cover", backgroundPosition: "center",
                        border: `2px solid rgba(211,84,0,0.4)`,
                        flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: ACT_ORANGE, fontFamily: FONT_DISPLAY, fontStyle: "italic", fontSize: 22,
                      }}>
                        {!e.photo && e.nom.charAt(0)}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, color: TXT, fontWeight: 500, lineHeight: 1.2, letterSpacing: "-0.01em" }}>
                          {e.nom}
                        </div>
                        <div style={{ ...monoStyle, fontSize: 10, color: ACT_GOLD, marginTop: 4, letterSpacing: "0.18em" }}>
                          {e.role}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ════════════ TOOLS ════════════ */}
      {hasOutils && (
        <section className="act-section" style={secStyle}>
          <div className="act-container" style={containerStyle}>
            <div style={secHeadStyle}>
              <Eyebrow>Les outils couverts</Eyebrow>
              <h2 style={{ ...h2Style, maxWidth: 780 }}>{outils.length}+ outils IA maîtrisés.<br />Aucune <em style={emStyle}>install</em> obligatoire.</h2>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {(toolsRow2.length > 0 ? [toolsRow1, toolsRow2] : [toolsRow1]).map((row, idx) => (
              <div key={idx} style={{
                display: "flex", gap: 20, alignItems: "center",
                animation: `toolsSlide 40s linear infinite ${idx === 1 ? "reverse" : ""}`,
                width: "max-content",
              }}>
                {[...row, ...row, ...row, ...row, ...row, ...row,, ...row, ...row].map((t, i) => (
                  <div key={i} style={toolPillStyle}>
                    <span style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: t.color === "gold" ? ACT_GOLD : ACT_ORANGE,
                    }} />
                    {t.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ════════════ PROGRAMME ════════════ */}
      <section id="programme" className="act-section" style={{ ...secStyle, background: ACT_DARK_DEEP }}>
        <div className="act-container" style={containerStyle}>
          <div style={secHeadStyle}>
            <Eyebrow>Programme · {formation.duree || "14 heures"}</Eyebrow>
            <h2 style={h2Style}>Un parcours <em style={emStyle}>dense</em>,<br />100% opérationnel.</h2>
            <p style={secPStyle}>Pas de cours magistral. Chaque module alterne 30% de théorie, 70% d'atelier, avec un livrable concret à la fin.</p>
          </div>

          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute", top: 0, bottom: 0, left: 40, width: 1,
              background: `linear-gradient(180deg, transparent, rgba(211,84,0,0.4) 15%, rgba(211,84,0,0.4) 85%, transparent)`,
            }} />

            {formation.programme.map((mod, i) => {
              const isOpen = openModule === i;
              const hasDescription = !!mod.description;
              return (
                <div key={i} className="act-prog-mod" style={{ position: "relative", paddingLeft: 100, paddingBottom: 24 }}>
                  <div style={{
                    position: "absolute", left: 34, top: 28, width: 14, height: 14,
                    background: ACT_ORANGE, transform: "rotate(-43.264deg)",
                    boxShadow: `0 0 0 8px rgba(211,84,0,0.12), 0 0 20px rgba(211,84,0,0.5)`,
                  }} />
                  <button
                    onClick={() => hasDescription && setOpenModule(isOpen ? null : i)}
                    style={{
                      width: "100%", textAlign: "left",
                      background: "none", border: "none", padding: "20px 0",
                      cursor: hasDescription ? "pointer" : "default", color: TXT,
                      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                      gap: 24,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: FONT_LABEL, fontSize: 11, letterSpacing: "0.22em",
                        textTransform: "uppercase", color: ACT_ORANGE, fontWeight: 600,
                      }}>Module {String(i + 1).padStart(2, "0")}</div>
                      <h3 className="act-prog-h3" style={{
                        fontFamily: FONT_DISPLAY, fontSize: 36, lineHeight: 1.1,
                        marginTop: 8, color: isOpen ? ACT_ORANGE : TXT, fontWeight: 500,
                        transition: "color 0.25s",
                      }}>{mod.module}</h3>
                    </div>
                    {hasDescription && (
                      <span style={{
                        flexShrink: 0, marginTop: 24,
                        width: 36, height: 36,
                        border: `1px solid ${isOpen ? ACT_ORANGE : "rgba(255,255,255,0.2)"}`,
                        background: isOpen ? ACT_ORANGE : "transparent",
                        color: isOpen ? ACT_CREAM : TXT,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        position: "relative", transition: "all 0.3s",
                      }}>
                        <span style={{ position: "absolute", width: 14, height: 1, background: "currentColor" }} />
                        {!isOpen && <span style={{ position: "absolute", width: 1, height: 14, background: "currentColor" }} />}
                      </span>
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && hasDescription && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <p style={{
                          padding: "0 0 28px 0", margin: 0,
                          maxWidth: 780, fontSize: 16, lineHeight: 1.7,
                          color: "rgba(255,255,255,0.78)", fontWeight: 300,
                        }}>
                          {mod.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════ MID CTA · LEAD MAGNET BROCHURE ════════════ */}
      <section style={{
        padding: "100px 0", position: "relative", overflow: "hidden",
        background: `radial-gradient(ellipse at 30% 50%, rgba(211,84,0,0.3), transparent 60%), radial-gradient(ellipse at 75% 50%, rgba(243,156,18,0.22), transparent 60%), ${ACT_DARK_DEEP}`,
        borderTop: `1px solid rgba(211,84,0,0.3)`, borderBottom: `1px solid rgba(211,84,0,0.3)`,
      }}>
        <div className="act-container" style={containerStyle}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 60, alignItems: "center" }}>
            <div>
              <Eyebrow>Pas encore prêt à vous inscrire ?</Eyebrow>
              <h2 style={{ ...h2Style, fontSize: "clamp(36px, 4.5vw, 64px)", marginTop: 20 }}>
                Téléchargez la <em style={emStyle}>brochure</em> complète.
              </h2>
              <p style={{ ...secPStyle, fontSize: 17 }}>
                Tout le programme, les livrables et les tarifs en 1 PDF · Téléchargement immédiat après validation du formulaire.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
              <Btn
                variant="primary"
                onClick={() => {
                  trackCtaClick("mid_cta_brochure", slug, { formation_title: formation.title });
                  setIsBrochureOpen(true);
                }}
                minWidth={300}
              >
                <span>📄 Télécharger la brochure (PDF)</span><span>→</span>
              </Btn>
              <div style={{
                display: "flex", alignItems: "center", gap: 18, marginTop: 6,
                fontFamily: FONT_LABEL, fontSize: 11, letterSpacing: "0.16em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.5)", fontWeight: 500,
              }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Diamond color={ACT_GOLD} size={6} /> 100% gratuit
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Diamond color={ACT_GOLD} size={6} /> Accès immédiat
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      

      {/* ════════════ AUDIENCE — carrousels infinis ════════════ */}
      <section className="act-section" style={secStyle}>
        <div className="act-container" style={containerStyle}>
          <div style={secHeadStyle}>
            <Eyebrow>Pour qui ?</Eyebrow>
            <h2 style={h2Style}>Conçu pour les pros<br />qui veulent <em style={emStyle}>des résultats</em>.</h2>
          </div>
        </div>

        {(() => {
          const items = audience.length > 0 ? audience : audienceCards.map(a => a.title);
          const half = Math.ceil(items.length / 2);
          const rowA = items.slice(0, half);
          const rowB = items.slice(half).length > 0 ? items.slice(half) : rowA;
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 18, overflow: "hidden" }}>
              {[rowA, rowB].map((row, idx) => (
                <div key={idx} className="audience-row" style={{
                  display: "flex", gap: 18, alignItems: "stretch",
                  animation: `audienceSlide 50s linear infinite ${idx === 1 ? "reverse" : ""}`,
                  width: "max-content",
                }}>
                  {[...row, ...row, ...row, ...row, ...row].map((item, i) => {
                    const card = audienceCards[i % audienceCards.length];
                    const label = typeof item === "string" ? item : card.title;
                    const num = ((i % row.length) + 1 + (idx * row.length));
                    const productImages = formation.images && formation.images.length > 0 ? formation.images : [];
                    const cardImg = productImages.length > 0
                      ? productImages[i % productImages.length]
                      : card.img;
                    return (
                      <div key={i} style={audienceCardStyle}>
                        <div style={{
                          position: "absolute", inset: 0, backgroundImage: `url(${cardImg})`,
                          backgroundSize: "cover", backgroundPosition: "center",
                          opacity: 0.22, filter: "grayscale(0.5) contrast(1.05)", zIndex: 0,
                        }} />
                        <div style={{ position: "relative", zIndex: 1 }}>
                          <div style={audienceIconStyle}>{String(num).padStart(2, "0")}</div>
                        </div>
                        <div style={{ position: "relative", zIndex: 1 }}>
                          <h4 style={{ fontFamily: FONT_DISPLAY, fontSize: 20, lineHeight: 1.15, marginBottom: 8, color: TXT, fontWeight: 500, whiteSpace: "normal" }}>
                            {label}
                          </h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })()}
      </section>

      {/* ════════════ PRICING ════════════ */}
      <section id="pricing" className="act-section" style={secStyle}>
        <div className="act-container" style={containerStyle}>
          <div style={{ ...secHeadStyle, textAlign: "center", marginLeft: "auto", marginRight: "auto" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow centered>Tarifs</Eyebrow></div>
            <h2 style={{ ...h2Style, textAlign: "center" }}>Trois façons de <em style={emStyle}>démarrer</em>.<br />Une seule, la bonne pour vous.</h2>
            <p style={{ ...secPStyle, marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
              Tous les tarifs incluent les supports, les templates, l'agent GPT personnalisé et le suivi 30 jours.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, alignItems: "stretch" }}>
            {pricing.map((p, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ ...priceCardStyle, ...(p.featured ? priceFeaturedStyle : {}) }}
              >
                {p.featured && p.badge && (
                  <div style={priceBadgeStyle}>{p.badge}</div>
                )}
                <div style={{ fontFamily: FONT_LABEL, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: ACT_ORANGE, fontWeight: 600 }}>Formule {String(i + 1).padStart(2, "0")}</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 30, lineHeight: 1.05, marginTop: 10, color: TXT, fontWeight: 500 }}>
                  <em style={emStyle}>{p.title}</em>
                </div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", fontWeight: 300, marginTop: 12 }}>{p.description}</div>

                <div style={{ marginTop: 28, paddingTop: 28, borderTop: `1px dashed rgba(255,255,255,0.1)` }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span className="act-price-feature" style={{
                      fontFamily: FONT_DISPLAY, fontStyle: "italic", fontSize: 72,
                      lineHeight: 0.95, letterSpacing: "-0.03em",
                      color: p.featured ? ACT_ORANGE : WHITE,
                    }}>{p.amount}</span>
                    {p.amount !== "Sur devis" && p.currency && <span style={{ fontFamily: FONT_LABEL, fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>{p.currency}</span>}
                  </div>
                  {p.old_price && (
                    <div style={{
                      textDecoration: p.old_price.startsWith("Réponse") ? "none" : "line-through",
                      fontSize: 14, color: p.old_price.startsWith("Réponse") ? ACT_GOLD : "rgba(255,255,255,0.35)", marginTop: 6,
                    }}>{p.old_price}</div>
                  )}
                </div>

                <ul style={{ marginTop: 28, listStyle: "none", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                  {p.features.map((f, j) => (
                    <li key={j} style={{ fontSize: 14, lineHeight: 1.5, display: "flex", gap: 12, fontWeight: 300, color: "rgba(255,255,255,0.82)" }}>
                      <Diamond size={8} /> {f}
                    </li>
                  ))}
                </ul>

                <Btn
                  variant={p.featured ? "primary" : "ghost"}
                  onClick={p.cta_type === "contact"
                    ? () => goContact(`pricing_${p.title.toLowerCase()}`, p.title)
                    : () => goInscription(`pricing_${p.title.toLowerCase()}`)}
                  style={{ marginTop: 32, width: "100%", justifyContent: "center" }}
                >
                  {p.cta_label} →
                </Btn>
              </motion.div>
            ))}
          </div>

          <div style={{ marginTop: 60, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            <div style={monoStyle}>
              <span style={{ color: ACT_GOLD }}>✓ </span>Paiement en 3× sans frais
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ FAQ ════════════ */}
      <section className="act-section" style={{ ...secStyle, background: ACT_DARK_DEEP }}>
        <div className="act-container" style={containerStyle}>
          <div style={{ ...secHeadStyle, textAlign: "center", marginLeft: "auto", marginRight: "auto" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow centered>Questions fréquentes</Eyebrow></div>
            <h2 style={{ ...h2Style, textAlign: "center" }}>
Vous posez des <br /><em style={emStyle}>question</em>  voici nos réponses </h2>
          </div>

          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            {faqs.map((f, i) => (
              <FaqItem key={i} q={f.question} a={f.answer} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
            ))}
          </div>

          <div style={{ marginTop: 60, textAlign: "center" }}>
            <Btn variant="ghost" href="/contact">
              <Diamond /> Une autre question ? Posez-la nous
            </Btn>
          </div>
        </div>
      </section>

      {/* ════════════ FINAL CTA ════════════ */}
      <section style={finalStyle}>
        <div style={{ ...containerStyle, position: "relative", zIndex: 5 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Eyebrow centered>Prêt à passer à l'action ?</Eyebrow>
          </div>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontSize: "clamp(48px, 7vw, 110px)",
            lineHeight: 0.95, maxWidth: 1000, margin: "20px auto 32px",
            color: TXT, fontWeight: 500, letterSpacing: "-0.025em", textWrap: "balance",
          }}>
            {formation.taglineAction || (
              <>Arrêtez de subir.<br /><em style={emStyle}>Commencez à maîtriser.</em></>
            )}
          </h2>
          <p style={{
            fontSize: 18, lineHeight: 1.55, color: "rgba(255,255,255,0.72)",
            maxWidth: 620, margin: "0 auto 48px", fontWeight: 300,
          }}>
            Réservez votre place dès maintenant — ou si vous préférez, échangez avec un de nos experts autour d'un café avant de vous décider.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn variant="primary" onClick={() => goInscription("final_primary")} style={{ padding: "22px 40px", fontSize: 13 }}>
              {finalCta.primary_label} →
            </Btn>
            <Btn
              variant="ghost"
              href={`/contact?formation=${slug}&intent=cafe`}
              style={{ padding: "22px 40px", fontSize: 13 }}
            >
              ☕ {formation.cafeLabel || "On en parle autour d'un café ?"}
            </Btn>
          </div>
        </div>
      </section>

      {/* ──────────── STICKY CTA BAR + ANNONCES ──────────── */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 160, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 160, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={stickyBarStyle}
          >
            <AnnouncementBar items={formation.announcementItems} />
            <div className="act-sticky-inner" style={stickyBarInnerStyle}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, flex: 1 }}>
                <span style={{
                  fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.18em",
                  textTransform: "uppercase", color: TXT_MID, fontWeight: 600,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {formation.title}
                </span>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{
                    fontFamily: FONT_DISPLAY, fontSize: 26, fontStyle: "italic",
                    color: ACT_ORANGE, letterSpacing: "-0.02em", lineHeight: 1,
                  }}>
                    {formation.prix || "Sur devis"}
                  </span>
                  {formation.prix && (
                    <span style={{ fontFamily: FONT_LABEL, fontSize: 11, color: TXT_MID }}>MAD HT</span>
                  )}
                </div>
              </div>
              <Btn variant="primary" onClick={() => goInscription("sticky_bar")} style={{ flexShrink: 0 }}>
                Je m'inscris →
              </Btn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FormationInscriptionModal
        isOpen={isInscriptionOpen}
        onClose={() => setIsInscriptionOpen(false)}
        formationTitle={formation.title}
        formationSlug={slug}
      />

      <BrochureRequestModal
        isOpen={isBrochureOpen}
        onClose={() => setIsBrochureOpen(false)}
        formationTitle={formation.title}
        formationSlug={slug}
        brochureUrl={formation.brochureUrl}
      />

      <FooterStrip />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Poppins:wght@300;400;500;600;700&display=swap');
        @keyframes marqueeScroll { to { transform: translateX(-50%); } }
        @keyframes toolsSlide    { to { transform: translateX(-50%); } }
        @keyframes audienceSlide { to { transform: translateX(-50%); } }
        .audience-row:hover { animation-play-state: paused; }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(1.4); }
        }

        /* ── Responsive — tablet (≤1024px) ── */
        @media (max-width: 1024px) {
          .act-container  { padding: 0 24px !important; }
          .act-hero       { padding: 80px 0 100px !important; }
          .act-hero-grid  { grid-template-columns: 1fr !important; gap: 48px !important; }
          .act-section    { padding: 88px 0 !important; }
          .act-value-visual {
            position: relative !important; top: auto !important;
            aspect-ratio: unset !important; padding: 36px !important;
          }
          .act-prog-mod   { padding-left: 72px !important; }
          .act-prog-h3    { font-size: 28px !important; }
          .act-price-feature { font-size: 56px !important; }
        }

        /* ── Responsive — mobile (≤768px) ── */
        @media (max-width: 768px) {
          .act-container  { padding: 0 20px !important; }
          .act-hero       { padding: 64px 0 80px !important; }
          .act-hero-grid  { grid-template-columns: 1fr !important; gap: 40px !important; }
          .act-hero-card  { padding: 22px !important; }
          .act-hero-btns  { justify-content: center !important; }
          .act-hero-price { font-size: 38px !important; }
          .act-card-meta  { grid-template-columns: 1fr 1fr !important; gap: 12px 16px !important; }
          .act-section    { padding: 72px 0 !important; }
          .act-value-visual { padding: 28px !important; }
          .act-value-visual h4 { font-size: 32px !important; }
          .act-experts-grid { grid-template-columns: 1fr !important; }
          .act-prog-mod   { padding-left: 64px !important; }
          .act-prog-h3    { font-size: 24px !important; }
          .act-price-feature { font-size: 48px !important; }
          .act-sticky-inner {
            padding: 10px 16px !important;
            gap: 12px !important;
            flex-wrap: wrap !important;
          }
          .act-sticky-inner > div { min-width: 0; flex: 1 1 auto !important; }
          .act-sticky-inner > button { margin-left: auto !important; }
        }

        /* ── Responsive — small mobile (≤480px) ── */
        @media (max-width: 480px) {
          .act-container  { padding: 0 16px !important; }
          .act-hero       { padding: 48px 0 64px !important; }
          .act-hero-card  { padding: 16px !important; }
          .act-hero-price { font-size: 30px !important; }
          .act-card-meta  { grid-template-columns: 1fr !important; }
          .act-section    { padding: 56px 0 !important; }
          .act-value-visual { padding: 20px !important; }
          .act-value-visual h4 { font-size: 26px !important; }
          .act-experts-grid { grid-template-columns: 1fr !important; }
          .act-prog-mod   { padding-left: 60px !important; }
          .act-prog-h3    { font-size: 20px !important; }
          .act-price-feature { font-size: 40px !important; }
          .act-sticky-inner {
            padding: 8px 12px !important;
            gap: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ═════════════ Styles ═════════════ */
const loadingStyle: React.CSSProperties = {
  minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
  background: ACT_DARK, color: TXT,
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1280, margin: "0 auto", padding: "0 40px",
  position: "relative", zIndex: 3,
};

const topbarStyle: React.CSSProperties = {
  position: "sticky", top: 0, zIndex: 100,
  background: ACT_ORANGE, color: ACT_CREAM, padding: "10px 20px",
  display: "flex", justifyContent: "center", alignItems: "center", gap: 24,
  fontFamily: FONT_LABEL, fontSize: 12, letterSpacing: "0.14em",
  textTransform: "uppercase", fontWeight: 500,
  borderBottom: `1px solid rgba(0,0,0,0.15)`, overflow: "hidden",
  flexWrap: "wrap",
};

const pulseDotStyle: React.CSSProperties = {
  width: 8, height: 8, borderRadius: "50%",
  background: ACT_CREAM, animation: "pulseDot 1.6s ease-in-out infinite",
};

const heroBgStyle: React.CSSProperties = {
  position: "absolute", inset: 0, zIndex: 0,
  background: `
    radial-gradient(ellipse 80% 50% at 20% 30%, rgba(211,84,0,0.28), transparent 60%),
    radial-gradient(ellipse 60% 60% at 85% 80%, rgba(27,48,34,0.5), transparent 60%)
  `,
};

const heroBgImgStyle: React.CSSProperties = {
  position: "absolute", inset: 0, zIndex: 0,
  backgroundSize: "cover", backgroundPosition: "center",
  opacity: 0.22, mixBlendMode: "luminosity",
  filter: "contrast(1.1) saturate(0.6)",
  maskImage: "linear-gradient(180deg, black 0%, black 60%, transparent 100%)",
  WebkitMaskImage: "linear-gradient(180deg, black 0%, black 60%, transparent 100%)",
};

const heroGridStyle: React.CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
  gap: 80, alignItems: "center",
};

const ledeStyle: React.CSSProperties = {
  fontSize: 20, lineHeight: 1.6, color: "rgba(255,255,255,0.75)", fontWeight: 300,
  maxWidth: 560, marginBottom: 40,
};

const heroTrustStyle: React.CSSProperties = {
  marginTop: 48, display: "flex", gap: 40, flexWrap: "wrap",
  paddingTop: 28, borderTop: `1px solid rgba(255,255,255,0.08)`,
};

const trustLabelStyle: React.CSSProperties = {
  fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.2em",
  textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontWeight: 500,
};

const heroCardStyle: React.CSSProperties = {
  position: "relative", padding: 32,
  background: `linear-gradient(180deg, rgba(27,48,34,0.35), rgba(10,20,16,0.6))`,
  border: `1px solid rgba(255,255,255,0.1)`,
  backdropFilter: "blur(10px)",
};

const cardTagStyle: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 8,
  background: ACT_ORANGE, color: ACT_CREAM, padding: "6px 12px",
  fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.22em",
  textTransform: "uppercase", fontWeight: 600,
};

const cardMetaStyle: React.CSSProperties = {
  marginTop: 20, paddingTop: 20, borderTop: `1px dashed rgba(255,255,255,0.12)`,
  display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px",
};

const metaLabelStyle: React.CSSProperties = {
  fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.2em",
  textTransform: "uppercase", color: "rgba(255,255,255,0.5)", fontWeight: 500,
};

const metaValueStyle: React.CSSProperties = {
  fontFamily: FONT_DISPLAY, fontSize: 20, marginTop: 4, color: ACT_CREAM, fontWeight: 500,
};

const cardPriceRowStyle: React.CSSProperties = {
  marginTop: 22, paddingTop: 22, borderTop: `1px solid rgba(255,255,255,0.08)`,
  display: "flex", justifyContent: "space-between", alignItems: "end",
};

const monoStyle: React.CSSProperties = {
  fontFamily: FONT_LABEL, fontSize: 11, letterSpacing: "0.22em",
  textTransform: "uppercase", fontWeight: 500, color: "rgba(255,255,255,0.5)",
};

const seatsRowStyle: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  marginTop: 18, fontFamily: FONT_LABEL, fontSize: 11,
  letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)",
};

const seatBarStyle: React.CSSProperties = {
  flex: 1, height: 4, background: "rgba(255,255,255,0.08)",
  margin: "0 14px", position: "relative", overflow: "hidden",
};

const marqueeStyle: React.CSSProperties = {
  padding: "28px 0", overflow: "hidden",
  background: ACT_DARK_DEEP, borderBottom: `1px solid ${LINE_SOFT}`,
};

const secStyle: React.CSSProperties = {
  padding: "120px 0", position: "relative",
  borderBottom: `1px solid ${LINE_SOFT}`,
};

const secHeadStyle: React.CSSProperties = {
  maxWidth: 860, marginBottom: 72,
};

const h2Style: React.CSSProperties = {
  fontFamily: FONT_DISPLAY, fontSize: "clamp(40px, 4.8vw, 72px)",
  lineHeight: 1, marginTop: 24, color: TXT, fontWeight: 500,
  letterSpacing: "-0.025em", textWrap: "balance",
};

const secPStyle: React.CSSProperties = {
  marginTop: 24, fontSize: 18, lineHeight: 1.6,
  color: "rgba(255,255,255,0.7)", fontWeight: 300, maxWidth: 660,
};

const emStyle: React.CSSProperties = {
  color: ACT_ORANGE, fontStyle: "italic", fontWeight: 500,
};

const painCardStyle: React.CSSProperties = {
  padding: 32, background: "rgba(255,255,255,0.02)",
  border: `1px solid rgba(255,255,255,0.08)`, position: "relative",
  transition: "transform 0.3s, border-color 0.3s",
};

const valueItemStyle: React.CSSProperties = {
  padding: "28px 0", borderTop: `1px solid rgba(255,255,255,0.1)`,
  display: "grid", gridTemplateColumns: "40px 1fr", gap: 24,
};

const valueNumStyle: React.CSSProperties = {
  fontFamily: FONT_LABEL, fontSize: 12, letterSpacing: "0.2em",
  color: "rgba(255,255,255,0.4)", fontWeight: 600,
};

const valueVisualStyle: React.CSSProperties = {
  position: "sticky", top: 140,
  background: `radial-gradient(ellipse at center, rgba(211,84,0,0.25), transparent 70%), ${ACT_GREEN}`,
  border: `1px solid rgba(255,255,255,0.08)`,
  aspectRatio: "1 / 1", padding: 48,
  display: "flex", flexDirection: "column", justifyContent: "space-between",
  overflow: "hidden",
};

const toolPillStyle: React.CSSProperties = {
  padding: "16px 26px", border: `1px solid rgba(255,255,255,0.12)`, background: "rgba(255,255,255,0.03)",
  display: "inline-flex", alignItems: "center", gap: 12,
  fontFamily: FONT_DISPLAY, fontSize: 22, letterSpacing: "-0.01em",
  whiteSpace: "nowrap", borderRadius: 999, color: TXT,
};

const audienceCardStyle: React.CSSProperties = {
  width: 280, height: 220, padding: 24, flexShrink: 0,
  border: `1px solid rgba(255,255,255,0.1)`, background: "rgba(255,255,255,0.02)",
  display: "flex", flexDirection: "column", justifyContent: "space-between",
  position: "relative", overflow: "hidden",
};

const audienceIconStyle: React.CSSProperties = {
  width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center",
  border: `1px solid rgba(255,255,255,0.15)`, fontFamily: FONT_DISPLAY,
  fontStyle: "italic", fontSize: 22, color: ACT_ORANGE,
};

const testCardStyle: React.CSSProperties = {
  padding: 32, background: "rgba(255,255,255,0.02)", border: `1px solid rgba(255,255,255,0.08)`,
  position: "relative", display: "flex", flexDirection: "column",
  transition: "transform 0.3s",
};

const priceCardStyle: React.CSSProperties = {
  padding: "40px 32px", border: `1px solid rgba(255,255,255,0.1)`,
  background: "rgba(255,255,255,0.02)", position: "relative",
  display: "flex", flexDirection: "column",
  transition: "transform 0.3s, border-color 0.3s",
};

const priceFeaturedStyle: React.CSSProperties = {
  background: `linear-gradient(180deg, rgba(211,84,0,0.08), rgba(10,20,16,0.4))`,
  borderColor: ACT_ORANGE,
  boxShadow: "0 40px 80px -20px rgba(211,84,0,0.35)",
};

const priceBadgeStyle: React.CSSProperties = {
  position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
  background: ACT_ORANGE, color: ACT_CREAM, padding: "8px 18px",
  fontFamily: FONT_LABEL, fontSize: 10, fontWeight: 700,
  letterSpacing: "0.24em", textTransform: "uppercase",
};

const finalStyle: React.CSSProperties = {
  padding: "140px 0",
  background: `radial-gradient(ellipse at center, rgba(211,84,0,0.28), transparent 65%), ${ACT_DARK}`,
  textAlign: "center", position: "relative", overflow: "hidden",
};

const stickyBarStyle: React.CSSProperties = {
  position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 90,
  background: `linear-gradient(180deg, rgba(10,20,16,0.92), rgba(10,20,16,0.98))`,
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderTop: `1px solid rgba(211,84,0,0.4)`,
  boxShadow: "0 -10px 40px -10px rgba(0,0,0,0.5)",
};

const stickyBarInnerStyle: React.CSSProperties = {
  maxWidth: 1280, margin: "0 auto", padding: "12px 24px",
  display: "flex", alignItems: "center", gap: 16,
};

const expertCardStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 14,
  padding: "14px 16px",
  background: "rgba(255,255,255,0.04)",
  border: `1px solid rgba(255,255,255,0.08)`,
  backdropFilter: "blur(4px)",
};

const uspBannerStyle: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 10,
  marginBottom: 24,
  padding: "10px 18px",
  background: "linear-gradient(135deg, rgba(243,156,18,0.18), rgba(211,84,0,0.18))",
  border: "1px solid rgba(243,156,18,0.4)",
  fontFamily: "'Poppins', system-ui, sans-serif",
  fontSize: 12, fontWeight: 600,
  letterSpacing: "0.08em", textTransform: "uppercase",
  color: "#F39C12",
  borderRadius: 2,
};

const painQABlockStyle: React.CSSProperties = {
  position: "relative",
  marginBottom: 64,
  paddingLeft: 32,
  borderLeft: `3px solid ${ACT_ORANGE}`,
  maxWidth: 920,
};

const painQuestionStyle: React.CSSProperties = {
  fontFamily: FONT_DISPLAY,
  fontSize: "clamp(28px, 3.4vw, 44px)",
  fontStyle: "italic",
  fontWeight: 500,
  lineHeight: 1.15,
  letterSpacing: "-0.02em",
  color: ACT_ORANGE,
  marginBottom: 18,
};

const painAnswerStyle: React.CSSProperties = {
  fontFamily: FONT_DISPLAY,
  fontSize: "clamp(22px, 2.4vw, 32px)",
  fontWeight: 500,
  lineHeight: 1.3,
  letterSpacing: "-0.01em",
  color: TXT,
  display: "flex",
  alignItems: "baseline",
};

const painSubheadStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 24,
  fontFamily: "'Poppins', system-ui, sans-serif",
  fontSize: 11,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.55)",
  fontWeight: 600,
};
