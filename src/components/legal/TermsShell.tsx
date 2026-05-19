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

export default function TermsShell() {
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
          Conditions Générales<br /><span style={{ color: ORANGE }}>d'Utilisation</span>
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: "0.85rem", color: TXT_MUTED, marginBottom: "0.5rem" }}>
          Dernière mise à jour : mai 2026
        </p>
        <p style={{ fontFamily: FONT_BODY, fontSize: "0.95rem", color: TXT_SOFT, lineHeight: 1.8, maxWidth: "640px" }}>
          Les présentes conditions générales d'utilisation régissent l'accès et l'utilisation du site web d'Africa Centred Technology (ACT), accessible à l'adresse <a href="https://www.a-ct.ma" style={{ color: ORANGE }}>www.a-ct.ma</a>. En accédant à ce site, vous acceptez sans réserve les présentes CGU.
        </p>

        {/* Sections */}
        <Section title="1. Éditeur du site">
          <p><strong style={{ color: TXT }}>Africa Centred Technology (ACT)</strong><br />
          Société de conseil en intelligence artificielle et transformation digitale<br />
          Casablanca, Maroc<br />
          Email : <a href="mailto:contact@a-ct.ma" style={{ color: ORANGE }}>contact@a-ct.ma</a><br />
          Site web : <a href="https://www.a-ct.ma" style={{ color: ORANGE }}>www.a-ct.ma</a></p>
        </Section>

        <Section title="2. Objet">
          <p>Le site www.a-ct.ma a pour objet de présenter les activités d'ACT, notamment :</p>
          <ul style={{ marginTop: "0.8rem", paddingLeft: "1.4rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li>Les services de conseil en intelligence artificielle, transformation digitale et ingénierie logicielle.</li>
            <li>Le catalogue de formations en data science, machine learning et IA agentique.</li>
            <li>Les réalisations et études de cas.</li>
            <li>Le blog et les ressources éditoriales.</li>
          </ul>
        </Section>

        <Section title="3. Accès au site">
          <p>Le site est accessible gratuitement à tout utilisateur disposant d'un accès à Internet. ACT se réserve le droit de modifier, suspendre ou interrompre l'accès au site à tout moment, notamment pour des opérations de maintenance, sans préavis ni indemnité.</p>
        </Section>

        <Section title="4. Propriété intellectuelle">
          <p>L'ensemble du contenu du site (textes, images, vidéos, logos, graphismes, architecture, code source) est la propriété exclusive d'Africa Centred Technology ou de ses partenaires, et est protégé par les lois marocaines et internationales relatives à la propriété intellectuelle.</p>
          <p style={{ marginTop: "0.8rem" }}>Toute reproduction, représentation, modification, publication ou transmission, totale ou partielle, du contenu du site est interdite sans l'autorisation écrite préalable d'ACT.</p>
        </Section>

        <Section title="5. Inscriptions aux formations">
          <p>Les inscriptions aux formations via le site sont soumises à des conditions spécifiques communiquées lors du processus d'inscription. La validation d'une inscription vaut acceptation des conditions tarifaires et pédagogiques associées. ACT se réserve le droit d'annuler ou de reprogrammer une formation en cas de nombre insuffisant de participants.</p>
        </Section>

        <Section title="6. Responsabilité">
          <p>ACT s'efforce d'assurer l'exactitude et la mise à jour des informations publiées sur le site. Cependant, ACT ne peut garantir l'exhaustivité, l'exactitude ou l'actualité de toutes les informations et décline toute responsabilité pour :</p>
          <ul style={{ marginTop: "0.8rem", paddingLeft: "1.4rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li>Les erreurs ou omissions dans le contenu du site.</li>
            <li>Les interruptions ou indisponibilités du site.</li>
            <li>Les dommages directs ou indirects résultant de l'utilisation du site.</li>
            <li>Le contenu des sites tiers vers lesquels des liens peuvent pointer.</li>
          </ul>
        </Section>

        <Section title="7. Liens hypertextes">
          <p>Le site peut contenir des liens vers des sites tiers. Ces liens sont fournis à titre informatif. ACT n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou leurs pratiques en matière de données personnelles.</p>
          <p style={{ marginTop: "0.8rem" }}>La création de liens vers le site d'ACT est autorisée sous réserve que ces liens ne soient pas de nature à porter atteinte à l'image de la société.</p>
        </Section>

        <Section title="8. Données personnelles">
          <p>Le traitement des données personnelles collectées via le site est décrit dans notre <a href="/fr/privacy" style={{ color: ORANGE }}>Politique de Confidentialité</a>, conforme à la loi marocaine 09-08 et au RGPD.</p>
        </Section>

        <Section title="9. Cookies">
          <p>L'utilisation des cookies sur ce site est décrite dans notre <a href="/fr/privacy" style={{ color: ORANGE }}>Politique de Confidentialité</a>. Vous pouvez paramétrer votre navigateur pour refuser les cookies, ce qui peut affecter certaines fonctionnalités du site.</p>
        </Section>

        <Section title="10. Droit applicable et juridiction">
          <p>Les présentes CGU sont régies par le droit marocain. En cas de litige relatif à l'interprétation ou à l'exécution des présentes conditions, et à défaut de résolution amiable, les tribunaux compétents de Casablanca seront seuls compétents.</p>
        </Section>

        <Section title="11. Modification des CGU">
          <p>ACT se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entrent en vigueur dès leur mise en ligne. Il est conseillé de consulter régulièrement cette page. La version en vigueur est celle accessible à l'adresse <a href="https://www.a-ct.ma/fr/terms" style={{ color: ORANGE }}>www.a-ct.ma/fr/terms</a>.</p>
        </Section>

        <Section title="12. Contact">
          <p>Pour toute question relative aux présentes CGU : <a href="mailto:contact@a-ct.ma" style={{ color: ORANGE }}>contact@a-ct.ma</a></p>
        </Section>

      </div>
    </div>
  );
}
