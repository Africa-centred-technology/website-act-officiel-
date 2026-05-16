"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Send, Loader2, Search, ChevronDown, X } from "lucide-react";
import CTAButton from "@/components/ui/CTAButton";
import { identifyUser, setUserProfile } from "@/lib/session";
import { getCsrfToken } from "@/lib/csrf";
// @ts-ignore
import { CountryRegionData } from "react-country-region-selector";

const ORANGE = "#D35400";

/* ── CountryRegionData = [[name, code, regions], ...] ── */
const RAW_COUNTRIES: [string, string][] = (
  (CountryRegionData as any).default ?? CountryRegionData
).map(([name, code]: [string, string]) => [name, code]);

/* ── Helpers ─────────────────────────────────────────── */

/** Emoji drapeau depuis le code ISO 2 lettres (ex: "MA" → 🇲🇦) */
function countryFlag(code: string): string {
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

/** Nom du pays en français via Intl.DisplayNames (fallback sur le nom anglais) */
let frDisplayNames: Intl.DisplayNames | null = null;
function countryNameFr(code: string, fallback: string): string {
  try {
    if (!frDisplayNames)
      frDisplayNames = new Intl.DisplayNames(["fr"], { type: "region" });
    return frDisplayNames.of(code) ?? fallback;
  } catch {
    return fallback;
  }
}

/* Construit la liste enrichie une seule fois (lazy au premier rendu) */
interface CountryEntry { code: string; nameFr: string; nameEn: string; flag: string }
let ENRICHED_CACHE: CountryEntry[] | null = null;
function getCountries(): CountryEntry[] {
  if (ENRICHED_CACHE) return ENRICHED_CACHE;
  ENRICHED_CACHE = RAW_COUNTRIES.map(([nameEn, code]) => ({
    code,
    nameEn,
    nameFr: countryNameFr(code, nameEn),
    flag: countryFlag(code),
  }));
  // Trie par nom français
  ENRICHED_CACHE.sort((a, b) => a.nameFr.localeCompare(b.nameFr, "fr"));
  return ENRICHED_CACHE;
}

/* Pour résoudre le nom lisible à envoyer à l'API */
const ALL_COUNTRIES = RAW_COUNTRIES;

/* ── Searchable country dropdown ─────────────────────── */
function CountrySearchSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const tInsc = useTranslations("formations.inscription");
  const [query, setQuery]     = useState("");
  const [open, setOpen]       = useState(false);
  const containerRef          = useRef<HTMLDivElement>(null);
  const countries             = getCountries();

  /* Entrée sélectionnée */
  const selected = countries.find((c) => c.code === value) ?? null;

  /* Filtrage sur nom FR + nom EN + code */
  const filtered = query.trim()
    ? countries.filter((c) =>
        c.nameFr.toLowerCase().includes(query.toLowerCase()) ||
        c.nameEn.toLowerCase().includes(query.toLowerCase()) ||
        c.code.toLowerCase().includes(query.toLowerCase())
      )
    : countries;

  /* Ferme au clic extérieur */
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const select = (code: string) => {
    onChange(code);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          padding: "1.1rem 1.3rem",
          background: "rgba(255,255,255,0.05)",
          border: `1px solid ${open ? ORANGE : "rgba(255,255,255,0.1)"}`,
          borderRadius: open ? "8px 8px 0 0" : "8px",
          color: selected ? "#fff" : "rgba(255,255,255,0.35)",
          fontSize: "1.7rem",
          fontFamily: "Futura, system-ui, sans-serif",
          textAlign: "left",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "border-color 0.2s",
          outline: "none",
        }}
      >
        {selected ? (
          <span style={{ display: "flex", alignItems: "center", gap: "0.65rem", overflow: "hidden" }}>
            <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>{selected.flag}</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selected.nameFr}</span>
            <span style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.35)", flexShrink: 0 }}>{selected.code}</span>
          </span>
        ) : (
          <span>{tInsc("countrySelectPlaceholder")}</span>
        )}
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0, marginLeft: "0.75rem" }}>
          {selected && (
            <X
              size={16}
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              style={{ opacity: 0.5, cursor: "pointer" }}
            />
          )}
          <ChevronDown
            size={18}
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
              opacity: 0.5,
            }}
          />
        </span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "#0d1829",
              border: `1px solid ${ORANGE}`,
              borderTop: "none",
              borderRadius: "0 0 8px 8px",
              zIndex: 50,
              overflow: "hidden",
              boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
            }}
          >
            {/* Search input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.8rem 1rem",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <Search size={16} color={ORANGE} strokeWidth={2} style={{ flexShrink: 0 }} />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={tInsc("countrySearchPlaceholder")}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "#fff",
                  fontSize: "1.4rem",
                  fontFamily: "Futura, system-ui, sans-serif",
                }}
              />
              {query && (
                <X
                  size={14}
                  color="rgba(255,255,255,0.4)"
                  style={{ cursor: "pointer", flexShrink: 0 }}
                  onClick={() => setQuery("")}
                />
              )}
            </div>

            {/* List */}
            <div style={{ maxHeight: "260px", overflowY: "auto" }}>
              {filtered.length === 0 ? (
                <p style={{ padding: "1rem", color: "rgba(255,255,255,0.35)", fontSize: "1.3rem", textAlign: "center", fontFamily: "Futura, system-ui, sans-serif" }}>
                  {tInsc("countryNotFound")}
                </p>
              ) : (
                filtered.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => select(country.code)}
                    style={{
                      width: "100%",
                      padding: "0.7rem 1rem",
                      background: value === country.code ? `${ORANGE}22` : "none",
                      border: "none",
                      borderLeft: value === country.code ? `3px solid ${ORANGE}` : "3px solid transparent",
                      color: value === country.code ? "#fff" : "rgba(255,255,255,0.75)",
                      fontSize: "1.4rem",
                      fontFamily: "Futura, system-ui, sans-serif",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "background 0.15s",
                      outline: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                    onMouseEnter={(e) => {
                      if (value !== country.code) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      if (value !== country.code) (e.currentTarget as HTMLButtonElement).style.background = value === country.code ? `${ORANGE}22` : "none";
                    }}
                  >
                    <span style={{ fontSize: "1.5rem", lineHeight: 1, flexShrink: 0 }}>{country.flag}</span>
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{country.nameFr}</span>
                    <span style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.35)", flexShrink: 0 }}>{country.code}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


/* ── Input helpers ─────────────────────────────────────── */
const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "1.1rem 1.3rem",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "1.7rem",
  fontFamily: "Futura, system-ui, sans-serif",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box" as const,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "1.3rem",
  fontWeight: 700,
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  color: "rgba(255,255,255,0.45)",
  marginBottom: "0.7rem",
  fontFamily: "Futura, system-ui, sans-serif",
};

function Field({
  label,
  required,
  children,
  style,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={style}>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: ORANGE, marginLeft: "0.25rem" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={fieldStyle}
      onFocus={(e) => {
        (e.currentTarget as HTMLInputElement).style.borderColor = ORANGE;
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)";
        props.onBlur?.(e);
      }}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { options: string[]; placeholder?: string }) {
  const { options, placeholder, ...rest } = props;
  return (
    <select
      {...rest}
      style={{ ...fieldStyle, cursor: "pointer" }}
      onFocus={(e) => {
        (e.currentTarget as HTMLSelectElement).style.borderColor = ORANGE;
      }}
      onBlur={(e) => {
        (e.currentTarget as HTMLSelectElement).style.borderColor = "rgba(255,255,255,0.1)";
      }}
    >
      <option value="" style={{ background: "#0A1410" }}>{placeholder ?? "— Choisir —"}</option>
      {options.map((o) => (
        <option key={o} value={o} style={{ background: "#0A1410" }}>
          {o}
        </option>
      ))}
    </select>
  );
}

/* ── Props ──────────────────────────────────────────────── */
interface FormationInscriptionFormProps {
  formationTitle?: string;
  formationSlug?: string;
  onSuccess?: () => void;
}

/* ── Main ───────────────────────────────────────────────── */
export default function FormationInscriptionForm({
  formationTitle,
  formationSlug,
  onSuccess,
}: FormationInscriptionFormProps) {
  const t = useTranslations("formations.inscription");
  const tOpts = useTranslations("formations.inscription.options");
  const locale = useLocale();

  const CANAUX = [
    tOpts("canaux.instagram"),
    tOpts("canaux.linkedin"),
    tOpts("canaux.youtube"),
    tOpts("canaux.facebook"),
    tOpts("canaux.boucheAOreille"),
    tOpts("canaux.google"),
    tOpts("canaux.autre"),
  ];

  const FONCTIONS_PRO = [
    tOpts("fonctionsPro.dg"),
    tOpts("fonctionsPro.dsi"),
    tOpts("fonctionsPro.drh"),
    tOpts("fonctionsPro.directionInnovation"),
    tOpts("fonctionsPro.responsableFormation"),
    tOpts("fonctionsPro.manager"),
    tOpts("fonctionsPro.developpeur"),
    tOpts("fonctionsPro.autre"),
  ];

  const FONCTIONS_ETU = [
    tOpts("fonctionsEtu.etudiantLicence"),
    tOpts("fonctionsEtu.etudiantIngenieur"),
    tOpts("fonctionsEtu.jeuneDiplome"),
    tOpts("fonctionsEtu.salarie"),
    tOpts("fonctionsEtu.freelance"),
    tOpts("fonctionsEtu.reconversion"),
    tOpts("fonctionsEtu.demandeurEmploi"),
  ];

  const NIVEAUX_ETUDES = [
    tOpts("niveauxEtudes.bac"),
    tOpts("niveauxEtudes.bac2"),
    tOpts("niveauxEtudes.licence"),
    tOpts("niveauxEtudes.master"),
    tOpts("niveauxEtudes.ingenieur"),
    tOpts("niveauxEtudes.doctorat"),
  ];

  const [tab] = useState<"pro" | "etudiant">("etudiant");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const [form, setForm] = useState({
    // Commun
    civilite: "M.",
    prenom: "",
    nom: "",
    email: "",
    telephone1: "",
    fonction: "",
    commentConnu: "",
    dateSouhaitee: "",
    nombreParticipants: "",
    message: "",
    consentementRGPD: false,

    // Pro
    organisme: "",

    // Étudiant
    niveauEtudes: "",
  });

  const set = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/shopify/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": getCsrfToken() },
        body: JSON.stringify({
          typeClient: tab === "pro" ? "B2B" : "B2C",
          prenom: form.prenom,
          nom: form.nom,
          email: form.email,
          telephone: form.telephone1,
          fonctionDemandeur: form.fonction,
          entreprise: form.organisme,
          niveauEtudes: form.niveauEtudes,
          commentConnu: form.commentConnu,
          dateSouhaitee: form.dateSouhaitee,
          nombreParticipants: form.nombreParticipants,
          message: form.message,
          formationSouhaitee: formationTitle,
          formationSlug,
          timestamp: new Date().toISOString(),
          locale,
        }),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      const fullName = `${form.prenom ?? ""} ${form.nom ?? ""}`.trim();
      identifyUser({ name: fullName, email: form.email, source: "inscription" });
      setUserProfile({ name: fullName, email: form.email, phone: form.telephone1, company: form.organisme });
      setStatus("success");
      onSuccess?.();
    } catch {
      setStatus("error");
    }
  };

  /* ── Success screen ─────────────────────────────────── */
  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          textAlign: "center",
          padding: "5rem 2rem",
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "1rem",
        }}
      >
        <CheckCircle2 size={72} color="#22c55e" style={{ margin: "0 auto 1.5rem" }} />
        <h3
          style={{
            fontSize: "clamp(2.5rem, 3.5vw, 3.5rem)",
            fontWeight: 900,
            color: "#22c55e",
            marginBottom: "1rem",
            fontFamily: "Futura, system-ui, sans-serif",
          }}
        >
          {t("successTitle")}
        </h3>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.4rem", lineHeight: 1.8, maxWidth: "520px", margin: "0 auto" }}>
          {t("successMessage")}
        </p>
        <p style={{ marginTop: "1rem", color: "rgba(255,255,255,0.4)", fontSize: "1rem" }}>
          {t("successRedirectNote")}
        </p>
        {onSuccess && (
          <button
            onClick={onSuccess}
            style={{
              marginTop: "2.5rem",
              padding: "0.85rem 2.5rem",
              background: ORANGE,
              color: "#fff",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              letterSpacing: "0.05em",
            }}
          >
            {t("successClose")}
          </button>
        )}
      </motion.div>
    );
  }

  /* ── Form ───────────────────────────────────────────── */
  return (
    <form onSubmit={handleSubmit} noValidate>
      <div
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "1rem",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Top orange rule */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(to right, ${ORANGE}, #F39C12)`,
          }}
        />


        {/* ── Fields ────────────────────────────────────── */}
        <div style={{ padding: "clamp(1.8rem, 3vw, 2.8rem)" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1.4rem",
            }}
            className="inscription-fields"
          >
            {/* Email — full row */}
            <Field label={t("fieldEmail")} required style={{ gridColumn: "1 / -1" }}>
              <Input
                type="email"
                required
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="votre@email.com"
              />
            </Field>

            {/* Formation — full row */}
            <Field label={t("fieldFormation")} required style={{ gridColumn: "1 / -1" }}>
              <Input
                type="text"
                required
                value={formationTitle ?? ""}
                readOnly={!!formationTitle}
                onChange={() => {}}
                style={{
                  ...fieldStyle,
                  opacity: formationTitle ? 0.65 : 1,
                  cursor: formationTitle ? "default" : "text",
                }}
              />
            </Field>

            {/* Pro: Organisme / Etu: Niveau études */}
            <AnimatePresence mode="wait">
              {tab === "pro" ? (
                <motion.div
                  key="organisme"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ gridColumn: "1 / -1" }}
                >
                  <Field label={t("fieldOrganisme")} required>
                    <Input
                      type="text"
                      required
                      value={form.organisme}
                      onChange={(e) => set("organisme", e.target.value)}
                      placeholder={t("fieldOrganismePlaceholder")}
                    />
                  </Field>
                </motion.div>
              ) : (
                <motion.div
                  key="niveau"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ gridColumn: "1 / -1" }}
                >
                  <Field label={t("fieldNiveauEtudes")}>
                    <Select
                      value={form.niveauEtudes}
                      onChange={(e) => set("niveauEtudes", e.target.value)}
                      options={NIVEAUX_ETUDES}
                      placeholder={t("selectDefault")}
                    />
                  </Field>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Civilité */}
            <Field label={t("fieldCivilite")} style={{ gridColumn: "1 / -1" }}>
              <div style={{ display: "flex", gap: "2rem", paddingTop: "0.3rem" }}>
                {["M.", "Mme."].map((c) => (
                  <label
                    key={c}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      cursor: "pointer",
                      color: form.civilite === c ? "#fff" : "rgba(255,255,255,0.45)",
                      fontSize: "1.65rem",
                      fontFamily: "Futura, system-ui, sans-serif",
                      transition: "color 0.2s",
                    }}
                  >
                    <input
                      type="radio"
                      name="civilite"
                      value={c}
                      checked={form.civilite === c}
                      onChange={() => set("civilite", c)}
                      style={{ accentColor: ORANGE, width: 16, height: 16 }}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </Field>

            {/* Nom + Prénom */}
            <Field label={t("fieldNom")} required>
              <Input
                type="text"
                required
                value={form.nom}
                onChange={(e) => set("nom", e.target.value)}
                placeholder={t("fieldNomPlaceholder")}
              />
            </Field>
            <Field label={t("fieldPrenom")} required>
              <Input
                type="text"
                required
                value={form.prenom}
                onChange={(e) => set("prenom", e.target.value)}
                placeholder={t("fieldPrenomPlaceholder")}
              />
            </Field>

            {/* Fonction */}
            <Field label={t("fieldFonction")} required>
              <Select
                value={form.fonction}
                onChange={(e) => set("fonction", e.target.value)}
                options={tab === "pro" ? FONCTIONS_PRO : FONCTIONS_ETU}
                placeholder={t("selectDefault")}
              />
            </Field>

            {/* Téléphone */}
            <Field label={t("fieldTelephone")} required style={{ gridColumn: "1 / -1" }}>
              <Input
                type="tel"
                required
                value={form.telephone1}
                onChange={(e) => set("telephone1", e.target.value)}
                placeholder="+212 6XX XXX XXX"
              />
            </Field>



            {/* Nb participants */}
            <Field
              label={t("fieldNbParticipants")}
              style={tab === "pro" ? {} : { display: "none" }}
            >
              <Input
                type="number"
                min={1}
                value={form.nombreParticipants}
                onChange={(e) => set("nombreParticipants", e.target.value)}
                placeholder="Ex : 5"
              />
            </Field>

            {/* Message — full row */}
            <Field label={t("fieldMessage")} style={{ gridColumn: "1 / -1" }}>
              <textarea
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                rows={4}
                placeholder={t("fieldMessagePlaceholder")}
                style={{
                  ...fieldStyle,
                  resize: "vertical",
                  lineHeight: 1.6,
                }}
                onFocus={(e) =>
                  ((e.currentTarget as HTMLTextAreaElement).style.borderColor = ORANGE)
                }
                onBlur={(e) =>
                  ((e.currentTarget as HTMLTextAreaElement).style.borderColor =
                    "rgba(255,255,255,0.1)")
                }
              />
            </Field>


            {/* Error */}
            {status === "error" && (
              <p
                style={{
                  gridColumn: "1 / -1",
                  color: "#ef4444",
                  fontSize: "1.6rem",
                  margin: 0,
                  fontFamily: "Futura, system-ui, sans-serif",
                }}
              >
                {t("errorMessage")}
              </p>
            )}

            {/* Submit */}
            <div style={{ gridColumn: "1 / -1" }}>
              <CTAButton
                type="submit"
                disabled={status === "loading"}
                icon={status === "loading" ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              >
                {status === "loading" ? t("submitting") : t("submitBtn")}
              </CTAButton>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 640px) {
          .inscription-fields {
            grid-template-columns: 1fr !important;
          }
          .inscription-fields > * {
            grid-column: 1 / -1 !important;
          }
        }
      `}</style>
    </form>
  );
}
