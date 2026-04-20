"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    Clock, Users, BookOpen, Sparkles, ChevronRight, ArrowRight,
    Tag, Loader2, TrendingUp, Zap, Target, Shield, CheckCircle2,
    Monitor, BarChart2, MessageCircle, GraduationCap,
} from "lucide-react";
import FooterStrip from "@/components/layout/FooterStrip";

/* ─────────────────────────────────────────────────────────────────
   CONSTANTS & DATA
───────────────────────────────────────────────────────────────── */
const COLOR = "#D35400";

const STATS = [
    { value: "12+",     label: "Formations",  sub: "disponibles"          },
    { value: "7h",      label: "Par journée", sub: "de pratique"          },
    { value: "400 dhs", label: "À partir de", sub: "par formation"        },
    { value: "100%",    label: "Pratique",    sub: "cas réels entreprise" },
];

const EXPERIENCE_BLOCKS = [
    {
        icon: Monitor,
        emoji: "👨‍💻",
        title: "Apprenants en situation réelle",
        desc: "Dès le premier jour, vous travaillez sur poste avec de vrais outils professionnels. Pas de simulation, pas de cas fictifs — vous produisez directement.",
        highlight: "Environnement 100% pro",
        barLabel: "Temps sur poste",
        barValue: 100,
    },
    {
        icon: BarChart2,
        emoji: "📊",
        title: "80% pratique / 20% théorie",
        desc: "Notre ratio inversé garantit une montée en compétence rapide. Chaque concept est immédiatement appliqué via des exercices tirés de vrais projets africains.",
        highlight: "Montée en compétence ×3",
        barLabel: "Pratique",
        barValue: 80,
    },
    {
        icon: MessageCircle,
        emoji: "🧑‍🏫",
        title: "Interaction directe formateur",
        desc: "Vos questions reçoivent une réponse immédiate. Le formateur corrige en temps réel, intervient sur votre écran et adapte le rythme à votre groupe.",
        highlight: "Max 12 apprenants / session",
        barLabel: null,
        barValue: null,
    },
    {
        icon: GraduationCap,
        emoji: "🎓",
        title: "Certificat numérique ACT",
        desc: "En fin de formation, vous obtenez un certificat numérique valué par les directions RH et les recruteurs. Un actif concret à ajouter à votre profil.",
        highlight: "Reconnu par les RH",
        barLabel: null,
        barValue: null,
    },
];

const PILLARS = [
    { icon: Zap,        title: "80 % Pratique",         desc: "Chaque concept est immédiatement appliqué. Zéro slide sans exercice." },
    { icon: Target,     title: "Cas réels africains",    desc: "Nos exercices s'inspirent de vrais projets d'entreprises du continent." },
    { icon: Users,      title: "Petits groupes",         desc: "Maximum 12 apprenants par session pour un suivi individualisé." },
    { icon: TrendingUp, title: "Formateurs praticiens",  desc: "Chaque formateur exerce son métier activement — pas de théoriciens." },
    { icon: Shield,     title: "Certification reconnue", desc: "Certificat ACT valué par les recruteurs et les directions RH." },
    { icon: Sparkles,   title: "Suivi post-formation",   desc: "3 mois de support WhatsApp inclus après chaque programme." },
];

const GUARANTEES = [
    { emoji: "✅", label: "Satisfait ou remboursé", detail: "Vous disposez de 7 jours après le début pour demander un remboursement intégral, sans justification." },
    { emoji: "👥", label: "Petits groupes ≤ 12",    detail: "On refuse des inscrits plutôt que de gonfler les groupes. Qualité > volume." },
    { emoji: "🎓", label: "Formateur praticien",    detail: "Votre formateur travaille en entreprise aujourd'hui. Pas de formateurs-bibliothèque." },
    { emoji: "♾️", label: "Ressources à vie",       detail: "Slides, exercices et enregistrements restent accessibles sans limite de durée." },
];

/* ─────────────────────────────────────────────────────────────────
   HOOK
───────────────────────────────────────────────────────────────── */
function useMediaQuery() {
    const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">("desktop");
    useEffect(() => {
        const check = () => {
            const w = window.innerWidth;
            setScreenSize(w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop");
        };
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);
    return screenSize;
}

/* ─────────────────────────────────────────────────────────────────
   RIPPLE BUTTON
   - hover  → arrow rotates arrowDeg degrees
   - click  → ripple circle expands from cursor position
───────────────────────────────────────────────────────────────── */
interface RippleButtonProps {
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
    arrowDeg?: number;
    variant?: "solid" | "outline";
    size?: "sm" | "md" | "lg";
    style?: React.CSSProperties;
    type?: "button" | "submit";
    disabled?: boolean;
}

function RippleButton({
    children, href, onClick, arrowDeg = 45,
    variant = "solid", size = "md", style, type = "button", disabled = false,
}: RippleButtonProps) {
    const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
    const [hovered, setHovered] = useState(false);
    const ref = useRef<HTMLButtonElement>(null);

    const addRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return;
        const btn = ref.current!;
        const rect = btn.getBoundingClientRect();
        const id = Date.now();
        setRipples(r => [...r, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
        setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700);
        onClick?.();
    };

    const padMap = { sm: "0.65rem 1.4rem", md: "0.9rem 2.2rem", lg: "1.1rem 2.8rem" };
    const fsMap  = { sm: "0.8rem",         md: "0.9rem",         lg: "1rem"          };

    const base: React.CSSProperties = {
        position: "relative", overflow: "hidden",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex", alignItems: "center", gap: "0.6rem",
        padding: padMap[size], fontSize: fsMap[size],
        fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase",
        borderRadius: "0.5rem", border: "none", outline: "none",
        transition: "transform 0.25s, box-shadow 0.25s, background 0.25s, color 0.25s",
        transform: hovered && !disabled ? "translateY(-2px)" : "translateY(0)",
        opacity: disabled ? 0.55 : 1,
        fontFamily: "var(--font-display)",
        ...(variant === "solid"
            ? {
                background: hovered ? "#e05c10" : COLOR,
                color: "#fff",
                boxShadow: hovered ? `0 14px 44px ${COLOR}55` : "none",
              }
            : {
                background: "transparent",
                color: hovered ? "#fff" : COLOR,
                border: `1px solid ${hovered ? COLOR : COLOR + "55"}`,
                boxShadow: hovered ? `0 8px 28px ${COLOR}22` : "none",
              }),
        ...style,
    };

    const btn = (
        <button ref={ref} type={type} disabled={disabled} style={base}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={addRipple}
        >
            {children}
            <span style={{ display: "inline-block", lineHeight: 0, transition: "transform 0.3s ease", transform: hovered ? `rotate(${arrowDeg}deg)` : "rotate(0deg)" }}>
                <ArrowRight size={size === "lg" ? 20 : 16} />
            </span>
            {ripples.map(r => (
                <span key={r.id} style={{
                    position: "absolute", borderRadius: "50%",
                    background: "rgba(255,255,255,0.25)",
                    width: 10, height: 10,
                    left: r.x - 5, top: r.y - 5,
                    pointerEvents: "none",
                    animation: "actRipple 0.7s ease-out forwards",
                }} />
            ))}
        </button>
    );

    if (href) return <Link href={href} style={{ textDecoration: "none" }}>{btn}</Link>;
    return btn;
}

/* ─────────────────────────────────────────────────────────────────
   GRAIN
───────────────────────────────────────────────────────────────── */
function Grain() {
    return (
        <div aria-hidden style={{
            position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.028,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat", backgroundSize: "180px",
        }} />
    );
}

/* ─────────────────────────────────────────────────────────────────
   HERO VIDEO
───────────────────────────────────────────────────────────────── */
function MarketingVideo() {
    return (
        <motion.section
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}
            style={{ width: "100%", height: "100vh", minHeight: 600, position: "relative", zIndex: 2, overflow: "hidden", background: "#000" }}
        >
            <video autoPlay muted loop playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
            >
                <source src="/Video/Promo.mp4" type="video/mp4" />
            </video>

            {/* Overlay */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(7,14,28,0.62) 0%, rgba(7,14,28,0.12) 35%, rgba(7,14,28,0.48) 72%, rgba(7,14,28,1) 100%)", pointerEvents: "none" }} />

            {/* Content */}
            <div style={{
                position: "absolute", inset: 0, zIndex: 3,
                display: "flex", flexDirection: "column", justifyContent: "center",
                padding: "clamp(1.5rem, 8vw, 8rem)",
                paddingTop: "clamp(6rem, 14vh, 12rem)",
                paddingBottom: "clamp(4rem, 10vh, 8rem)",
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
                    style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.2rem" }}
                >
                    <div style={{ width: 48, height: 3, background: COLOR }} />
                    <span style={{ fontSize: "clamp(0.85rem, 1.3vw, 1.1rem)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.38em", color: COLOR }}>
                        Africa Centred Technology · Pôle Formation
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1, ease: [0.6, 0.08, 0.02, 0.99] }}
                    style={{ fontSize: "clamp(4rem, 11vw, 10rem)", fontWeight: 900, textTransform: "uppercase", fontFamily: "var(--font-display)", lineHeight: 0.88, letterSpacing: "-0.03em", margin: "0 0 2.5rem", maxWidth: 1200 }}
                >
                    <span style={{ color: "#fff" }}>Maîtrisez les outils</span><br />
                    <span style={{ color: COLOR }}>qui font la différence</span><br />
                    <span style={{ color: "rgba(255,255,255,0.7)" }}>dès demain matin.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.7 }}
                    style={{ fontSize: "clamp(1.25rem, 2vw, 1.65rem)", color: "rgba(255,255,255,0.78)", lineHeight: 1.7, maxWidth: 750, margin: "0 0 3.5rem", fontFamily: "var(--font-body)" }}
                >
                    Formations intensives conçues par des praticiens africains sur des cas réels.
                    En 1 à 3 jours, vous repartez avec des compétences applicables le lendemain.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.6 }}
                    style={{ display: "flex", gap: "1.2rem", flexWrap: "wrap" }}
                >
                    <RippleButton href="#catalogue" arrowDeg={45} size="lg">Voir le catalogue</RippleButton>
                    <RippleButton href="#inscription" arrowDeg={45} variant="outline" size="lg">S&apos;inscrire maintenant</RippleButton>
                </motion.div>
            </div>

            {/* Scroll hint */}
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
                style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", zIndex: 4, color: "rgba(255,255,255,0.3)" }}
            >
                <ChevronRight size={32} style={{ transform: "rotate(90deg)" }} />
            </motion.div>
        </motion.section>
    );
}

/* ─────────────────────────────────────────────────────────────────
   EXPÉRIENCE ACT — 4 storytelling blocks
───────────────────────────────────────────────────────────────── */
function ExperienceBlock({ block, index, screenSize }: { block: typeof EXPERIENCE_BLOCKS[number]; index: number; screenSize: string }) {
    const [hovered, setHovered] = useState(false);
    const Icon = block.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
            style={{
                padding: screenSize === "mobile" ? "2rem 1.5rem" : "2.5rem",
                background: hovered ? `rgba(211,84,0,0.06)` : "rgba(255,255,255,0.02)",
                border: hovered ? `1px solid ${COLOR}44` : "1px solid rgba(255,255,255,0.07)",
                borderRadius: "1rem", cursor: "default",
                transition: "all 0.35s ease",
                transform: hovered ? "translateY(-6px)" : "translateY(0)",
                boxShadow: hovered ? `0 24px 64px rgba(211,84,0,0.12)` : "none",
            }}
        >
            {/* Icon row */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.6rem" }}>
                <div style={{
                    width: 56, height: 56, borderRadius: "0.75rem",
                    background: hovered ? `${COLOR}22` : `${COLOR}12`,
                    border: `1px solid ${hovered ? COLOR + "55" : COLOR + "22"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.35s ease",
                    transform: hovered ? "scale(1.08) rotate(-4deg)" : "scale(1) rotate(0deg)",
                }}>
                    <Icon size={28} color={COLOR} />
                </div>
                <span style={{ fontSize: "2rem", lineHeight: 1 }}>{block.emoji}</span>
            </div>

            <h3 style={{ fontSize: screenSize === "mobile" ? "1.5rem" : "1.8rem", fontWeight: 900, color: "#fff", fontFamily: "var(--font-display)", marginBottom: "0.85rem", lineHeight: 1.2 }}>
                {block.title}
            </h3>

            <p style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontFamily: "var(--font-body)", marginBottom: block.barValue !== null ? "1.5rem" : "1.2rem" }}>
                {block.desc}
            </p>

            {/* Animated progress bar */}
            {block.barValue !== null && block.barLabel !== null && (
                <div style={{ marginBottom: "1.2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.12em" }}>{block.barLabel}</span>
                        <span style={{ fontSize: "1.05rem", fontWeight: 800, color: COLOR }}>{block.barValue}%</span>
                    </div>
                    <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 9999, overflow: "hidden" }}>
                        <motion.div
                            initial={{ width: 0 }} whileInView={{ width: `${block.barValue}%` }}
                            viewport={{ once: true }} transition={{ duration: 1.3, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            style={{ height: "100%", background: `linear-gradient(to right, ${COLOR}, #e8601a)`, borderRadius: 9999 }}
                        />
                    </div>
                </div>
            )}

            {/* Badge */}
            <div style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                padding: "0.35rem 0.9rem", borderRadius: "2rem",
                background: hovered ? `${COLOR}18` : "rgba(255,255,255,0.04)",
                border: `1px solid ${hovered ? COLOR + "44" : "rgba(255,255,255,0.08)"}`,
                fontSize: "1rem", fontWeight: 700,
                color: hovered ? COLOR : "rgba(255,255,255,0.5)",
                transition: "all 0.3s ease", fontFamily: "var(--font-body)",
            }}>
                <CheckCircle2 size={14} color={hovered ? COLOR : "rgba(255,255,255,0.3)"} />
                {block.highlight}
            </div>
        </motion.div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   FORMATION CARD — arrow slides right on hover
───────────────────────────────────────────────────────────────── */
interface FormationCardData {
    id: string; slug: string; title: string; secteur: string;
    categorie: string; niveau: string; duree: string; format: string;
    parcours?: string; prix: string; accroche: string; imageUrl?: string;
}

function ProgramCard({ program, index, screenSize }: { program: FormationCardData; index: number; screenSize: string }) {
    const [hovered, setHovered] = useState(false);

    return (
        <Link href={`/formations/${program.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
            <motion.div
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
                style={{
                    height: "100%", display: "flex", flexDirection: "column",
                    background: "rgba(255,255,255,0.02)",
                    border: hovered ? `1px solid ${COLOR}` : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "1rem", overflow: "hidden",
                    transition: "all 0.35s ease",
                    transform: hovered ? "translateY(-8px)" : "translateY(0)",
                    boxShadow: hovered ? `0 24px 64px ${COLOR}2A` : "none",
                    cursor: "pointer",
                }}
            >
                {/* Image */}
                <div style={{ position: "relative", height: screenSize === "mobile" ? 180 : 220, overflow: "hidden", background: "rgba(0,0,0,0.3)" }}>
                    {program.imageUrl && (
                        <img src={program.imageUrl} alt={program.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease, filter 0.4s ease", transform: hovered ? "scale(1.08)" : "scale(1)", filter: hovered ? "brightness(0.75)" : "brightness(0.55) grayscale(30%)" }}
                        />
                    )}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(7,14,28,0.95) 100%)" }} />
                    {program.niveau && (
                        <div style={{ position: "absolute", bottom: "1rem", left: "1.5rem", padding: "0.3rem 0.85rem", borderRadius: "2rem", background: COLOR, fontSize: "0.88rem", fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            {program.niveau}
                        </div>
                    )}
                </div>

                {/* Body */}
                <div style={{ padding: screenSize === "mobile" ? "1.5rem" : "2rem", flex: 1, display: "flex", flexDirection: "column" }}>
                    {program.secteur && (
                        <span style={{ fontSize: "0.88rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: COLOR, marginBottom: "0.6rem", display: "block" }}>{program.secteur}</span>
                    )}
                    <h3 style={{ fontSize: screenSize === "mobile" ? "1.5rem" : "1.75rem", fontWeight: 900, color: "#fff", fontFamily: "var(--font-display)", lineHeight: 1.2, marginBottom: "0.9rem", textTransform: "uppercase" }}>
                        {program.title}
                    </h3>
                    <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontFamily: "var(--font-body)", flex: 1, marginBottom: "1.4rem" }}>
                        {program.accroche}
                    </p>

                    {/* Meta */}
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                        {program.duree  && <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "1rem", color: "rgba(255,255,255,0.5)" }}><Clock    size={14} color={COLOR} />{program.duree}</span>}
                        {program.format && <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "1rem", color: "rgba(255,255,255,0.5)" }}><BookOpen size={14} color={COLOR} />{program.format}</span>}
                        {program.prix   && <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "1rem", fontWeight: 700, color: COLOR }}><Tag      size={14} color={COLOR} />{program.prix}</span>}
                    </div>

                    {/* CTA — arrow slides right */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: hovered ? "#fff" : COLOR, fontWeight: 700, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.1em", transition: "color 0.3s" }}>
                        En savoir plus
                        <span style={{ display: "inline-flex", transition: "transform 0.3s ease", transform: hovered ? "translateX(6px)" : "translateX(0)" }}>
                            <ArrowRight size={17} />
                        </span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

/* ─────────────────────────────────────────────────────────────────
   GUARANTEE CARD — extracted to avoid hooks-in-loop
───────────────────────────────────────────────────────────────── */
function GuaranteeCard({ g, i }: { g: typeof GUARANTEES[number]; i: number }) {
    const [hov, setHov] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{
                padding: "2rem 1.8rem",
                background: hov ? (i === 0 ? `${COLOR}12` : "rgba(255,255,255,0.04)") : (i === 0 ? `${COLOR}08` : "rgba(255,255,255,0.02)"),
                border: `1px solid ${hov ? (i === 0 ? COLOR + "55" : "rgba(255,255,255,0.12)") : (i === 0 ? COLOR + "2A" : "rgba(255,255,255,0.07)")}`,
                borderRadius: "0.85rem",
                transition: "all 0.3s ease",
                transform: hov ? "translateY(-5px)" : "translateY(0)",
                boxShadow: hov ? "0 16px 48px rgba(0,0,0,0.18)" : "none",
            }}
        >
            <div style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>{g.emoji}</div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: i === 0 ? COLOR : "#fff", marginBottom: "0.75rem", fontFamily: "var(--font-display)" }}>{g.label}</h3>
            <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.58)", lineHeight: 1.75, fontFamily: "var(--font-body)", margin: 0 }}>{g.detail}</p>
        </motion.div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   INSCRIPTION FORM
───────────────────────────────────────────────────────────────── */
function InscriptionForm({ screenSize, formations }: { screenSize: string; formations: FormationCardData[] }) {
    const [form, setForm] = useState({ nom: "", email: "", telephone: "", formation: "", message: "" });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [submitError, setSubmitError] = useState(false);

    const iStyle: React.CSSProperties = {
        width: "100%", padding: "1rem 1.3rem",
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: "0.5rem", color: "#fff", fontFamily: "var(--font-body)", fontSize: "1.05rem",
        outline: "none", transition: "border-color 0.2s", boxSizing: "border-box",
    };
    const labelStyle: React.CSSProperties = {
        display: "block", fontSize: "0.85rem", fontWeight: 700,
        letterSpacing: "0.22em", textTransform: "uppercase",
        color: "rgba(255,255,255,0.45)", marginBottom: "0.55rem",
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setSubmitError(false);
        try {
            const res = await fetch("/api/shopify/inscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prenom: form.nom.split(" ")[0] ?? form.nom,
                    nom: form.nom.split(" ").slice(1).join(" ") || form.nom,
                    email: form.email, telephone: form.telephone,
                    formationSouhaitee: form.formation,
                    formationSlug: formations.find(f => f.title === form.formation)?.slug ?? "",
                    message: form.message, typeClient: "B2C",
                    ville: "", formatsPreferes: [], disponibilite: "",
                }),
            });
            if (res.ok) {
                setSent(true);
            } else {
                setSubmitError(true);
            }
        } catch {
            setSubmitError(true);
        } finally {
            setSending(false);
        }
    };

    if (sent) return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: "center", padding: "3.5rem 2rem", background: "rgba(22,163,74,0.07)", border: "1px solid rgba(22,163,74,0.25)", borderRadius: "1rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1.2rem" }}>🎉</div>
            <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff", marginBottom: "0.75rem", fontFamily: "var(--font-display)" }}>Demande envoyée !</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body)", lineHeight: 1.8, fontSize: "1.1rem" }}>
                Notre équipe vous contactera sous <strong style={{ color: "#fff" }}>24h ouvrées</strong> pour confirmer votre inscription et vous communiquer les modalités.
            </p>
        </motion.div>
    );

    return (
        <motion.form initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            onSubmit={handleSubmit}
            style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${COLOR}22`, borderRadius: "1rem", padding: screenSize === "mobile" ? "2rem 1.5rem" : "3rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${COLOR}, ${COLOR}55)` }} />

            <div style={{ display: "grid", gridTemplateColumns: screenSize === "mobile" ? "1fr" : "1fr 1fr", gap: "1.4rem", marginBottom: "1.4rem" }}>
                <div>
                    <label style={labelStyle}>Nom complet *</label>
                    <input required type="text" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })}
                        placeholder="Votre nom complet" style={iStyle}
                        onFocus={e => (e.target.style.borderColor = COLOR)} onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.09)")} />
                </div>
                <div>
                    <label style={labelStyle}>Email *</label>
                    <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="votre@email.com" style={iStyle}
                        onFocus={e => (e.target.style.borderColor = COLOR)} onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.09)")} />
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: screenSize === "mobile" ? "1fr" : "1fr 1fr", gap: "1.4rem", marginBottom: "1.4rem" }}>
                <div>
                    <label style={labelStyle}>Téléphone</label>
                    <input type="tel" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })}
                        placeholder="+212 6XX XXX XXX" style={iStyle}
                        onFocus={e => (e.target.style.borderColor = COLOR)} onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.09)")} />
                </div>
                <div>
                    <label style={labelStyle}>Formation souhaitée *</label>
                    <select required value={form.formation} onChange={e => setForm({ ...form, formation: e.target.value })}
                        style={{ ...iStyle, cursor: "pointer" }}
                        onFocus={e => (e.target.style.borderColor = COLOR)} onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}>
                        <option value="" style={{ background: "#070e1c" }}>Choisissez une formation</option>
                        {formations.map(f => <option key={f.slug} value={f.title} style={{ background: "#070e1c" }}>{f.title}</option>)}
                        <option value="Je ne sais pas encore" style={{ background: "#070e1c" }}>Je ne sais pas encore</option>
                    </select>
                </div>
            </div>

            <div style={{ marginBottom: "2rem" }}>
                <label style={labelStyle}>Message (facultatif)</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    rows={3} placeholder="Votre niveau actuel, vos objectifs, vos contraintes horaires..."
                    style={{ ...iStyle, resize: "vertical", lineHeight: 1.65 }}
                    onFocus={e => (e.target.style.borderColor = COLOR)} onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.09)")} />
            </div>

            {submitError && (
                <p style={{ color: "#ef4444", fontSize: "1rem", fontFamily: "var(--font-body)", marginBottom: "1rem", textAlign: "center" }}>
                    Une erreur est survenue. Veuillez réessayer.
                </p>
            )}
            <RippleButton type="submit" arrowDeg={90} size="lg" disabled={sending} style={{ width: "100%", justifyContent: "center" }}>
                {sending ? "Envoi en cours…" : "Réserver ma place"}
            </RippleButton>

            <p style={{ textAlign: "center", fontSize: "1rem", color: "rgba(255,255,255,0.3)", marginTop: "1.2rem", fontFamily: "var(--font-body)" }}>
                ✓ Réponse sous 24h · ✓ Sans engagement · ✓ Satisfait ou remboursé 7 jours
            </p>
        </motion.form>
    );
}

/* ─────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────── */
export default function FormationLandpage() {
    const screenSize = useMediaQuery();
    const [formationsData, setFormationsData] = useState<FormationCardData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);
    const [activeFilter, setActiveFilter] = useState("Toutes");

    const loadFromShopify = async () => {
        setIsLoading(true); setFetchError(false);
        try {
            const res = await fetch("/api/shopify/formations");
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            setFormationsData(json.formations ?? []);
        } catch (err) {
            console.error("[FormationLandpage] Shopify fetch failed:", err);
            setFetchError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadFromShopify(); }, []);

    const categories = useMemo(() =>
        ["Toutes", ...Array.from(new Set(formationsData.map(f => f.categorie).filter(Boolean)))],
        [formationsData]
    );

    const filtered = useMemo(() =>
        activeFilter === "Toutes" ? formationsData : formationsData.filter(f => f.categorie === activeFilter),
        [formationsData, activeFilter]
    );

    const featured = useMemo(() => filtered[0] ?? null, [filtered]);
    const rest     = useMemo(() => filtered.slice(1), [filtered]);

    return (
        <div style={{ background: "#070E1C", minHeight: "100vh", overflowX: "hidden", position: "relative", color: "#fff" }}>
            {/* Ripple keyframe */}
            <style>{`
                @keyframes actRipple {
                    0%   { transform: scale(1);  opacity: 0.45; }
                    100% { transform: scale(50); opacity: 0; }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>

            <Grain />

            {/* Grid bg */}
            <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, backgroundImage: `linear-gradient(rgba(211,84,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(211,84,0,0.03) 1px,transparent 1px)`, backgroundSize: "80px 80px", pointerEvents: "none" }} />

            {/* Glow */}
            <div aria-hidden style={{ position: "fixed", top: "20%", left: "50%", width: "80vw", height: "60vw", zIndex: 0, background: "radial-gradient(ellipse,rgba(211,84,0,0.055) 0%,transparent 70%)", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1 }}>

                {/* ── HERO ─────────────────────────────────────────── */}
                <MarketingVideo />

                {/* ── STATS BAR ────────────────────────────────────── */}
                <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.025)", padding: screenSize === "mobile" ? "2.5rem 1.5rem" : "2.5rem 6rem" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: screenSize === "mobile" ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: "1px", background: "rgba(255,255,255,0.06)", borderRadius: "0.75rem", overflow: "hidden" }}>
                        {STATS.map((s, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                                style={{ padding: screenSize === "mobile" ? "2rem 1.2rem" : "2.5rem", background: "#070e1c", textAlign: "center" }}>
                                <div style={{ fontSize: screenSize === "mobile" ? "2.8rem" : "3.5rem", fontWeight: 900, color: COLOR, fontFamily: "var(--font-display)", lineHeight: 1 }}>{s.value}</div>
                                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginTop: "0.5rem", fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
                                <div style={{ fontSize: "1rem", color: "rgba(255,255,255,0.38)", marginTop: "0.25rem", fontFamily: "var(--font-body)" }}>{s.sub}</div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── L'EXPÉRIENCE ACT ─────────────────────────────── */}
                <section style={{ padding: screenSize === "mobile" ? "5rem 1.5rem" : "7rem 6rem", position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: "4rem", textAlign: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.8rem", marginBottom: "1.2rem" }}>
                                <div style={{ width: 40, height: 2, background: `linear-gradient(to right, transparent, ${COLOR})` }} />
                                <span style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "0.35em", textTransform: "uppercase", color: COLOR }}>Storytelling</span>
                                <div style={{ width: 40, height: 2, background: `linear-gradient(to left, transparent, ${COLOR})` }} />
                            </div>
                            <h2 style={{ fontSize: screenSize === "mobile" ? "clamp(2.2rem, 8vw, 3.2rem)" : "clamp(3rem, 5vw, 4.5rem)", fontWeight: 900, fontFamily: "var(--font-display)", textTransform: "uppercase", lineHeight: 1.05, margin: 0 }}>
                                L&apos;expérience <span style={{ color: COLOR }}>ACT</span>
                            </h2>
                            <p style={{ marginTop: "1.2rem", fontSize: "1.25rem", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)", maxWidth: 560, margin: "1.2rem auto 0", lineHeight: 1.75 }}>
                                On ne vous dit pas qu'on est bons — on vous montre comment ça se passe vraiment.
                            </p>
                        </motion.div>

                        <div style={{ display: "grid", gridTemplateColumns: screenSize === "mobile" ? "1fr" : "repeat(2,1fr)", gap: "1.5rem" }}>
                            {EXPERIENCE_BLOCKS.map((block, i) => (
                                <ExperienceBlock key={i} block={block} index={i} screenSize={screenSize} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── POURQUOI ACT (piliers) ────────────────────────── */}
                <section style={{ padding: screenSize === "mobile" ? "5rem 1.5rem" : "7rem 6rem", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)", position: "relative", zIndex: 1 }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: "3.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.2rem" }}>
                                <div style={{ width: 36, height: 2, background: COLOR }} />
                                <span style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "0.35em", textTransform: "uppercase", color: COLOR }}>Notre méthode</span>
                            </div>
                            <h2 style={{ fontSize: screenSize === "mobile" ? "clamp(2.2rem,8vw,3.2rem)" : "clamp(3rem,5vw,4.5rem)", fontWeight: 900, fontFamily: "var(--font-display)", textTransform: "uppercase", lineHeight: 1.05, color: "#fff", margin: 0 }}>
                                Pourquoi choisir <span style={{ color: COLOR }}>ACT Formation</span>
                            </h2>
                        </motion.div>

                        <div style={{ display: "grid", gridTemplateColumns: screenSize === "mobile" ? "1fr" : screenSize === "tablet" ? "repeat(2,1fr)" : "repeat(3,1fr)", gap: "1.2rem" }}>
                            {PILLARS.map((p, i) => {
                                const Icon = p.icon;
                                return (
                                    <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                                        style={{ padding: "2rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.85rem", transition: "border-color 0.25s, transform 0.25s" }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = `${COLOR}44`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
                                    >
                                        <div style={{ width: 48, height: 48, borderRadius: "0.5rem", background: `${COLOR}18`, border: `1px solid ${COLOR}33`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.2rem" }}>
                                            <Icon size={24} color={COLOR} />
                                        </div>
                                        <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#fff", marginBottom: "0.7rem", fontFamily: "var(--font-display)" }}>{p.title}</h3>
                                        <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, fontFamily: "var(--font-body)", margin: 0 }}>{p.desc}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ── CATALOGUE ────────────────────────────────────── */}
                <section id="catalogue" style={{ padding: screenSize === "mobile" ? "5rem 1.5rem" : "7rem 6rem", position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: "3rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.2rem" }}>
                                <div style={{ width: 36, height: 2, background: COLOR }} />
                                <span style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "0.35em", textTransform: "uppercase", color: COLOR }}>Catalogue</span>
                            </div>
                            <h2 style={{ fontSize: screenSize === "mobile" ? "clamp(2.2rem,8vw,3.2rem)" : "clamp(3rem,5vw,4.5rem)", fontWeight: 900, fontFamily: "var(--font-display)", textTransform: "uppercase", lineHeight: 1.05, marginBottom: "2rem" }}>
                                Nos <span style={{ color: COLOR }}>Formations</span>
                            </h2>

                            {/* Filter chips */}
                            {!isLoading && categories.length > 1 && (
                                <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
                                    {categories.map(cat => (
                                        <motion.button key={cat} whileTap={{ scale: 0.94 }} onClick={() => setActiveFilter(cat)}
                                            style={{
                                                padding: "0.5rem 1.3rem", borderRadius: "2rem", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer",
                                                fontFamily: "var(--font-body)", outline: "none", transition: "all 0.25s ease",
                                                ...(activeFilter === cat
                                                    ? { background: COLOR, color: "#fff", border: `1px solid ${COLOR}`, boxShadow: `0 4px 20px ${COLOR}44` }
                                                    : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.1)" }),
                                            }}
                                        >
                                            {cat}
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Featured */}
                        <AnimatePresence mode="wait">
                            {!isLoading && featured && (
                                <motion.div key={`feat-${activeFilter}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ marginBottom: "2.5rem" }}>
                                    <Link href={`/formations/${featured.slug}`} style={{ textDecoration: "none", display: "block" }}>
                                        <div style={{
                                            position: "relative", borderRadius: "1rem", overflow: "hidden",
                                            background: "rgba(255,255,255,0.02)", border: `1px solid ${COLOR}44`,
                                            display: "grid", gridTemplateColumns: screenSize === "mobile" ? "1fr" : "1fr 1fr",
                                            minHeight: 340, transition: "box-shadow 0.3s, transform 0.3s",
                                        }}
                                            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = `0 28px 72px ${COLOR}22`; el.style.transform = "translateY(-4px)"; }}
                                            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; }}
                                        >
                                            <div style={{ position: "absolute", top: "1.2rem", left: "1.2rem", zIndex: 2, padding: "0.3rem 1rem", background: COLOR, borderRadius: "2rem", fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#fff" }}>
                                                ★ Populaire
                                            </div>
                                            {featured.imageUrl && (
                                                <div style={{ position: "relative", overflow: "hidden", minHeight: screenSize === "mobile" ? 240 : "auto" }}>
                                                    <img src={featured.imageUrl} alt={featured.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.65)" }} />
                                                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 50%, rgba(7,14,28,0.97) 100%)" }} />
                                                </div>
                                            )}
                                            <div style={{ padding: screenSize === "mobile" ? "2rem 1.5rem" : "3rem", display: "flex", flexDirection: "column", justifyContent: "center", gap: "1rem" }}>
                                                <span style={{ fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: COLOR }}>{featured.secteur}</span>
                                                <h3 style={{ fontSize: screenSize === "mobile" ? "1.6rem" : "2.2rem", fontWeight: 900, color: "#fff", fontFamily: "var(--font-display)", lineHeight: 1.15, margin: 0 }}>{featured.title}</h3>
                                                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.15rem", lineHeight: 1.75, margin: 0, fontFamily: "var(--font-body)" }}>{featured.accroche}</p>
                                                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                                                    {featured.duree  && <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "1.05rem", color: "rgba(255,255,255,0.55)" }}><Clock    size={15} color={COLOR} />{featured.duree}</span>}
                                                    {featured.format && <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "1.05rem", color: "rgba(255,255,255,0.55)" }}><BookOpen size={15} color={COLOR} />{featured.format}</span>}
                                                    {featured.prix   && <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "1.05rem", fontWeight: 700, color: COLOR }}><Tag      size={15} color={COLOR} />{featured.prix}</span>}
                                                </div>
                                                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: COLOR, fontSize: "1.05rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                                                    Voir la formation <ArrowRight size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Grid */}
                        <AnimatePresence mode="wait">
                            <motion.div key={`grid-${activeFilter}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                                style={{ display: "grid", gridTemplateColumns: screenSize === "mobile" ? "1fr" : screenSize === "tablet" ? "repeat(2,1fr)" : "repeat(3,1fr)", gap: "1.5rem" }}>
                                {isLoading ? (
                                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem" }}>
                                        <Loader2 size={28} color={COLOR} style={{ animation: "spin 1s linear infinite" }} />
                                    </div>
                                ) : fetchError ? (
                                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem" }}>
                                        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "1.2rem", fontSize: "1rem", fontFamily: "var(--font-body)" }}>Impossible de charger les formations.</p>
                                        <RippleButton onClick={loadFromShopify} arrowDeg={0} variant="outline">Réessayer</RippleButton>
                                    </div>
                                ) : rest.length === 0 && !featured ? (
                                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem" }}>
                                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "1rem" }}>Aucune formation dans cette catégorie.</p>
                                    </div>
                                ) : (
                                    rest.map((program, i) => <ProgramCard key={program.slug} program={program} index={i} screenSize={screenSize} />)
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {formationsData.length > 0 && (
                            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ textAlign: "center", marginTop: "3rem" }}>
                                <RippleButton href="/formations/all" arrowDeg={45}>Voir le catalogue complet</RippleButton>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* ── GARANTIES ────────────────────────────────────── */}
                <section style={{ padding: screenSize === "mobile" ? "5rem 1.5rem" : "7rem 6rem", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)", position: "relative", zIndex: 1 }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: "3rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.2rem" }}>
                                <div style={{ width: 36, height: 2, background: COLOR }} />
                                <span style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "0.35em", textTransform: "uppercase", color: COLOR }}>Nos engagements</span>
                            </div>
                            <h2 style={{ fontSize: screenSize === "mobile" ? "clamp(2.2rem,8vw,3.2rem)" : "clamp(3rem,5vw,4.5rem)", fontWeight: 900, fontFamily: "var(--font-display)", textTransform: "uppercase", lineHeight: 1.05, margin: 0 }}>
                                Des garanties <span style={{ color: COLOR }}>concrètes</span>
                            </h2>
                        </motion.div>
                        <div style={{ display: "grid", gridTemplateColumns: screenSize === "mobile" ? "1fr" : screenSize === "tablet" ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: "1.2rem" }}>
                            {GUARANTEES.map((g, i) => <GuaranteeCard key={i} g={g} i={i} />)}
                        </div>
                    </div>
                </section>

                {/* ── FONDATEUR ────────────────────────────────────── */}
                <section style={{ padding: screenSize === "mobile" ? "5rem 1.5rem" : "7rem 6rem", position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                        <div style={{ display: "grid", gridTemplateColumns: screenSize === "mobile" ? "1fr" : "420px 1fr", gap: screenSize === "mobile" ? "3rem" : "5rem", alignItems: "center" }}>
                            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ position: "relative" }}>
                                <div style={{ borderRadius: "1rem", overflow: "hidden", border: `1px solid ${COLOR}33`, position: "relative", aspectRatio: "4/5", maxWidth: 420 }}>
                                    <img src="/Sohaib_baroud_Manifeste.png" alt="Sohaib Baroud — Fondateur ACT" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(7,14,28,0.7) 0%, transparent 55%)" }} />
                                    <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem" }}>
                                        <p style={{ margin: 0, fontWeight: 800, color: "#fff", fontSize: "1.2rem", fontFamily: "var(--font-display)" }}>Sohaib Baroud</p>
                                        <p style={{ margin: "0.2rem 0 0", color: COLOR, fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Fondateur & CEO · ACT</p>
                                    </div>
                                </div>
                                <div aria-hidden style={{ position: "absolute", top: "-1.5rem", left: "-1.5rem", width: 80, height: 80, border: `2px solid ${COLOR}22`, borderRadius: "0.5rem", zIndex: -1 }} />
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.5rem" }}>
                                    <div style={{ width: 36, height: 2, background: COLOR }} />
                                    <span style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "0.35em", textTransform: "uppercase", color: COLOR }}>Mot du fondateur</span>
                                </div>
                                <blockquote style={{ margin: "0 0 2rem", padding: 0, border: "none" }}>
                                    <p style={{ fontSize: screenSize === "mobile" ? "1.4rem" : "1.75rem", fontWeight: 700, color: "#fff", fontFamily: "var(--font-display)", lineHeight: 1.5, marginBottom: "1.5rem" }}>
                                        &ldquo;J&apos;ai créé ACT Formation parce que j&apos;en avais assez des formations théoriques qui n&apos;aident personne à avancer concrètement.&rdquo;
                                    </p>
                                    <p style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-body)", lineHeight: 1.85, marginBottom: "1.2rem" }}>
                                        Après des années à accompagner des entreprises africaines dans leur transformation digitale, j&apos;ai vu le même blocage : les compétences manquent, pas la motivation.
                                    </p>
                                    <p style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-body)", lineHeight: 1.85 }}>
                                        Nos formations sont conçues par des gens qui font, pour des gens qui veulent faire. Chaque programme est testé sur le terrain — si ça ne crée pas de valeur mesurable, je vous rembourse.
                                    </p>
                                </blockquote>
                                <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
                                    {["15+ ans terrain", "Formé en Europe & Afrique", "200+ entreprises accompagnées"].map((tag, i) => (
                                        <span key={i} style={{ padding: "0.4rem 1rem", background: `${COLOR}12`, border: `1px solid ${COLOR}2A`, borderRadius: "2rem", fontSize: "1rem", color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-body)" }}>{tag}</span>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

     

                {/* ── FINAL CTA ────────────────────────────────────── */}
                <section style={{ padding: screenSize === "mobile" ? "6rem 1.5rem" : "9rem 6rem", position: "relative", zIndex: 1, overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div aria-hidden style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, ${COLOR}0C 0%, transparent 68%)`, pointerEvents: "none" }} />

                    <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.8rem", marginBottom: "2rem" }}>
                                <div style={{ width: 60, height: 2, background: `linear-gradient(to right, transparent, ${COLOR})` }} />
                                <span style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "0.35em", textTransform: "uppercase", color: COLOR }}>Passez à l&apos;action</span>
                                <div style={{ width: 60, height: 2, background: `linear-gradient(to left, transparent, ${COLOR})` }} />
                            </div>

                            <h2 style={{ fontSize: screenSize === "mobile" ? "clamp(2.5rem,9vw,3.5rem)" : "clamp(3.5rem,6vw,5.5rem)", fontWeight: 900, fontFamily: "var(--font-display)", textTransform: "uppercase", lineHeight: 0.95, marginBottom: "1.5rem" }}>
                                Votre prochaine<br />
                                <span style={{ color: COLOR }}>compétence commence</span><br />
                                maintenant.
                            </h2>

                            <p style={{ fontSize: "1.3rem", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)", lineHeight: 1.8, maxWidth: 520, margin: "0 auto 3rem" }}>
                                Les places sont limitées à 12 par session. Ne ratez pas la prochaine ouverture.
                            </p>

                            {/* Final CTA — arrow rotates 90° on hover */}
                            <RippleButton href="#inscription" arrowDeg={90} size="lg">
                                Je m&apos;inscris maintenant
                            </RippleButton>
                        </motion.div>
                    </div>
                </section>

                <FooterStrip />
            </div>
        </div>
    );
}
