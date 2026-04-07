"use client";

/**
 * FormationInscriptionForm — Formulaire d'inscription multi-étapes
 * Adapté B2B (Entreprises) et B2C (Particuliers)
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Users,
  MapPin,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Send,
  Loader2,
  Hash,
  GraduationCap,
  Target,
  Calendar,
  Clock
} from "lucide-react";
import CTAButton from "@/components/ui/CTAButton";

const ORANGE = "#D35400";
const EASE = [0.6, 0.08, 0.02, 0.99] as const;

// Options pour les selects
const SECTEURS = [
  "Industrie",
  "Finance",
  "Santé",
  "Immobilier",
  "Commerce",
  "Éducation",
  "Autre"
];

const TAILLES_ENTREPRISE = [
  "Startup (< 50 collaborateurs)",
  "PME (50-250 collaborateurs)",
  "ETI (250-500 collaborateurs)",
  "Grande entreprise (500+ collaborateurs)"
];

const FONCTIONS = [
  "Directeur Général (DG)",
  "Directeur des Systèmes d'Information (DSI/CTO)",
  "Directeur des Ressources Humaines (DRH)",
  "Directeur Innovation/Digital",
  "Responsable Formation",
  "Manager/Chef de département",
  "Développeur/Ingénieur",
  "Étudiant",
  "Autre"
];

const FONCTIONS_B2C = [
  "Étudiant (Licence/Master)",
  "Étudiant Ingénieur",
  "Jeune diplômé (< 2 ans)",
  "Salarié en entreprise",
  "Développeur/Ingénieur",
  "Freelance/Consultant",
  "En reconversion professionnelle",
  "Demandeur d'emploi"
];

const VILLES = [
  "Casablanca",
  "Rabat",
  "Tanger",
  "Marrakech",
  "Fès",
  "Agadir",
  "Kenitra",
  "Oujda",
  "Autre ville (Maroc)",
  "Afrique francophone"
];

const TYPES_ENTREPRISE = [
  "PME marocaine",
  "ETI marocaine",
  "Filiale groupe international",
  "Grande entreprise",
  "Startup"
];

const BESOINS_B2B = [
  "Transformation digitale de l'entreprise",
  "Intégration de l'IA dans les processus",
  "Formation des équipes techniques",
  "Formation du management/décideurs",
  "Développement d'une solution sur mesure",
  "Accompagnement stratégique IA",
  "Audit et conseil"
];

const OBJECTIFS_B2C = [
  "Montée en compétences IA/Data",
  "Obtenir une certification",
  "Construire un portfolio de projets",
  "Améliorer mon employabilité",
  "Changer de carrière",
  "Lancer un projet personnel/startup",
  "Autre"
];

const NIVEAUX_ETUDES = [
  "Bac",
  "Bac+2 (DUT/BTS)",
  "Licence (Bac+3)",
  "Master (Bac+5)",
  "Ingénieur",
  "Doctorat",
  "Autre"
];

const EXPERIENCE_IA = [
  "Débutant (aucune expérience)",
  "Intermédiaire (quelques projets)",
  "Avancé (expérience significative)",
  "Expert (professionnel IA/Data)"
];

const FORMATS = [
  "Présentiel",
  "Distanciel",
  "Hybride",
  "E-learning"
];

const DISPONIBILITES = [
  "Immédiate (< 2 semaines)",
  "Dans 1 mois",
  "Dans 2-3 mois",
  "À planifier ensemble"
];

const PERIODES = [
  "En semaine (lundi-vendredi)",
  "Week-end (samedi-dimanche)",
  "Soir (après 18h)",
  "Journée complète"
];

const CANAUX_DECOUVERTE = [
  "Instagram",
  "LinkedIn",
  "YouTube",
  "Facebook",
  "Bouche-à-oreille",
  "Google",
  "Autre"
];

interface FormData {
  // Type de client
  typeClient: "B2C" | "B2B";

  // Informations personnelles
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  ville: string;

  // B2C spécifique
  age?: string;
  statutProfessionnel?: string;
  niveauEtudes?: string;
  experienceIA?: string;
  objectifPrincipal?: string;
  commentConnu?: string;

  // B2B spécifique
  entreprise?: string;
  secteurActivite?: string;
  tailleEntreprise?: string;
  fonctionDemandeur?: string;
  typeEntreprise?: string;
  nombreParticipants?: string;
  besoinPrincipal?: string;
  budgetFormation?: string;

  // Formation
  formationSouhaitee: string;
  formatsPreferes: string[];
  disponibilite: string;
  periodePreferee: string[];

  // Complémentaires
  message: string;
  dejaFormationACT: string;
  souhaitRecontact: string;

  // Consentements
  consentementRGPD: boolean;
  consentementMarketing: boolean;
  consentementPartage: boolean;
}

interface FormationInscriptionFormProps {
  formationTitle?: string;
  formationSlug?: string;
  onSuccess?: () => void;
}

export default function FormationInscriptionForm({
  formationTitle,
  formationSlug,
  onSuccess
}: FormationInscriptionFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState<FormData>({
    typeClient: "B2C",
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    ville: "",
    formationSouhaitee: formationTitle || "",
    formatsPreferes: [],
    disponibilite: "",
    periodePreferee: [],
    message: "",
    dejaFormationACT: "",
    souhaitRecontact: "",
    consentementRGPD: false,
    consentementMarketing: false,
    consentementPartage: false
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelect = (name: string, value: string) => {
    setFormData(prev => {
      const currentValues = prev[name as keyof FormData] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [name]: newValues };
    });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!formData.typeClient;
      case 2:
        return !!(formData.prenom && formData.nom && formData.email && formData.telephone && formData.ville);
      case 3:
        if (formData.typeClient === "B2C") {
          return !!(formData.age && formData.statutProfessionnel && formData.niveauEtudes &&
                   formData.experienceIA && formData.objectifPrincipal);
        } else {
          return !!(formData.entreprise && formData.secteurActivite && formData.tailleEntreprise &&
                   formData.fonctionDemandeur && formData.typeEntreprise && formData.nombreParticipants &&
                   formData.besoinPrincipal);
        }
      case 4:
        return formData.consentementRGPD;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      setErrorMessage("Veuillez remplir tous les champs obligatoires");
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(4)) {
      setErrorMessage("Veuillez accepter les conditions obligatoires");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/shopify/inscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          formationSlug,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'envoi");
      
      setStatus("success");
      if (onSuccess) onSuccess();

    } catch (error) {
      setStatus("error");
      setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const isB2B = formData.typeClient === "B2B";

  return (
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: `1px solid ${ORANGE}33`,
      borderRadius: "1rem",
      padding: "clamp(2rem, 4vw, 3rem)",
      position: "relative",
      overflow: "hidden",
      maxWidth: "900px",
      margin: "0 auto"
    }}>
      {/* Progress Bar */}
      <div style={{ marginBottom: "3rem" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem"
        }}>
          <h2 style={{
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            fontWeight: 900,
            color: "#fff",
            fontFamily: "var(--font-display)"
          }}>
            Inscription Formation
          </h2>
          <span style={{
            color: ORANGE,
            fontSize: "0.9rem",
            fontWeight: 700
          }}>
            Étape {currentStep}/{totalSteps}
          </span>
        </div>

        <div style={{
          width: "100%",
          height: "4px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "2px",
          overflow: "hidden"
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
            style={{
              height: "100%",
              background: `linear-gradient(90deg, ${ORANGE}, #E67E22)`,
              borderRadius: "2px"
            }}
          />
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "0.5rem",
            padding: "1rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem"
          }}
        >
          <AlertCircle size={24} color="#ef4444" />
          <p style={{ color: "#ef4444", margin: 0 }}>{errorMessage}</p>
        </motion.div>
      )}

      {/* Success Message */}
      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            textAlign: "center",
            padding: "3rem 2rem"
          }}
        >
          <CheckCircle2 size={64} color="#22c55e" style={{ margin: "0 auto 1.5rem" }} />
          <h3 style={{
            fontSize: "1.8rem",
            fontWeight: 900,
            color: "#22c55e",
            marginBottom: "1rem"
          }}>
            Inscription envoyée avec succès !
          </h3>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "0.5rem" }}>
            {isB2B
              ? "Un conseiller dédié vous contactera sous 24h ouvrées."
              : "Nous vous contacterons sous 48h ouvrées pour confirmer votre inscription."}
          </p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
            Un email de confirmation vous a été envoyé à : <strong style={{ color: ORANGE }}>{formData.email}</strong>
          </p>
        </motion.div>
      )}

      {/* Form Steps */}
      {status !== "success" && (
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {/* Step 1: Type de client */}
            {currentStep === 1 && (
              <StepWrapper key="step1">
                <StepTitle>Vous êtes :</StepTitle>
                <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                  {[
                    { value: "B2C", label: "Particulier", icon: User },
                    { value: "B2B", label: "Entreprise", icon: Building2 }
                  ].map(({ value, label, icon: Icon }) => (
                    <label
                      key={value}
                      style={{
                        flex: 1,
                        padding: "2rem 1.5rem",
                        border: `2px solid ${formData.typeClient === value ? ORANGE : "rgba(255,255,255,0.1)"}`,
                        borderRadius: "0.75rem",
                        background: formData.typeClient === value ? `${ORANGE}15` : "rgba(255,255,255,0.02)",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        textAlign: "center"
                      }}
                    >
                      <input
                        type="radio"
                        name="typeClient"
                        value={value}
                        checked={formData.typeClient === value}
                        onChange={handleChange}
                        style={{ display: "none" }}
                      />
                      <Icon size={48} color={formData.typeClient === value ? ORANGE : "rgba(255,255,255,0.3)"} style={{ margin: "0 auto 1rem" }} />
                      <span style={{
                        display: "block",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "1.2rem"
                      }}>
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </StepWrapper>
            )}

            {/* Step 2: Informations personnelles */}
            {currentStep === 2 && (
              <StepWrapper key="step2">
                <StepTitle>Vos coordonnées</StepTitle>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                  marginTop: "2rem"
                }}>
                  <FormField
                    icon={User}
                    label="Prénom"
                    name="prenom"
                    type="text"
                    value={formData.prenom}
                    onChange={handleChange}
                    required
                  />
                  <FormField
                    icon={User}
                    label="Nom"
                    name="nom"
                    type="text"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                  />
                  <FormField
                    icon={Mail}
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <FormField
                    icon={Phone}
                    label="Téléphone"
                    name="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="+212 6XX XXX XXX"
                    required
                  />
                  <FormSelect
                    icon={MapPin}
                    label="Ville"
                    name="ville"
                    value={formData.ville}
                    onChange={handleChange}
                    options={VILLES}
                    required
                  />
                </div>
              </StepWrapper>
            )}

            {/* Step 3: Profil B2C */}
            {currentStep === 3 && !isB2B && (
              <StepWrapper key="step3-b2c">
                <StepTitle>Votre profil</StepTitle>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                  marginTop: "2rem"
                }}>
                  <FormField
                    icon={Hash}
                    label="Âge"
                    name="age"
                    type="number"
                    value={formData.age || ""}
                    onChange={handleChange}
                    placeholder="Ex: 28"
                    required
                  />
                  <FormSelect
                    icon={Briefcase}
                    label="Statut professionnel"
                    name="statutProfessionnel"
                    value={formData.statutProfessionnel || ""}
                    onChange={handleChange}
                    options={FONCTIONS_B2C}
                    required
                  />
                  <FormSelect
                    icon={GraduationCap}
                    label="Niveau d'études"
                    name="niveauEtudes"
                    value={formData.niveauEtudes || ""}
                    onChange={handleChange}
                    options={NIVEAUX_ETUDES}
                    required
                  />
                  <FormSelect
                    icon={Target}
                    label="Expérience IA/Data"
                    name="experienceIA"
                    value={formData.experienceIA || ""}
                    onChange={handleChange}
                    options={EXPERIENCE_IA}
                    required
                  />
                  <div style={{ gridColumn: "1 / -1" }}>
                    <FormSelect
                      icon={Target}
                      label="Objectif principal"
                      name="objectifPrincipal"
                      value={formData.objectifPrincipal || ""}
                      onChange={handleChange}
                      options={OBJECTIFS_B2C}
                      required
                    />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <FormSelect
                      icon={MessageSquare}
                      label="Comment nous avez-vous connu ?"
                      name="commentConnu"
                      value={formData.commentConnu || ""}
                      onChange={handleChange}
                      options={CANAUX_DECOUVERTE}
                    />
                  </div>
                </div>
              </StepWrapper>
            )}

            {/* Step 3: Profil B2B */}
            {currentStep === 3 && isB2B && (
              <StepWrapper key="step3-b2b">
                <StepTitle>Votre entreprise</StepTitle>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                  marginTop: "2rem"
                }}>
                  <FormField
                    icon={Building2}
                    label="Nom de l'entreprise"
                    name="entreprise"
                    type="text"
                    value={formData.entreprise || ""}
                    onChange={handleChange}
                    required
                  />
                  <FormSelect
                    icon={Building2}
                    label="Secteur d'activité"
                    name="secteurActivite"
                    value={formData.secteurActivite || ""}
                    onChange={handleChange}
                    options={SECTEURS}
                    required
                  />
                  <FormSelect
                    icon={Users}
                    label="Taille de l'entreprise"
                    name="tailleEntreprise"
                    value={formData.tailleEntreprise || ""}
                    onChange={handleChange}
                    options={TAILLES_ENTREPRISE}
                    required
                  />
                  <FormSelect
                    icon={Briefcase}
                    label="Votre fonction"
                    name="fonctionDemandeur"
                    value={formData.fonctionDemandeur || ""}
                    onChange={handleChange}
                    options={FONCTIONS}
                    required
                  />
                  <FormSelect
                    icon={Building2}
                    label="Type d'entreprise"
                    name="typeEntreprise"
                    value={formData.typeEntreprise || ""}
                    onChange={handleChange}
                    options={TYPES_ENTREPRISE}
                    required
                  />
                  <FormField
                    icon={Users}
                    label="Nombre de participants"
                    name="nombreParticipants"
                    type="number"
                    value={formData.nombreParticipants || ""}
                    onChange={handleChange}
                    placeholder="Ex: 10"
                    required
                  />
                  <div style={{ gridColumn: "1 / -1" }}>
                    <FormSelect
                      icon={Target}
                      label="Besoin principal"
                      name="besoinPrincipal"
                      value={formData.besoinPrincipal || ""}
                      onChange={handleChange}
                      options={BESOINS_B2B}
                      required
                    />
                  </div>
                </div>
              </StepWrapper>
            )}

            {/* Step 4: Message + Consentements */}
            {currentStep === 4 && (
              <StepWrapper key="step4">
                <StepTitle>Finalisation de votre inscription</StepTitle>
                <div style={{ marginTop: "2rem" }}>
                  {/* Formation sélectionnée */}
                  {formationTitle && (
                    <div style={{ marginBottom: "2rem" }}>
                      <label style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontSize: "0.85rem",
                        color: ORANGE,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em"
                      }}>
                        <GraduationCap size={16} style={{ display: "inline", marginRight: "0.5rem" }} />
                        Formation sélectionnée
                      </label>
                      <div style={{
                        width: "100%",
                        padding: "0.875rem",
                        background: `${ORANGE}11`,
                        border: `2px solid ${ORANGE}`,
                        borderRadius: "0.5rem",
                        color: "#fff",
                        fontSize: "1rem",
                        fontWeight: 600,
                      }}>
                        {formationTitle}
                      </div>
                    </div>
                  )}

                  {/* Message / Compléments d'information */}
                  <div style={{ marginBottom: "2rem" }}>
                    <label style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontSize: "0.85rem",
                      color: ORANGE,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em"
                    }}>
                      <MessageSquare size={16} style={{ display: "inline", marginRight: "0.5rem" }} />
                      Compléments d'information (optionnel)
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Décrivez vos attentes, objectifs particuliers, disponibilités, contraintes..."
                      style={{
                        width: "100%",
                        padding: "1rem",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "0.5rem",
                        color: "#fff",
                        fontSize: "1rem",
                        fontFamily: "var(--font-body)",
                        resize: "vertical",
                        outline: "none"
                      }}
                    />
                  </div>

                  {/* Consentements */}
                  <CheckboxField
                    name="consentementRGPD"
                    checked={formData.consentementRGPD}
                    onChange={handleChange}
                    required
                  >
                    J'accepte que mes données personnelles soient collectées et traitées
                    par ACT dans le cadre de ma demande d'inscription.
                  </CheckboxField>

                  <CheckboxField
                    name="consentementMarketing"
                    checked={formData.consentementMarketing}
                    onChange={handleChange}
                    containerStyle={{ marginTop: "1rem" }}
                  >
                    J'accepte de recevoir des communications marketing d'ACT
                    (newsletters, offres de formations, événements)
                  </CheckboxField>

                  <CheckboxField
                    name="consentementPartage"
                    checked={formData.consentementPartage}
                    onChange={handleChange}
                    containerStyle={{ marginTop: "1rem" }}
                  >
                    J'accepte que mes données soient partagées avec des partenaires
                    d'ACT (organismes de certification, partenaires technologiques)
                  </CheckboxField>

                  <p style={{
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.4)",
                    marginTop: "1.5rem",
                    lineHeight: 1.5
                  }}>
                    Conformément au RGPD, vous disposez d'un droit d'accès, de rectification,
                    de suppression et de portabilité de vos données. Pour exercer ces droits,
                    contactez-nous à : contact@act-formation.ma
                  </p>
                </div>
              </StepWrapper>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div style={{
            display: "flex",
            gap: "1.5rem",
            marginTop: "3.5rem",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            {currentStep > 1 && (
              <CTAButton 
                onClick={prevStep}
                type="button"
                icon={<ArrowLeft size={18} />}
              >
                Précédent
              </CTAButton>
            )}

            <div style={{ marginLeft: "auto" }}>
              {currentStep < totalSteps ? (
                <CTAButton 
                  onClick={nextStep}
                  type="button"
                  icon={<ArrowRight size={18} />}
                  iconPosition="right"
                >
                  Suivant
                </CTAButton>
              ) : (
                <CTAButton 
                  type="submit"
                  className={status === "loading" ? "opacity-50 pointer-events-none" : ""}
                  icon={status === "loading" ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  iconPosition="right"
                >
                  {status === "loading" ? "Envoi..." : "Envoyer"}
                </CTAButton>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

// Composants réutilisables
function StepWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{
      fontSize: "1.5rem",
      fontWeight: 800,
      color: "#fff",
      marginBottom: "0.5rem",
      fontFamily: "var(--font-display)"
    }}>
      {children}
    </h3>
  );
}

function FormField({
  icon: Icon,
  label,
  name,
  type,
  value,
  onChange,
  required = false,
  placeholder = ""
}: {
  icon: any;
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label style={{
        display: "block",
        marginBottom: "0.5rem",
        fontSize: "0.85rem",
        color: ORANGE,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em"
      }}>
        <Icon size={16} style={{ display: "inline", marginRight: "0.5rem" }} />
        {label} {required && "*"}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "0.875rem",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "0.5rem",
          color: "#fff",
          fontSize: "1rem",
          outline: "none"
        }}
      />
    </div>
  );
}

function FormSelect({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  options,
  required = false
}: {
  icon: any;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label style={{
        display: "block",
        marginBottom: "0.5rem",
        fontSize: "0.85rem",
        color: ORANGE,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em"
      }}>
        <Icon size={16} style={{ display: "inline", marginRight: "0.5rem" }} />
        {label} {required && "*"}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: "100%",
          padding: "0.875rem",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "0.5rem",
          color: value ? "#fff" : "rgba(255,255,255,0.4)",
          fontSize: "1rem",
          outline: "none",
          cursor: "pointer"
        }}
      >
        <option value="" style={{ background: "#070E1C" }}>Sélectionner...</option>
        {options.map((opt) => (
          <option key={opt} value={opt} style={{ background: "#070E1C" }}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function MultiCheckbox({
  label,
  options,
  selected,
  onChange,
  containerStyle = {}
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (value: string) => void;
  containerStyle?: React.CSSProperties;
}) {
  return (
    <div style={containerStyle}>
      <label style={{
        display: "block",
        marginBottom: "0.75rem",
        fontSize: "0.85rem",
        color: ORANGE,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em"
      }}>
        {label} *
      </label>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "0.75rem"
      }}>
        {options.map((option) => (
          <label
            key={option}
            style={{
              padding: "0.75rem 1rem",
              background: selected.includes(option) ? `${ORANGE}22` : "rgba(255,255,255,0.03)",
              border: `1px solid ${selected.includes(option) ? ORANGE : "rgba(255,255,255,0.1)"}`,
              borderRadius: "0.5rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.9rem",
              color: "#fff"
            }}
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onChange(option)}
              style={{ accentColor: ORANGE }}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}

function RadioGroup({
  label,
  name,
  options,
  value,
  onChange,
  required = false,
  containerStyle = {}
}: {
  label: string;
  name: string;
  options: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  containerStyle?: React.CSSProperties;
}) {
  return (
    <div style={containerStyle}>
      <label style={{
        display: "block",
        marginBottom: "0.75rem",
        fontSize: "0.85rem",
        color: ORANGE,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em"
      }}>
        {label} {required && "*"}
      </label>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {options.map((option) => (
          <label
            key={option}
            style={{
              padding: "0.75rem 1rem",
              background: value === option ? `${ORANGE}22` : "rgba(255,255,255,0.03)",
              border: `1px solid ${value === option ? ORANGE : "rgba(255,255,255,0.1)"}`,
              borderRadius: "0.5rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.9rem",
              color: "#fff"
            }}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={onChange}
              required={required}
              style={{ accentColor: ORANGE }}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}

function CheckboxField({
  name,
  checked,
  onChange,
  required = false,
  containerStyle = {},
  children
}: {
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  containerStyle?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.75rem",
        cursor: "pointer",
        ...containerStyle
      }}
    >
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        required={required}
        style={{
          accentColor: ORANGE,
          marginTop: "0.25rem",
          width: "18px",
          height: "18px",
          cursor: "pointer"
        }}
      />
      <span style={{
        color: "rgba(255,255,255,0.7)",
        fontSize: "0.9rem",
        lineHeight: 1.5
      }}>
        {children} {required && <span style={{ color: ORANGE }}>*</span>}
      </span>
    </label>
  );
}
