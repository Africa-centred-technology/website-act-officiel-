# Spécifications - Formulaire d'Inscription aux Formations ACT

## 📋 Vue d'ensemble

Formulaire d'inscription adaptatif pour les formations ACT, ciblant à la fois les **entreprises (B2B)** et les **particuliers (B2C)** au Maroc et en Afrique francophone.

---

## 🎯 Cibles

### 3.1 Cible B2B (Entreprises)

| Critère | Détails |
|---------|---------|
| **Secteurs** | Industrie, Finance, Santé, Immobilier, Commerce, Éducation |
| **Taille entreprise** | PME et ETI marocaines (50-500 collaborateurs) + filiales de groupes internationaux |
| **Décideurs** | DSI, DRH, DG, Directeurs Innovation, Responsables Formation |
| **Besoins** | Transformation digitale, intégration IA, formation équipes, développement sur mesure |
| **Zone géographique** | Casablanca-Rabat (priorité), axe Tanger-Marrakech, Afrique francophone |

### 3.2 Cible B2C (Particuliers)

| Critère | Détails |
|---------|---------|
| **Profil** | Jeunes professionnels (25-40 ans), étudiants ingénieurs, développeurs en reconversion |
| **Motivations** | Montée en compétences IA/Data, certifications, portfolio projets, employabilité |
| **Canaux préférés** | Instagram, YouTube, LinkedIn, groupes Facebook/WhatsApp tech |
| **Langue** | Français + Darija (contenu vidéo), Français/Anglais (articles techniques) |

---

## 🏗️ Structure du Formulaire

### Étape 1 : Type de Client (Radio Buttons)

```
┌─────────────────────────────────────────┐
│  Vous êtes :                            │
│  ○ Particulier (B2C)                    │
│  ○ Entreprise (B2B)                     │
└─────────────────────────────────────────┘
```

**Comportement :** Le formulaire adapte dynamiquement les champs suivants selon la sélection.

---

### Étape 2 : Informations Personnelles (Tous)

| Champ | Type | Obligatoire | Placeholder |
|-------|------|-------------|-------------|
| **Prénom** | Text | ✅ Oui | ex: Mohammed |
| **Nom** | Text | ✅ Oui | ex: Benali |
| **Email** | Email | ✅ Oui | exemple@email.com |
| **Téléphone** | Tel | ✅ Oui | +212 6XX XXX XXX |
| **Ville** | Select | ✅ Oui | Voir liste ci-dessous |
| **Langue de préférence** | Select | ⬜ Non | Français / Darija / English |

**Options Ville :**
- Casablanca
- Rabat
- Tanger
- Marrakech
- Fès
- Agadir
- Kenitra
- Oujda
- Autre ville (Maroc)
- Afrique francophone (hors Maroc)

---

### Étape 3A : Profil B2C (Particuliers uniquement)

| Champ | Type | Obligatoire | Options/Placeholder |
|-------|------|-------------|---------------------|
| **Âge** | Number | ✅ Oui | 18-65 |
| **Statut professionnel** | Select | ✅ Oui | Voir liste ci-dessous |
| **Niveau d'études** | Select | ✅ Oui | Bac, Licence, Master, Ingénieur, Doctorat |
| **Expérience IA/Data** | Select | ✅ Oui | Débutant, Intermédiaire, Avancé, Expert |
| **Objectif principal** | Select | ✅ Oui | Voir liste ci-dessous |
| **Comment nous avez-vous connu ?** | Select | ⬜ Non | Instagram, LinkedIn, YouTube, Facebook, Bouche-à-oreille, Google, Autre |

**Options Statut professionnel :**
- Étudiant (Licence/Master)
- Étudiant Ingénieur
- Jeune diplômé (< 2 ans)
- Salarié en entreprise
- Développeur/Ingénieur
- Freelance/Consultant
- En reconversion professionnelle
- Demandeur d'emploi

**Options Objectif principal :**
- Montée en compétences IA/Data
- Obtenir une certification
- Construire un portfolio de projets
- Améliorer mon employabilité
- Changer de carrière
- Lancer un projet personnel/startup
- Autre

---

### Étape 3B : Profil B2B (Entreprises uniquement)

| Champ | Type | Obligatoire | Options/Placeholder |
|-------|------|-------------|---------------------|
| **Nom de l'entreprise** | Text | ✅ Oui | ex: Maroc Telecom |
| **Secteur d'activité** | Select | ✅ Oui | Industrie, Finance, Santé, Immobilier, Commerce, Éducation, Autre |
| **Taille de l'entreprise** | Select | ✅ Oui | Voir liste ci-dessous |
| **Fonction du demandeur** | Select | ✅ Oui | Voir liste ci-dessous |
| **Type d'entreprise** | Select | ✅ Oui | PME marocaine, ETI marocaine, Filiale groupe international, Grande entreprise, Startup |
| **Nombre de participants prévus** | Number | ✅ Oui | 1-100+ |
| **Besoin principal** | Select | ✅ Oui | Voir liste ci-dessous |
| **Budget formation (DH)** | Select | ⬜ Non | < 20K, 20K-50K, 50K-100K, 100K-200K, > 200K, À définir |

**Options Taille de l'entreprise :**
- Startup (< 50 collaborateurs)
- PME (50-250 collaborateurs)
- ETI (250-500 collaborateurs)
- Grande entreprise (> 500 collaborateurs)

**Options Fonction du demandeur :**
- Directeur Général (DG)
- Directeur des Systèmes d'Information (DSI/CTO)
- Directeur des Ressources Humaines (DRH)
- Directeur Innovation/Digital
- Responsable Formation
- Manager/Chef de département
- Autre

**Options Besoin principal :**
- Transformation digitale de l'entreprise
- Intégration de l'IA dans les processus
- Formation des équipes techniques
- Formation du management/décideurs
- Développement d'une solution sur mesure
- Accompagnement stratégique IA
- Audit et conseil

---

### Étape 4 : Choix de Formation (Tous)

| Champ | Type | Obligatoire | Notes |
|-------|------|-------------|-------|
| **Formation souhaitée** | Select/Autocomplete | ✅ Oui | Liste dynamique depuis la base de formations |
| **Format préféré** | Checkbox (multiple) | ✅ Oui | Présentiel, Distanciel, Hybride, E-learning |
| **Disponibilité** | Select | ✅ Oui | Immédiate, Dans 1 mois, Dans 2-3 mois, À planifier |
| **Période préférée** | Checkbox (multiple) | ⬜ Non | Semaine, Week-end, Soir |

---

### Étape 5 : Informations Complémentaires (Tous)

| Champ | Type | Obligatoire | Placeholder |
|-------|------|-------------|-------------|
| **Message / Besoins spécifiques** | Textarea | ⬜ Non | Décrivez vos attentes, contraintes, objectifs particuliers... |
| **Avez-vous déjà suivi une formation ACT ?** | Radio | ✅ Oui | Oui / Non |
| **Souhaitez-vous être recontacté pour un entretien ?** | Radio | ✅ Oui | Oui / Non / Je préfère un échange par email |

---

### Étape 6 : Consentements & Validation

#### Consentements RGPD

```
☑ J'accepte que mes données personnelles soient collectées et traitées
  par ACT dans le cadre de ma demande d'inscription. *

☐ J'accepte de recevoir des communications marketing d'ACT
  (newsletters, offres de formations, événements)

☐ J'accepte que mes données soient partagées avec des partenaires
  d'ACT (organismes de certification, partenaires technologiques)
```

**Note :** Ajouter un lien vers la politique de confidentialité

#### Bouton de soumission

```
┌────────────────────────────┐
│  📨 ENVOYER MA DEMANDE     │
└────────────────────────────┘
```

---

## 🎨 Spécifications UI/UX

### Design System

- **Couleur principale :** `#D35400` (Orange ACT)
- **Couleur secondaire :** `#E67E22`
- **Fond :** `#070E1C` (Bleu nuit)
- **Police titre :** `var(--font-display)` (Futura)
- **Police texte :** `var(--font-body)`

### Composants

1. **Progress Bar** : Indicateur d'étapes (1/6, 2/6, etc.)
2. **Form Fields** : Style cohérent avec border orange au focus
3. **Validation en temps réel** : Messages d'erreur sous les champs
4. **Animations** : Transitions Framer Motion entre les étapes
5. **Responsive** : Mobile-first, grilles adaptatives

### États du formulaire

| État | Affichage |
|------|-----------|
| **Idle** | Formulaire normal |
| **Loading** | Spinner + "Envoi en cours..." |
| **Success** | ✅ Message de confirmation + animation |
| **Error** | ❌ Message d'erreur + possibilité de réessayer |

### Messages de validation

#### Succès (B2C)
```
✅ Votre demande d'inscription a été envoyée avec succès !

Nous vous contacterons sous 48h ouvrées pour confirmer votre
inscription et vous communiquer les prochaines étapes.

Un email de confirmation vous a été envoyé à : exemple@email.com
```

#### Succès (B2B)
```
✅ Votre demande a été transmise à notre équipe !

Un conseiller dédié vous contactera sous 24h ouvrées pour :
• Analyser vos besoins spécifiques
• Proposer un programme sur mesure
• Établir un devis personnalisé

Email de confirmation envoyé à : exemple@entreprise.com
```

---

## 🔧 Spécifications Techniques

### Stack Technique

- **Framework :** Next.js 14+ (App Router)
- **Language :** TypeScript
- **Styling :** CSS-in-JS (styled-components inline)
- **Animations :** Framer Motion
- **Validation :** Zod ou React Hook Form
- **Icons :** Lucide React

### Structure Fichiers

```
src/
├── components/
│   └── formations/
│       ├── FormationInscriptionForm.tsx     (Composant principal)
│       ├── FormStep1TypeClient.tsx          (Étape 1)
│       ├── FormStep2InfosPersonnelles.tsx   (Étape 2)
│       ├── FormStep3ProfilB2C.tsx           (Étape 3A)
│       ├── FormStep3ProfilB2B.tsx           (Étape 3B)
│       ├── FormStep4ChoixFormation.tsx      (Étape 4)
│       ├── FormStep5Complementaires.tsx     (Étape 5)
│       ├── FormStep6Validation.tsx          (Étape 6)
│       └── FormProgressBar.tsx              (Barre de progression)
├── app/
│   └── api/
│       └── formations/
│           └── inscription/
│               └── route.ts                 (API endpoint)
└── lib/
    └── validations/
        └── inscriptionSchema.ts             (Schéma Zod)
```

### Types TypeScript

```typescript
type ClientType = "B2C" | "B2B";

interface FormDataBase {
  // Étape 1
  typeClient: ClientType;

  // Étape 2
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  ville: string;
  languePreference?: string;
}

interface FormDataB2C extends FormDataBase {
  typeClient: "B2C";
  age: number;
  statutProfessionnel: string;
  niveauEtudes: string;
  experienceIA: string;
  objectifPrincipal: string;
  commentConnu?: string;
}

interface FormDataB2B extends FormDataBase {
  typeClient: "B2B";
  entreprise: string;
  secteurActivite: string;
  tailleEntreprise: string;
  fonctionDemandeur: string;
  typeEntreprise: string;
  nombreParticipants: number;
  besoinPrincipal: string;
  budgetFormation?: string;
}

interface FormDataFormation {
  formationSouhaitee: string;
  formatsPreferes: string[];
  disponibilite: string;
  periodePreferee?: string[];
  message?: string;
  dejaFormationACT: boolean;
  souhaitRecontact: string;
  consentementRGPD: boolean;
  consentementMarketing: boolean;
  consentementPartage: boolean;
}

type FormDataComplete = (FormDataB2C | FormDataB2B) & FormDataFormation;
```

### API Endpoint

**POST** `/api/formations/inscription`

**Request Body :**
```json
{
  "typeClient": "B2C" | "B2B",
  "prenom": "string",
  "nom": "string",
  "email": "string",
  "telephone": "string",
  "ville": "string",
  // ... autres champs selon le type
}
```

**Response Success (200) :**
```json
{
  "success": true,
  "message": "Inscription enregistrée avec succès",
  "inscriptionId": "uuid-xxx-xxx",
  "emailSent": true
}
```

**Response Error (400/500) :**
```json
{
  "success": false,
  "error": "Message d'erreur",
  "details": {}
}
```

### Intégrations Backend

1. **Base de données :** Enregistrer dans une table `inscriptions_formations`
2. **Email :**
   - Email de confirmation à l'utilisateur
   - Email de notification à l'équipe ACT
   - Templates différents B2C / B2B
3. **CRM :** Synchroniser avec le CRM (optionnel)
4. **Analytics :** Tracker les conversions (Google Analytics, Meta Pixel)

### Sécurité

- ✅ Validation côté client ET serveur
- ✅ Protection CSRF
- ✅ Rate limiting (max 3 soumissions/heure/IP)
- ✅ Sanitisation des inputs
- ✅ Honeypot anti-spam (champ caché)
- ✅ reCAPTCHA v3 (optionnel, si spam détecté)

---

## 📊 Tracking & Analytics

### Événements à tracker

| Événement | Description |
|-----------|-------------|
| `form_started` | Utilisateur commence le formulaire |
| `form_step_completed` | Utilisateur complète une étape |
| `form_abandoned` | Utilisateur quitte sans finaliser |
| `form_submitted_success` | Soumission réussie |
| `form_submitted_error` | Erreur lors de la soumission |

### Données à analyser

- Taux d'abandon par étape
- Temps moyen de complétion
- Répartition B2C vs B2B
- Formations les plus demandées
- Sources de trafic
- Taux de conversion par ville/secteur

---

## 📧 Templates Email

### Email B2C (Confirmation)

**Sujet :** ✅ Votre demande d'inscription à {{formation_name}} - ACT

**Corps :**
```
Bonjour {{prenom}},

Merci pour votre intérêt pour la formation "{{formation_name}}" !

Nous avons bien reçu votre demande d'inscription. Notre équipe va
l'examiner et vous recontactera sous 48h ouvrées à l'adresse
{{email}} ou au {{telephone}}.

📋 RÉCAPITULATIF DE VOTRE DEMANDE
• Formation : {{formation_name}}
• Format préféré : {{format}}
• Disponibilité : {{disponibilite}}

🔗 PROCHAINES ÉTAPES
1. Validation de votre profil
2. Envoi du programme détaillé
3. Planification de la session
4. Confirmation d'inscription

En attendant, vous pouvez :
• Consulter notre catalogue complet : [lien]
• Rejoindre notre communauté LinkedIn : [lien]
• Découvrir nos ressources gratuites : [lien]

À très bientôt !
L'équipe ACT

---
Questions ? Contactez-nous : contact@act-formation.ma
```

### Email B2B (Confirmation)

**Sujet :** 🤝 Votre demande de formation entreprise - ACT

**Corps :**
```
Bonjour {{prenom}} {{nom}},

Merci pour la confiance accordée à ACT pour accompagner
{{entreprise}} dans sa transformation digitale.

Un conseiller dédié vous contactera sous 24h ouvrées pour :
✓ Analyser vos besoins spécifiques
✓ Proposer un programme sur mesure
✓ Établir un devis personnalisé

📊 VOTRE DEMANDE
• Entreprise : {{entreprise}} ({{secteur}}, {{taille}})
• Formation : {{formation_name}}
• Participants : {{nombre_participants}}
• Besoin principal : {{besoin}}

📞 VOTRE CONSEILLER
{{nom_conseiller}} - {{email_conseiller}} - {{tel_conseiller}}

📄 DOCUMENTS À PRÉVOIR
Pour accélérer le traitement, préparez si possible :
• Organigramme de l'équipe concernée
• Brief des objectifs business
• Contraintes de calendrier

Cordialement,
L'équipe ACT Business Solutions

---
ACT - Advanced Coding Technologies
www.act-formation.ma | contact@act-formation.ma
```

---

## 🚀 Phases de Déploiement

### Phase 1 : MVP (Minimum Viable Product)
- ✅ Formulaire basique avec champs essentiels
- ✅ Validation simple
- ✅ Email de confirmation
- ✅ Stockage en base de données

### Phase 2 : Améliorations UX
- ✅ Formulaire multi-étapes avec progression
- ✅ Validation en temps réel
- ✅ Animations Framer Motion
- ✅ Auto-sauvegarde (LocalStorage)

### Phase 3 : Intelligence
- ✅ Recommandation de formations basée sur le profil
- ✅ Calcul automatique de prix (B2B)
- ✅ Intégration CRM
- ✅ Dashboard admin pour gérer les inscriptions

### Phase 4 : Optimisation
- ✅ A/B testing sur les champs
- ✅ Analytics avancés
- ✅ Automatisation emails (séquences)
- ✅ Chatbot d'assistance

---

## ✅ Checklist de Développement

### Frontend
- [ ] Créer les composants d'étapes
- [ ] Implémenter la navigation multi-étapes
- [ ] Ajouter la validation Zod
- [ ] Intégrer les animations
- [ ] Tester la responsivité
- [ ] Gérer les états de chargement
- [ ] Implémenter l'auto-sauvegarde

### Backend
- [ ] Créer l'API route
- [ ] Valider les données côté serveur
- [ ] Créer la table BDD
- [ ] Implémenter l'envoi d'emails
- [ ] Ajouter le rate limiting
- [ ] Créer les logs d'audit
- [ ] Tester la sécurité

### Intégrations
- [ ] Configurer le service email (SendGrid/Brevo)
- [ ] Connecter au CRM (optionnel)
- [ ] Ajouter Google Analytics events
- [ ] Tester les webhooks (si applicable)

### Tests
- [ ] Tests unitaires (composants)
- [ ] Tests d'intégration (API)
- [ ] Tests E2E (Cypress/Playwright)
- [ ] Tests de charge
- [ ] Tests d'accessibilité (a11y)

---

## 📝 Notes Importantes

1. **RGPD :** Conformité stricte, droit à l'oubli, export de données
2. **Accessibilité :** ARIA labels, navigation clavier, contraste
3. **Performance :** Lazy loading, optimisation images, code splitting
4. **SEO :** Pas de contenu indexable (formulaire), mais meta tags de la page
5. **Maintenance :** Logger toutes les soumissions pour debug

---

## 🔗 Ressources

- [Next.js Forms Best Practices](https://nextjs.org/docs/guides/building-forms)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [RGPD - CNIL](https://www.cnil.fr/fr/reglement-europeen-protection-donnees)

---

**Version :** 1.0
**Date :** 2026-04-02
**Auteur :** Spécifications ACT Formation
**Contact :** dev@act-formation.ma
