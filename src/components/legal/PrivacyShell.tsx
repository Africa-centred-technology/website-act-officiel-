"use client";

const DARK     = "#0A1410";
const ORANGE   = "#D35400";
const LINE     = "rgba(255,255,255,0.07)";
const TXT      = "#FFFFFF";
const TXT_SOFT = "rgba(255,255,255,0.72)";
const TXT_MUTED = "rgba(255,255,255,0.45)";
const FONT_HEAD = "Futura, var(--font-display), 'Century Gothic', sans-serif";
const FONT_BODY = "var(--font-body), 'Poppins', system-ui, sans-serif";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ borderTop: `1px solid ${LINE}`, paddingTop: "2.5rem", marginTop: "2.5rem" }}>
      <h2 style={{
        fontFamily: FONT_HEAD,
        fontWeight: 800,
        fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)",
        color: ORANGE,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        marginBottom: "1.2rem",
      }}>
        {title}
      </h2>
      <div style={{ fontFamily: FONT_BODY, fontSize: "0.95rem", color: TXT_SOFT, lineHeight: 1.8 }}>
        {children}
      </div>
    </section>
  );
}

export default function PrivacyShell() {
  return (
    <div style={{
      minHeight: "100vh",
      background: DARK,
      color: TXT,
      fontFamily: FONT_BODY,
      paddingTop: "clamp(5rem, 9vh, 7rem)",
    }}>
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "clamp(3rem, 6vw, 5rem) clamp(1.5rem, 6vw, 3rem) clamp(5rem, 8vw, 7rem)" }}>

        {/* Header */}
        <p style={{ fontFamily: FONT_HEAD, fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase", color: ORANGE, marginBottom: "1.2rem" }}>
          Documents légaux
        </p>
        <h1 style={{ fontFamily: FONT_HEAD, fontWeight: 900, fontSize: "clamp(2.2rem, 4vw, 3.5rem)", textTransform: "uppercase", lineHeight: 1.05, marginBottom: "1rem" }}>
          Politique de<br /><span style={{ color: ORANGE }}>Confidentialité</span>
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: "0.85rem", color: TXT_MUTED, marginBottom: "0.5rem" }}>
          Dernière mise à jour : mai 2026
        </p>
        <p style={{ fontFamily: FONT_BODY, fontSize: "0.95rem", color: TXT_SOFT, lineHeight: 1.8, maxWidth: "640px" }}>
          Africa Centred Technology (ACT) s'engage à protéger la confidentialité de vos données personnelles, conformément à la loi marocaine 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, et au Règlement Général sur la Protection des Données (RGPD) de l'Union Européenne.
        </p>

        {/* Sections */}
        <Section title="1. Responsable du traitement">
          <p><strong style={{ color: TXT }}>Africa Centred Technology (ACT)</strong><br />
          Casablanca, Maroc<br />
          Email : <a href="mailto:contact@a-ct.ma" style={{ color: ORANGE }}>contact@a-ct.ma</a><br />
          Site web : <a href="https://www.a-ct.ma" style={{ color: ORANGE }}>www.a-ct.ma</a></p>
        </Section>

        <Section title="2. Données collectées">
          <p>Nous collectons les données suivantes dans le cadre de nos activités :</p>
          <ul style={{ marginTop: "0.8rem", paddingLeft: "1.4rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li><strong style={{ color: TXT }}>Formulaire de contact</strong> : nom, prénom, email, nom de l'entreprise, message.</li>
            <li><strong style={{ color: TXT }}>Newsletter</strong> : adresse email.</li>
            <li><strong style={{ color: TXT }}>Inscriptions aux formations</strong> : nom, prénom, email, téléphone, informations professionnelles.</li>
            <li><strong style={{ color: TXT }}>Données de navigation</strong> : adresse IP, type de navigateur, pages visitées, durée de session (via cookies analytics).</li>
            <li><strong style={{ color: TXT }}>Candidatures (Carrières)</strong> : CV, lettre de motivation, coordonnées.</li>
          </ul>
        </Section>

        <Section title="3. Finalités du traitement">
          <ul style={{ paddingLeft: "1.4rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li>Traiter vos demandes de contact et vous apporter une réponse adaptée.</li>
            <li>Gérer les inscriptions aux formations et créer les commandes associées.</li>
            <li>Vous envoyer notre newsletter (avec votre consentement préalable).</li>
            <li>Améliorer l'expérience utilisateur sur notre site.</li>
            <li>Gérer les candidatures spontanées et les recrutements.</li>
            <li>Respecter nos obligations légales et contractuelles.</li>
          </ul>
        </Section>

        <Section title="4. Base légale du traitement">
          <ul style={{ paddingLeft: "1.4rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li><strong style={{ color: TXT }}>Consentement</strong> : inscription à la newsletter, dépôt de cookies non essentiels.</li>
            <li><strong style={{ color: TXT }}>Exécution d'un contrat</strong> : traitement des inscriptions aux formations.</li>
            <li><strong style={{ color: TXT }}>Intérêt légitime</strong> : réponse aux demandes de contact, amélioration du site.</li>
            <li><strong style={{ color: TXT }}>Obligation légale</strong> : conservation des données de facturation.</li>
          </ul>
        </Section>

        <Section title="5. Durée de conservation">
          <ul style={{ paddingLeft: "1.4rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li><strong style={{ color: TXT }}>Données de contact</strong> : 3 ans après le dernier contact.</li>
            <li><strong style={{ color: TXT }}>Newsletter</strong> : jusqu'à désinscription.</li>
            <li><strong style={{ color: TXT }}>Inscriptions aux formations</strong> : 5 ans (obligations comptables).</li>
            <li><strong style={{ color: TXT }}>Candidatures</strong> : 2 ans après la réception du CV.</li>
            <li><strong style={{ color: TXT }}>Cookies analytics</strong> : 13 mois maximum.</li>
          </ul>
        </Section>

        <Section title="6. Destinataires des données">
          <p>Vos données peuvent être transmises aux prestataires suivants, dans le strict cadre de leurs missions :</p>
          <ul style={{ marginTop: "0.8rem", paddingLeft: "1.4rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li><strong style={{ color: TXT }}>Shopify</strong> (gestion des commandes de formation) — États-Unis, clause contractuelles types.</li>
            <li><strong style={{ color: TXT }}>Resend</strong> (envoi d'emails transactionnels) — États-Unis, clause contractuelles types.</li>
            <li><strong style={{ color: TXT }}>Vercel</strong> (hébergement du site web) — États-Unis, clause contractuelles types.</li>
          </ul>
          <p style={{ marginTop: "1rem" }}>Aucune donnée n'est vendue ou cédée à des tiers à des fins commerciales.</p>
        </Section>

        <Section title="7. Cookies">
          <p>Notre site utilise des cookies pour les finalités suivantes :</p>
          <ul style={{ marginTop: "0.8rem", paddingLeft: "1.4rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li><strong style={{ color: TXT }}>Cookies essentiels</strong> : indispensables au fonctionnement du site (authentification, panier). Pas de consentement requis.</li>
            <li><strong style={{ color: TXT }}>Cookies analytics</strong> : mesure d'audience anonymisée. Dépôt soumis à consentement.</li>
          </ul>
          <p style={{ marginTop: "1rem" }}>Vous pouvez gérer vos préférences via le bandeau de cookies ou les paramètres de votre navigateur.</p>
        </Section>

        <Section title="8. Vos droits">
          <p>Conformément à la loi 09-08 et au RGPD, vous disposez des droits suivants :</p>
          <ul style={{ marginTop: "0.8rem", paddingLeft: "1.4rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li><strong style={{ color: TXT }}>Droit d'accès</strong> : obtenir une copie de vos données.</li>
            <li><strong style={{ color: TXT }}>Droit de rectification</strong> : corriger des données inexactes.</li>
            <li><strong style={{ color: TXT }}>Droit à l'effacement</strong> : demander la suppression de vos données.</li>
            <li><strong style={{ color: TXT }}>Droit à la limitation</strong> : restreindre le traitement de vos données.</li>
            <li><strong style={{ color: TXT }}>Droit d'opposition</strong> : s'opposer à certains traitements.</li>
            <li><strong style={{ color: TXT }}>Droit à la portabilité</strong> : recevoir vos données dans un format structuré.</li>
          </ul>
          <p style={{ marginTop: "1rem" }}>Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@a-ct.ma" style={{ color: ORANGE }}>contact@a-ct.ma</a></p>
        </Section>

        <Section title="9. Sécurité">
          <p>ACT met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, divulgation, altération ou destruction : chiffrement des communications (HTTPS), contrôle des accès, journalisation des traitements.</p>
        </Section>

        <Section title="10. Modifications">
          <p>Cette politique peut être mise à jour à tout moment. En cas de modification substantielle, nous vous en informerons par email ou via un avis sur le site. La version en vigueur est toujours disponible à l'adresse <a href="https://www.a-ct.ma/fr/privacy" style={{ color: ORANGE }}>www.a-ct.ma/fr/privacy</a>.</p>
        </Section>

        <Section title="11. Contact & réclamation">
          <p>Pour toute question ou réclamation relative au traitement de vos données personnelles :<br />
          Email : <a href="mailto:contact@a-ct.ma" style={{ color: ORANGE }}>contact@a-ct.ma</a><br />
          Vous avez également le droit d'introduire une réclamation auprès de la Commission Nationale de Contrôle de la Protection des Données à Caractère Personnel (CNDP) du Maroc.</p>
        </Section>

      </div>
    </div>
  );
}
