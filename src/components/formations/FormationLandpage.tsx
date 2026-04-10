"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    Clock,
    Users,
    BookOpen,
    Sparkles,
    ChevronRight,
    ArrowRight,
    Tag,
    Loader2,
    AlertCircle,
    RefreshCw,
    TrendingUp,
    Zap,
    Target,
    Shield,
    CheckCircle2,
    Send,
    } from "lucide-react";
    import FooterStrip from "@/components/layout/FooterStrip";
    import CTAButton from "@/components/ui/CTAButton";

const STATS = [
  { value: "12+",    label: "Formations",      sub: "disponibles"       },
  { value: "7h",     label: "Par journée",     sub: "de pratique"       },
  { value: "400 dhs",label: "À partir de",     sub: "par formation"     },
  { value: "100%",   label: "Pratique",        sub: "cas réels entreprise" },
];

const PILLARS = [
  {
    icon: Zap,
    title: "80 % Pratique",
    desc: "Chaque concept est immédiatement appliqué. Zéro slide sans exercice.",
  },
  {
    icon: Target,
    title: "Cas réels africains",
    desc: "Nos exercices s'inspirent de vrais projets d'entreprises du continent.",
  },
  {
    icon: Users,
    title: "Petits groupes",
    desc: "Maximum 12 apprenants par session pour un suivi individualisé.",
  },
  {
    icon: TrendingUp,
    title: "Formateurs praticiens",
    desc: "Chaque formateur exerce son métier activement — pas de théoriciens.",
  },
  {
    icon: Shield,
    title: "Certification reconnue",
    desc: "Certificat ACT valué par les recruteurs et les directions RH.",
  },
  {
    icon: Sparkles,
    title: "Suivi post-formation",
    desc: "3 mois de support WhatsApp inclus après chaque programme.",
  },
];

const GUARANTEES = [
  {
    label: "Satisfait ou remboursé",
    detail: "Vous disposez de 7 jours après le début pour demander un remboursement intégral, sans justification.",
  },
  {
    label: "Petits groupes ≤ 12",
    detail: "On refuse des inscrits plutôt que de gonfler les groupes. Qualité > volume.",
  },
  {
    label: "Formateur praticien",
    detail: "Votre formateur travaille en entreprise aujourd'hui. Pas de formateurs-bibliothèque.",
  },
  {
    label: "Ressources à vie",
    detail: "Slides, exercices et enregistrements restent accessibles sans limite de durée.",
  },
];

const pedagogy = [
  {
    step: "01",
    title: "Learning by Doing",
    desc: "80% de pratique, 20% de théorie. Chaque concept est appliqué immédiatement via des exercices."
  },
  {
    step: "02",
    title: "Projets Réels",
    desc: "Portfolio professionnel constitué de projets concrets inspirés de cas d'usage entreprise."
  },
  {
    step: "03",
    title: "Mentorat Personnalisé",
    desc: "Accompagnement individuel par des experts pour débloquer et progresser rapidement."
  },
  {
    step: "04",
    title: "Communauté Active",
    desc: "Intégration dans un réseau d'apprenants et de professionnels pour échanger et collaborer."
  },
];

    function useMediaQuery() {
      const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

      useEffect(() => {
          const checkScreenSize = () => {
              const width = window.innerWidth;
              if (width < 768) setScreenSize('mobile');
              else if (width >= 768 && width < 1024) setScreenSize('tablet');
              else setScreenSize('desktop');
          };
          checkScreenSize();
          window.addEventListener('resize', checkScreenSize);
          return () => window.removeEventListener('resize', checkScreenSize);
      }, []);

      return screenSize;
    }

    const COLOR = "#D35400";
/* ── Marketing Video Section ── */
function MarketingVideo() {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            style={{
                width: "100%",
                height: "100vh",
                minHeight: 600,
                position: "relative",
                zIndex: 2,
                overflow: "hidden",
                background: "#000"
            }}
        >
            <video
                autoPlay
                muted
                loop
                playsInline
                poster="/Video/Promo.mp4"
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 1 }}
            >
                <source src="/Video/Promo.mp4" type="video/mp4" />
            </video>

            {/* Overlay — assombrit le haut et le bas */}
            <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to bottom, rgba(7,14,28,0.55) 0%, rgba(7,14,28,0.1) 40%, rgba(7,14,28,0.5) 75%, rgba(7,14,28,1) 100%)",
                pointerEvents: "none"
            }} />

            {/* Contenu — centré verticalement, légèrement dans le tiers supérieur */}
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "clamp(1.5rem, 8vw, 8rem)",
                paddingTop: "clamp(6rem, 14vh, 12rem)",
                paddingBottom: "clamp(4rem, 10vh, 8rem)",
            }}>
                {/* Eyebrow */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.7 }}
                    style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.2rem" }}
                >
                    <div style={{ width: 48, height: 3, background: COLOR }} />
                    <span style={{ fontSize: "clamp(0.85rem, 1.3vw, 1.1rem)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.38em", color: COLOR }}>
                        Africa Centred Technology · Pôle Formation
                    </span>
                </motion.div>

                {/* Accroche */}
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1, ease: [0.6, 0.08, 0.02, 0.99] }}
                    style={{
                        fontSize: "clamp(4rem, 11vw, 10rem)",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        fontFamily: "var(--font-display)",
                        lineHeight: 0.88,
                        letterSpacing: "-0.03em",
                        margin: "0 0 2.5rem",
                        maxWidth: 1200,
                    }}
                >
                    <span style={{ color: "#fff" }}>Maîtrisez les outils</span><br />
                    <span style={{ color: COLOR }}>qui font la différence</span><br />
                    <span style={{ color: "rgba(255,255,255,0.7)" }}>dès demain matin.</span>
                </motion.h1>

                {/* Sous-titre */}
                <motion.p
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.7 }}
                    style={{
                        fontSize: "clamp(1.25rem, 2vw, 1.65rem)",
                        color: "rgba(255,255,255,0.78)",
                        lineHeight: 1.7,
                        maxWidth: 750,
                        margin: "0 0 3.5rem",
                        fontFamily: "var(--font-body)",
                    }}
                >
                    Formations intensives conçues par des praticiens africains sur des cas réels.
                    En 1 à 3 jours, vous repartez avec des compétences applicables le lendemain.
                </motion.p>

                {/* Double CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                    style={{ display: "flex", gap: "1.2rem", flexWrap: "wrap" }}
                >
                    <CTAButton href="#catalogue" iconPosition="right" icon={<ArrowRight size={20} />}>
                        Voir le catalogue
                    </CTAButton>
                    <CTAButton href="#inscription" iconPosition="right" icon={<Send size={20} />}>
                        S&apos;inscrire maintenant
                    </CTAButton>
                </motion.div>
            </div>

            {/* Scroll hint */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                    position: "absolute",
                    bottom: "2rem",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 4,
                    color: "rgba(255,255,255,0.3)"
                }}
            >
                <ChevronRight size={32} style={{ transform: "rotate(90deg)" }} />
            </motion.div>
        </motion.section>
    );
}

/* ── Grain (Identique à ContactShell) ── */
function Grain() {
    return (
        <div
            aria-hidden
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 0,
                pointerEvents: "none",
                opacity: 0.028,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundRepeat: "repeat",
                backgroundSize: "180px",
            }}
        />
    );
}

/** Helper : couleur selon le niveau */
function getNiveauColor(niveau: string = ""): string {
    if (niveau.includes("Initiation") || niveau.includes("Débutant")) return "#E67E22";
    if (niveau.includes("Intermédiaire")) return "#D35400";
    if (niveau.includes("Avancé")) return "#A04000";
    return "#D35400";
}

interface FormationCardData {
    id: string;
    slug: string;
    title: string;
    secteur: string;
    categorie: string;
    niveau: string;
    duree: string;
    format: string;
    parcours?: string;
    prix: string;
    accroche: string;
    imageUrl?: string;
}

    function ProgramCard({ program, index, screenSize, COLOR }: { program: FormationCardData, index: number, screenSize: string, COLOR: string }) {
        const [isHovered, setIsHovered] = useState(false);

        return (
            <Link href={`/formations/${program.slug}`} style={{ textDecoration: 'none' }}>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                        height: '100%',
                        background: 'rgba(255,255,255,0.02)',
                        border: isHovered ? `1px solid ${COLOR}` : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '1rem',
                        overflow: 'hidden',
                        transition: 'all 0.4s ease',
                        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                        boxShadow: isHovered ? `0 20px 60px ${COLOR}33` : 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {/* Image Header */}
                    <div style={{
                        position: 'relative',
                        height: screenSize === 'mobile' ? '180px' : '220px',
                        overflow: 'hidden',
                        background: 'rgba(0,0,0,0.3)',
                    }}>
                        {program.imageUrl && (
                            <img
                                src={program.imageUrl}
                                alt={program.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.6s ease, filter 0.4s ease',
                                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                    filter: isHovered ? 'grayscale(0%) brightness(0.8)' : 'grayscale(40%) brightness(0.6)',
                                }}
                            />
                        )}
                        {/* Gradient overlay */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: `linear-gradient(to bottom, transparent 0%, rgba(7,14,28,0.4) 50%, rgba(7,14,28,0.95) 100%)`,
                        }} />
                        {/* Niveau badge */}
                        {program.niveau && (
                            <div style={{
                                position: 'absolute',
                                bottom: '1rem',
                                left: '1.5rem',
                                padding: '0.3rem 0.8rem',
                                borderRadius: '2rem',
                                background: `${COLOR}`,
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: '#fff',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}>
                                {program.niveau}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div style={{
                        padding: screenSize === 'mobile' ? '1.5rem' : '2rem',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <h3 style={{
                            fontSize: screenSize === 'mobile' ? '1.3rem' : '1.6rem',
                            fontWeight: 900,
                            marginBottom: '1rem',
                            fontFamily: 'var(--font-display)',
                            color: '#fff',
                            textTransform: 'uppercase',
                            lineHeight: 1.2,
                        }}>
                            {program.title}
                        </h3>
                        <p style={{
                            fontSize: screenSize === 'mobile' ? '0.95rem' : '1rem',
                            lineHeight: 1.6,
                            color: 'rgba(255,255,255,0.65)',
                            marginBottom: '1.5rem',
                            fontFamily: 'var(--font-body)',
                            flex: 1,
                        }}>
                            {program.accroche}
                        </p>
                        {/* Meta info */}
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                            {program.duree && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
                                    <Clock size={14} color={COLOR} /> {program.duree}
                                </span>
                            )}
                            {program.format && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
                                    <BookOpen size={14} color={COLOR} /> {program.format}
                                </span>
                            )}
                        </div>

                        {/* CTA link */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            color: isHovered ? '#fff' : COLOR,
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            transition: 'all 0.3s ease',
                        }}>
                            En savoir plus <ArrowRight size={18} />
                        </div>
                    </div>
                </motion.div>
            </Link>
        );
    }

/* ── Formulaire d'inscription inline ────────────────────────── */
function InscriptionForm({ screenSize, COLOR, formations }: { screenSize: string; COLOR: string; formations: FormationCardData[] }) {
    const [form, setForm] = useState({ nom: "", email: "", telephone: "", formation: "", message: "" });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const iStyle: React.CSSProperties = {
        width: "100%", padding: "0.9rem 1.2rem",
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: "0.5rem", color: "#fff", fontFamily: "var(--font-body)", fontSize: "1rem",
        outline: "none", transition: "border-color 0.2s", boxSizing: "border-box",
    };
    const labelStyle: React.CSSProperties = {
        display: "block", fontSize: "0.65rem", fontWeight: 700,
        letterSpacing: "0.25em", textTransform: "uppercase",
        color: "rgba(255,255,255,0.4)", marginBottom: "0.55rem",
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        try {
            await fetch("/api/shopify/inscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prenom: form.nom.split(" ")[0] ?? form.nom,
                    nom: form.nom.split(" ").slice(1).join(" ") || form.nom,
                    email: form.email,
                    telephone: form.telephone,
                    formationSouhaitee: form.formation,
                    formationSlug: formations.find(f => f.title === form.formation)?.slug ?? "",
                    message: form.message,
                    typeClient: "B2C",
                    ville: "",
                    formatsPreferes: [],
                    disponibilite: "",
                }),
            });
            setSent(true);
            setForm({ nom: "", email: "", telephone: "", formation: "", message: "" });
        } catch {
            alert("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setSending(false);
        }
    };

    if (sent) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: "center", padding: "3rem 2rem", background: "rgba(22,163,74,0.07)", border: "1px solid rgba(22,163,74,0.25)", borderRadius: "1rem" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎉</div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", marginBottom: "0.75rem", fontFamily: "var(--font-display)" }}>Demande envoyée !</h3>
                <p style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body)", lineHeight: 1.7 }}>
                    Notre équipe vous contactera sous <strong style={{ color: "#fff" }}>24h ouvrées</strong> pour confirmer votre inscription et vous communiquer les modalités.
                </p>
            </motion.div>
        );
    }

    return (
        <motion.form initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            onSubmit={handleSubmit}
            style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${COLOR}22`, borderRadius: "1rem", padding: screenSize === "mobile" ? "2rem 1.5rem" : "3rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${COLOR}, ${COLOR}66)` }} />

            <div style={{ display: "grid", gridTemplateColumns: screenSize === "mobile" ? "1fr" : "1fr 1fr", gap: "1.2rem", marginBottom: "1.2rem" }}>
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

            <div style={{ display: "grid", gridTemplateColumns: screenSize === "mobile" ? "1fr" : "1fr 1fr", gap: "1.2rem", marginBottom: "1.2rem" }}>
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
                        {formations.map(f => (
                            <option key={f.slug} value={f.title} style={{ background: "#070e1c" }}>{f.title}</option>
                        ))}
                        <option value="Je ne sais pas encore" style={{ background: "#070e1c" }}>Je ne sais pas encore</option>
                    </select>
                </div>
            </div>

            <div style={{ marginBottom: "2rem" }}>
                <label style={labelStyle}>Message (facultatif)</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    rows={3} placeholder="Votre niveau actuel, vos objectifs, vos contraintes horaires..."
                    style={{ ...iStyle, resize: "vertical", lineHeight: 1.6 }}
                    onFocus={e => (e.target.style.borderColor = COLOR)} onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.09)")} />
            </div>

            <button type="submit" disabled={sending}
                style={{
                    width: "100%", padding: "1rem 2rem", background: COLOR, color: "#fff",
                    border: "none", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: 800,
                    letterSpacing: "0.18em", textTransform: "uppercase", cursor: sending ? "not-allowed" : "pointer",
                    opacity: sending ? 0.6 : 1, transition: "opacity 0.2s, transform 0.2s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                }}
                onMouseEnter={e => { if (!sending) (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
                <Send size={16} />
                {sending ? "Envoi en cours…" : "Réserver ma place"}
            </button>

            <p style={{ textAlign: "center", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", marginTop: "1rem", fontFamily: "var(--font-body)" }}>
                ✓ Réponse sous 24h · ✓ Sans engagement · ✓ Satisfait ou remboursé 7 jours
            </p>
        </motion.form>
    );
}

export default function FormationLandpage() {
    const screenSize = useMediaQuery();
    const [formationsData, setFormationsData] = useState<FormationCardData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);

    const loadFromShopify = async () => {
        setIsLoading(true);
        setFetchError(false);
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

    useEffect(() => {
        loadFromShopify();
    }, []);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategorie, setSelectedCategorie] = useState("Toutes");
    const [selectedSecteur, setSelectedSecteur] = useState("Tous");
    const [selectedNiveau, setSelectedNiveau] = useState("Tous");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [showFilters, setShowFilters] = useState(false);

    const categories = useMemo(() => [
        "Toutes",
        ...Array.from(new Set(formationsData.map(f => f.categorie).filter(Boolean)))
    ], [formationsData]);

    const secteurs = useMemo(() => [
        "Tous",
        ...Array.from(new Set(formationsData.map(f => f.secteur).filter(Boolean)))
    ], [formationsData]);

    const niveaux = useMemo(() => [
        "Tous",
        ...Array.from(new Set(formationsData.map(f => f.niveau).filter(Boolean)))
    ], [formationsData]);

    const filteredFormations = useMemo(() => {
        return formationsData.filter(f => {
            const title = f.title?.toLowerCase() || "";
            const accroche = f.accroche?.toLowerCase() || "";
            const secteur = f.secteur?.toLowerCase() || "";
            const search = searchQuery.toLowerCase();

            const matchSearch = searchQuery === "" ||
                title.includes(search) ||
                accroche.includes(search) ||
                secteur.includes(search);

            const matchCategorie = selectedCategorie === "Toutes" || f.categorie === selectedCategorie;
            const matchSecteur = selectedSecteur === "Tous" || f.secteur === selectedSecteur;
            const matchNiveau = selectedNiveau === "Tous" || f.niveau === selectedNiveau;

            return matchSearch && matchCategorie && matchSecteur && matchNiveau;
        });
    }, [formationsData, searchQuery, selectedCategorie, selectedSecteur, selectedNiveau]);

    return (
        <div style={{
            background: '#070E1C',
            minHeight: '100vh',
            overflowX: 'hidden',
            position: 'relative',
            color: '#fff',
        }}>
            {/* ── BACKGROUND LAYERS (Inspiré de ContactShell) ── */}
            <Grain />

            {/* Grid bg */}
            <div
                aria-hidden
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 0,
                    backgroundImage: `linear-gradient(rgba(211,84,0,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(211,84,0,0.035) 1px,transparent 1px)`,
                    backgroundSize: "80px 80px",
                    pointerEvents: "none"
                }}
            />

            {/* Glow */}
            <div
                aria-hidden
                style={{
                    position: "fixed",
                    top: "20%",
                    left: "50%",
                    width: "80vw",
                    height: "60vw",
                    zIndex: 0,
                    background: "radial-gradient(ellipse,rgba(211,84,0,0.06) 0%,transparent 70%)",
                    transform: "translate(-50%,-50%)",
                    pointerEvents: "none"
                }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
                <MarketingVideo />

                {/* ── STATS BAR ────────────────────────────────────── */}
                <section style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(255,255,255,0.025)',
                    padding: screenSize === 'mobile' ? '2.5rem 1.5rem' : '2.5rem 6rem',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    <div style={{
                        maxWidth: 1200,
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: screenSize === 'mobile' ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
                        gap: '1px',
                        background: 'rgba(255,255,255,0.06)',
                        borderRadius: '0.75rem',
                        overflow: 'hidden',
                    }}>
                        {STATS.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.07 }}
                                style={{
                                    padding: screenSize === 'mobile' ? '1.8rem 1.2rem' : '2rem 2.5rem',
                                    background: '#070e1c',
                                    textAlign: 'center',
                                }}
                            >
                                <div style={{ fontSize: screenSize === 'mobile' ? '2.2rem' : '2.8rem', fontWeight: 900, color: COLOR, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{s.value}</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginTop: '0.4rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.2rem', fontFamily: 'var(--font-body)' }}>{s.sub}</div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── POURQUOI ACT ─────────────────────────────────── */}
                <section style={{
                    padding: screenSize === 'mobile' ? '5rem 1.5rem' : '7rem 6rem',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            style={{ marginBottom: '3.5rem' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
                                <div style={{ width: 36, height: 2, background: COLOR }} />
                                <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.35em', textTransform: 'uppercase', color: COLOR }}>Notre méthode</span>
                            </div>
                            <h2 style={{
                                fontSize: screenSize === 'mobile' ? 'clamp(2rem, 8vw, 3rem)' : 'clamp(2.8rem, 5vw, 4.2rem)',
                                fontWeight: 900,
                                fontFamily: 'var(--font-display)',
                                textTransform: 'uppercase',
                                lineHeight: 1.05,
                                color: '#fff',
                            }}>
                                Pourquoi choisir <span style={{ color: COLOR }}>ACT Formation</span>
                            </h2>
                        </motion.div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: screenSize === 'mobile' ? '1fr' : screenSize === 'tablet' ? 'repeat(2,1fr)' : 'repeat(3,1fr)',
                            gap: '1.2rem',
                        }}>
                            {PILLARS.map((p, i) => {
                                const Icon = p.icon;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 24 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.08 }}
                                        style={{
                                            padding: '2rem',
                                            background: 'rgba(255,255,255,0.02)',
                                            border: '1px solid rgba(255,255,255,0.07)',
                                            borderRadius: '0.85rem',
                                            transition: 'border-color 0.25s, transform 0.25s',
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${COLOR}44`; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                    >
                                        <div style={{ width: 44, height: 44, borderRadius: '0.5rem', background: `${COLOR}18`, border: `1px solid ${COLOR}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                                            <Icon size={22} color={COLOR} />
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '0.65rem', fontFamily: 'var(--font-display)' }}>{p.title}</h3>
                                        <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, fontFamily: 'var(--font-body)', margin: 0 }}>{p.desc}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                      {/* Why Training Matters Section */}
                <section style={{
                    padding: screenSize === 'mobile' ? '4rem 1.5rem' : '6rem 4rem',
                    background: 'rgba(255,255,255,0.02)',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    position: 'relative',
                    zIndex: 1
                }}>
                </section>



                {/* ── CATALOGUE ────────────────────────────────────── */}
                <section id="catalogue" style={{
                    padding: screenSize === 'mobile' ? '5rem 1.5rem' : '7rem 6rem',
                    position: 'relative',
                    zIndex: 1,
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            style={{ marginBottom: '3rem' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
                                <div style={{ width: 36, height: 2, background: COLOR }} />
                                <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.35em', textTransform: 'uppercase', color: COLOR }}>Catalogue</span>
                            </div>
                            <h2 style={{
                                fontSize: screenSize === 'mobile' ? 'clamp(2rem, 8vw, 3rem)' : 'clamp(2.8rem, 5vw, 4.2rem)',
                                fontWeight: 900,
                                fontFamily: 'var(--font-display)',
                                textTransform: 'uppercase',
                                lineHeight: 1.05,
                            }}>
                                Nos <span style={{ color: COLOR }}>Formations</span>
                            </h2>
                        </motion.div>

                        {/* Formation populaire en avant */}
                        {!isLoading && formationsData.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                style={{ marginBottom: '2.5rem' }}
                            >
                                <Link href={`/formations/${formationsData[0].slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                                    <div style={{
                                        position: 'relative',
                                        borderRadius: '1rem',
                                        overflow: 'hidden',
                                        background: 'rgba(255,255,255,0.02)',
                                        border: `1px solid ${COLOR}44`,
                                        display: 'grid',
                                        gridTemplateColumns: screenSize === 'mobile' ? '1fr' : '1fr 1fr',
                                        minHeight: 320,
                                        transition: 'box-shadow 0.3s',
                                    }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 24px 64px ${COLOR}22`; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                                    >
                                        {/* Badge populaire */}
                                        <div style={{ position: 'absolute', top: '1.2rem', left: '1.2rem', zIndex: 2, padding: '0.3rem 0.9rem', background: COLOR, borderRadius: '2rem', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff' }}>
                                            ★ Populaire
                                        </div>

                                        {/* Image */}
                                        {formationsData[0].imageUrl && (
                                            <div style={{ position: 'relative', overflow: 'hidden', minHeight: screenSize === 'mobile' ? 240 : 'auto' }}>
                                                <img src={formationsData[0].imageUrl} alt={formationsData[0].title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65)' }} />
                                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, rgba(7,14,28,0.95) 100%)' }} />
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div style={{ padding: screenSize === 'mobile' ? '2rem 1.5rem' : '2.5rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
                                            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLOR }}>{formationsData[0].secteur}</span>
                                            <h3 style={{ fontSize: screenSize === 'mobile' ? '1.5rem' : '2rem', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-display)', lineHeight: 1.15, margin: 0 }}>{formationsData[0].title}</h3>
                                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0, fontFamily: 'var(--font-body)' }}>{formationsData[0].accroche}</p>
                                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                                {formationsData[0].duree && <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}><Clock size={13} color={COLOR} />{formationsData[0].duree}</span>}
                                                {formationsData[0].format && <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}><BookOpen size={13} color={COLOR} />{formationsData[0].format}</span>}
                                                {formationsData[0].prix && <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: COLOR }}><Tag size={13} color={COLOR} />{formationsData[0].prix}</span>}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: COLOR, fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                                Voir la formation <ArrowRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        )}

                        {/* Grille reste des formations */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: screenSize === 'mobile' ? '1fr' : screenSize === 'tablet' ? 'repeat(2,1fr)' : 'repeat(3,1fr)',
                            gap: '1.5rem',
                        }}>
                            {isLoading ? (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }}>
                                    <Loader2 size={28} color={COLOR} style={{ animation: 'spin 1s linear infinite' }} />
                                </div>
                            ) : formationsData.length === 0 ? (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                                    <p style={{ color: 'rgba(255,255,255,0.4)' }}>Aucune formation disponible pour le moment.</p>
                                </div>
                            ) : (
                                formationsData.slice(1).map((program, i) => (
                                    <ProgramCard key={program.slug} program={program} index={i} screenSize={screenSize} COLOR={COLOR} />
                                ))
                            )}
                        </div>

                        {formationsData.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                style={{ textAlign: 'center', marginTop: '3rem' }}
                            >
                                <CTAButton href="/formations/all" iconPosition="right" icon={<ArrowRight size={18} />}>
                                    Voir toutes les formations
                                </CTAButton>
                            </motion.div>
                        )}
                    </div>
                </section>


                {/* ── GARANTIES ────────────────────────────────────── */}
                <section style={{
                    padding: screenSize === 'mobile' ? '5rem 1.5rem' : '7rem 6rem',
                    background: 'rgba(255,255,255,0.015)',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    position: 'relative', zIndex: 1,
                }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '3rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
                                <div style={{ width: 36, height: 2, background: COLOR }} />
                                <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.35em', textTransform: 'uppercase', color: COLOR }}>Nos engagements</span>
                            </div>
                            <h2 style={{ fontSize: screenSize === 'mobile' ? 'clamp(2rem,8vw,3rem)' : 'clamp(2.8rem,5vw,4.2rem)', fontWeight: 900, fontFamily: 'var(--font-display)', textTransform: 'uppercase', lineHeight: 1.05 }}>
                                Des garanties <span style={{ color: COLOR }}>concrètes</span>
                            </h2>
                        </motion.div>
                        <div style={{ display: 'grid', gridTemplateColumns: screenSize === 'mobile' ? '1fr' : screenSize === 'tablet' ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: '1.2rem' }}>
                            {GUARANTEES.map((g, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                                    style={{ padding: '2rem 1.8rem', background: i === 0 ? `${COLOR}10` : 'rgba(255,255,255,0.025)', border: `1px solid ${i === 0 ? COLOR + '33' : 'rgba(255,255,255,0.07)'}`, borderRadius: '0.85rem' }}>
                                    <div style={{ fontSize: '1.6rem', marginBottom: '0.8rem' }}>{['✅','👥','🎓','♾️'][i]}</div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: i === 0 ? COLOR : '#fff', marginBottom: '0.7rem', fontFamily: 'var(--font-display)' }}>{g.label}</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, fontFamily: 'var(--font-body)', margin: 0 }}>{g.detail}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── FONDATEUR ────────────────────────────────────── */}
                <section style={{ padding: screenSize === 'mobile' ? '5rem 1.5rem' : '7rem 6rem', position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: screenSize === 'mobile' ? '1fr' : '420px 1fr', gap: screenSize === 'mobile' ? '3rem' : '5rem', alignItems: 'center' }}>
                            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ position: 'relative' }}>
                                <div style={{ borderRadius: '1rem', overflow: 'hidden', border: `1px solid ${COLOR}33`, position: 'relative', aspectRatio: '4/5', maxWidth: 420 }}>
                                    <img src="/Sohaib_baroud_Manifeste.png" alt="Sohaib Baroud — Fondateur ACT" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,14,28,0.6) 0%, transparent 50%)' }} />
                                    <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem' }}>
                                        <p style={{ margin: 0, fontWeight: 800, color: '#fff', fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>Sohaib Baroud</p>
                                        <p style={{ margin: '0.2rem 0 0', color: COLOR, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Fondateur & CEO · ACT</p>
                                    </div>
                                </div>
                                <div aria-hidden style={{ position: 'absolute', top: '-1.5rem', left: '-1.5rem', width: 80, height: 80, border: `2px solid ${COLOR}22`, borderRadius: '0.5rem', zIndex: -1 }} />
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                                    <div style={{ width: 36, height: 2, background: COLOR }} />
                                    <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.35em', textTransform: 'uppercase', color: COLOR }}>Mot du fondateur</span>
                                </div>
                                <blockquote style={{ margin: '0 0 2rem', padding: 0, border: 'none' }}>
                                    <p style={{ fontSize: screenSize === 'mobile' ? '1.25rem' : '1.55rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                                        &ldquo;J&apos;ai créé ACT Formation parce que j&apos;en avais assez des formations théoriques qui n&apos;aident personne à avancer concrètement.&rdquo;
                                    </p>
                                    <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                                        Après des années à accompagner des entreprises africaines dans leur transformation digitale, j&apos;ai vu le même blocage : les compétences manquent, pas la motivation. Nos formations sont conçues par des gens qui font, pour des gens qui veulent faire.
                                    </p>
                                    <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)', lineHeight: 1.8 }}>
                                        Chaque programme est testé sur le terrain avant d&apos;être proposé. Si ça ne crée pas de valeur mesurable pour vous, je veux le savoir — et je vous rembourse.
                                    </p>
                                </blockquote>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    {['15+ ans terrain', 'Formé en Europe & Afrique', '200+ entreprises accompagnées'].map((tag, i) => (
                                        <span key={i} style={{ padding: '0.35rem 0.9rem', background: `${COLOR}12`, border: `1px solid ${COLOR}2A`, borderRadius: '2rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)' }}>{tag}</span>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ── FORMULAIRE D'INSCRIPTION ─────────────────────── */}
                <section id="inscription" style={{ padding: screenSize === 'mobile' ? '5rem 1.5rem' : '7rem 6rem', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
                    <div style={{ maxWidth: 720, margin: '0 auto' }}>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '3rem', textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
                                <div style={{ width: 36, height: 2, background: COLOR }} />
                                <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.35em', textTransform: 'uppercase', color: COLOR }}>Inscription</span>
                                <div style={{ width: 36, height: 2, background: COLOR }} />
                            </div>
                            <h2 style={{ fontSize: screenSize === 'mobile' ? 'clamp(2rem,8vw,3rem)' : 'clamp(2.5rem,4vw,3.5rem)', fontWeight: 900, fontFamily: 'var(--font-display)', textTransform: 'uppercase', lineHeight: 1.05, marginBottom: '1rem' }}>
                                Réservez votre <span style={{ color: COLOR }}>place</span>
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', fontFamily: 'var(--font-body)', lineHeight: 1.7 }}>
                                Indiquez votre intérêt — un conseiller vous contacte sous 24h pour confirmer disponibilités et modalités.
                            </p>
                        </motion.div>
                        <InscriptionForm screenSize={screenSize} COLOR={COLOR} formations={formationsData} />
                    </div>
                </section>

                {/* ── PÉDAGOGIE (gardée, déplacée avant footer) ─────── */}
                <section style={{ padding: screenSize === 'mobile' ? '4rem 1.5rem' : '6rem 4rem',
                              maxWidth: '1400px',
                              margin: '0 auto',
                            }}>
                              <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                style={{
                                  fontSize: screenSize === 'mobile' ? 'clamp(2rem, 7vw, 3rem)' : 'clamp(3rem, 5vw, 4.5rem)',
                                  fontWeight: 900,
                                  marginBottom: '3rem',
                                  fontFamily: 'var(--font-display)',
                                  textTransform: 'uppercase'
                                }}
                              >
                                Notre <span style={{ color: COLOR }}>Pédagogie</span>
                              </motion.h2>
                      
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {pedagogy.map((item, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    style={{
                                      display: 'flex',
                                      gap: screenSize === 'mobile' ? '1rem' : '2rem',
                                      alignItems: 'flex-start',
                                      padding: screenSize === 'mobile' ? '1.5rem' : '2rem',
                                      background: 'rgba(255,255,255,0.02)',
                                      border: '1px solid rgba(255,255,255,0.08)',
                                      borderRadius: '0.75rem',
                                    }}
                                  >
                                    <span style={{
                                      fontSize: screenSize === 'mobile' ? '2rem' : '3rem',
                                      fontWeight: 900,
                                      color: `${COLOR}44`,
                                      lineHeight: 1,
                                      fontFamily: 'var(--font-display)',
                                      flexShrink: 0
                                    }}>
                                      {item.step}
                                    </span>
                                    <div>
                                      <h3 style={{
                                        fontSize: screenSize === 'mobile' ? '1.3rem' : '1.6rem',
                                        fontWeight: 800,
                                        marginBottom: '0.5rem',
                                        color: '#fff',
                                        fontFamily: 'var(--font-display)'
                                      }}>
                                        {item.title}
                                      </h3>
                                      <p style={{
                                        fontSize: '1rem',
                                        color: 'rgba(255,255,255,0.65)',
                                        fontFamily: 'var(--font-body)'
                                      }}>
                                        {item.desc}
                                      </p>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </section>
                      

       
                


                {/* Why Choose Us — supprimé, remplacé par Garanties + Fondateur ci-dessus */}
                <section style={{ display: 'none' }}>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontSize: screenSize === 'mobile' ? 'clamp(2rem, 7vw, 3rem)' : 'clamp(3rem, 5vw, 4.5rem)',
            fontWeight: 900,
            marginBottom: '3rem',
            fontFamily: 'var(--font-display)',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          Pourquoi nous <span style={{ color: COLOR }}>choisir</span>
        </motion.h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: screenSize === 'mobile' ? '1fr' : screenSize === 'tablet' ? '1fr' : 'repeat(2, 1fr)',
          gap: screenSize === 'mobile' ? '1.5rem' : '2rem',
        }}>
          {[
            {
              icon: Target,
              title: "Approche Pragmatique",
              desc: "Nous privilégions les solutions concrètes et mesurables, adaptées à votre contexte et vos ressources."
            },
            {
              icon: Users,
              title: "Expertise Sectorielle",
              desc: "Une connaissance approfondie des enjeux métiers et des spécificités de votre secteur d'activité."
            },
            {
              icon: TrendingUp,
              title: "ROI Démontré",
              desc: "Accompagnement axé sur la création de valeur mesurable et l'optimisation de vos investissements IT."
            },
            {
              icon: Shield,
              title: "Neutralité Technologique",
              desc: "Recommandations indépendantes et objectives, sans parti pris technologique ou commercial."
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: screenSize === 'mobile' ? '2rem' : '2.5rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '1rem',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${COLOR}66`;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 12px 40px ${COLOR}22`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '0.5rem',
                  background: `${COLOR}22`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}>
                  <Icon size={24} color={COLOR} />
                </div>
                <h3 style={{
                  fontSize: screenSize === 'mobile' ? '1.3rem' : '1.5rem',
                  fontWeight: 800,
                  marginBottom: '1rem',
                  color: '#fff',
                  fontFamily: 'var(--font-display)',
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.65)',
                  fontFamily: 'var(--font-body)',
                }}>
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>


                     {/* Call-to-action */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            style={{
                            marginTop: '4rem',
                            textAlign: 'center',
                            padding: screenSize === 'mobile' ? '2rem 1.5rem' : '3rem',
                            background: `linear-gradient(135deg, ${COLOR}15, ${COLOR}08)`,
                            border: `1px solid ${COLOR}33`,
                            borderRadius: '1rem',
                            maxWidth: '1400px',
                            margin: '4rem auto 0',
                            }}
                        >
                            <h3 style={{
                            fontSize: screenSize === 'mobile' ? '1.6rem' : '2.5rem',
                            fontWeight: 800,
                            color: '#fff',
                            fontFamily: 'var(--font-display)',
                            marginBottom: '1.5rem',
                            lineHeight: 1.2,
                            }}>
                            L&apos;investissement dans la formation, c&apos;est l&apos;investissement dans l&apos;avenir
                            </h3>
                            <p style={{
                            fontSize: screenSize === 'mobile' ? '1.1rem' : '1.4rem',
                            color: 'rgba(255,255,255,0.7)',
                            fontFamily: 'var(--font-body)',
                            maxWidth: '850px',
                            margin: '0 auto 2.5rem',
                            lineHeight: 1.7,
                            }}>
                            Les entreprises qui forment leurs équipes sont 2x plus susceptibles d&apos;innover et 3x plus compétitives sur leur marché
                            </p>
                            <div style={{ 
                                display: 'flex', 
                                gap: '1.5rem', 
                                justifyContent: 'center', 
                                flexWrap: screenSize === 'mobile' ? 'wrap' : 'nowrap',
                                maxWidth: '800px',
                                margin: '0 auto'
                            }}>
                                <div style={{ flex: 1, minWidth: screenSize === 'mobile' ? '100%' : '240px' }}>
                                    <CTAButton href="/formations/all" className="cta-full-width">
                                        Voir toutes nos formations
                                    </CTAButton>
                                </div>
                                <div style={{ flex: 1, minWidth: screenSize === 'mobile' ? '100%' : '240px' }}>
                                    <CTAButton href="https://elearning.africacentredtechnology.com/" external className="cta-full-width">
                                        ACT University
                                    </CTAButton>
                                </div>
                            </div>
                        </motion.div>

                <FooterStrip />
            </div>

            <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .cta-full-width, .cta-full-width .cta-btn {
          width: 100% !important;
          display: flex !important;
          justify-content: center !important;
        }
        .cta-full-width .cta-btn__inner {
          width: 100% !important;
          justify-content: center !important;
        }
      `}</style>
        </div>


    );

    function ProgramCard({ program, index, screenSize, COLOR }: { program: FormationCardData, index: number, screenSize: string, COLOR: string }) {
          const [isHovered, setIsHovered] = useState(false);
        
          return (
            <Link href={`/formations/${program.slug}`} style={{ textDecoration: 'none' }}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  height: '100%',
                  background: 'rgba(255,255,255,0.02)',
                  border: isHovered ? `1px solid ${COLOR}` : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  transition: 'all 0.4s ease',
                  transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                  boxShadow: isHovered ? `0 20px 60px ${COLOR}33` : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Image Header */}
                <div style={{
                  position: 'relative',
                  height: screenSize === 'mobile' ? '180px' : '220px',
                  overflow: 'hidden',
                  background: 'rgba(0,0,0,0.3)',
                }}>
                  {program.imageUrl && (
                    <img
                      src={program.imageUrl}
                      alt={program.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s ease, filter 0.4s ease',
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                        filter: isHovered ? 'grayscale(0%) brightness(0.8)' : 'grayscale(40%) brightness(0.6)',
                      }}
                    />
                  )}
                  {/* Gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(to bottom, transparent 0%, rgba(7,14,28,0.4) 50%, rgba(7,14,28,0.95) 100%)`,
                  }} />
                  {/* Niveau badge */}
                  {program.niveau && (
                    <div style={{
                      position: 'absolute',
                      bottom: '1rem',
                      left: '1.5rem',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '2rem',
                      background: `${COLOR}`,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#fff',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {program.niveau}
                    </div>
                  )}
                </div>
        
                {/* Content */}
                <div style={{
                  padding: screenSize === 'mobile' ? '1.5rem' : '2rem',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <h3 style={{
                    fontSize: screenSize === 'mobile' ? '1.3rem' : '1.6rem',
                    fontWeight: 900,
                    marginBottom: '1rem',
                    fontFamily: 'var(--font-display)',
                    color: '#fff',
                    textTransform: 'uppercase',
                    lineHeight: 1.2,
                  }}>
                    {program.title}
                  </h3>
                  <p style={{
                    fontSize: screenSize === 'mobile' ? '0.95rem' : '1rem',
                    lineHeight: 1.6,
                    color: 'rgba(255,255,255,0.65)',
                    marginBottom: '1.5rem',
                    fontFamily: 'var(--font-body)',
                    flex: 1,
                  }}>
                    {program.accroche}
                  </p>
                  {/* Meta info */}
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    {program.duree && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
                        <Clock size={14} color={COLOR} /> {program.duree}
                      </span>
                    )}
                    {program.format && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
                        <BookOpen size={14} color={COLOR} /> {program.format}
                      </span>
                    )}
                  </div>
        
                  {/* CTA link */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    color: isHovered ? '#fff' : COLOR,
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    transition: 'all 0.3s ease',
                  }}>
                    En savoir plus <ArrowRight size={18} />
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        }
        
}

