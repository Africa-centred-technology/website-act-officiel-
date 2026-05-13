---
name: "skills"
description: "Hub central — liste tous les skills disponibles et charge celui que l'utilisateur sélectionne."
---

# /skills — Hub Central des Skills

Portail d'accès à tous les skills disponibles dans ce projet.

## Usage

```
/skills                        # Affiche le menu complet
/skills ceo-advisor            # Charge directement le skill ceo-advisor
/skills autoresearch           # Charge le skill autoresearch
/skills seo-audit              # Charge le skill seo-audit
```

## Ce que tu fais

### Si un argument est fourni

Cherche le skill correspondant dans la liste ci-dessous, lis son `SKILL.md`, et exécute-le immédiatement selon ses instructions.

### Si aucun argument (mode menu)

Affiche ce menu catégorisé et demande à l'utilisateur de choisir :

---

## Catalogue des Skills

### 🤖 Engineering
| Skill | Description | Commande |
|-------|-------------|---------|
| `autoresearch` | Boucle d'optimisation autonome par métrique | `/ar:setup` |
| `agent-designer` | Conception d'agents IA | `skills/claude-skills-main/engineering/agent-designer/SKILL.md` |
| `api-design-reviewer` | Revue et amélioration d'API | `skills/claude-skills-main/engineering/api-design-reviewer/SKILL.md` |
| `codebase-onboarding` | Onboarding rapide sur une codebase | `skills/claude-skills-main/engineering/codebase-onboarding/SKILL.md` |
| `database-designer` | Conception de schémas de base de données | `skills/claude-skills-main/engineering/database-designer/SKILL.md` |
| `docker-development` | Setup Docker et containerisation | `skills/claude-skills-main/engineering/docker-development/SKILL.md` |
| `performance-profiler` | Analyse et optimisation des performances | `skills/claude-skills-main/engineering/performance-profiler/SKILL.md` |
| `pr-review-expert` | Revue de Pull Request approfondie | `skills/claude-skills-main/engineering/pr-review-expert/SKILL.md` |
| `migration-architect` | Planification de migrations | `skills/claude-skills-main/engineering/migration-architect/SKILL.md` |
| `mcp-server-builder` | Construction de serveurs MCP | `skills/claude-skills-main/engineering/mcp-server-builder/SKILL.md` |
| `tech-debt-tracker` | Suivi et priorisation de la dette technique | `skills/claude-skills-main/engineering/tech-debt-tracker/SKILL.md` |
| `observability-designer` | Monitoring, logs, alerting | `skills/claude-skills-main/engineering/observability-designer/SKILL.md` |

### 📈 Marketing
| Skill | Description | Fichier |
|-------|-------------|---------|
| `seo-audit` | Audit SEO complet | `skills/claude-skills-main/marketing-skill/seo-audit/SKILL.md` |
| `copywriting` | Copywriting persuasif | `skills/claude-skills-main/marketing-skill/copywriting/SKILL.md` |
| `content-strategy` | Stratégie de contenu | `skills/claude-skills-main/marketing-skill/content-strategy/SKILL.md` |
| `email-sequence` | Séquences email | `skills/claude-skills-main/marketing-skill/email-sequence/SKILL.md` |
| `launch-strategy` | Stratégie de lancement produit | `skills/claude-skills-main/marketing-skill/launch-strategy/SKILL.md` |
| `paid-ads` | Publicité payante (Google, Meta) | `skills/claude-skills-main/marketing-skill/paid-ads/SKILL.md` |
| `social-content` | Contenu réseaux sociaux | `skills/claude-skills-main/marketing-skill/social-content/SKILL.md` |
| `pricing-strategy` | Stratégie de pricing | `skills/claude-skills-main/marketing-skill/pricing-strategy/SKILL.md` |
| `cold-email` | Campagnes cold email | `skills/claude-skills-main/marketing-skill/cold-email/SKILL.md` |
| `brand-guidelines` | Guidelines de marque | `skills/claude-skills-main/marketing-skill/brand-guidelines/SKILL.md` |

### 🏛️ C-Level / Direction
| Skill | Description | Fichier |
|-------|-------------|---------|
| `ceo-advisor` | Conseiller CEO stratégique | `skills/claude-skills-main/c-level-advisor/ceo-advisor/SKILL.md` |
| `cto-advisor` | Conseiller CTO | `skills/claude-skills-main/c-level-advisor/cto-advisor/SKILL.md` |
| `cmo-advisor` | Conseiller CMO | `skills/claude-skills-main/c-level-advisor/cmo-advisor/SKILL.md` |
| `cfo-advisor` | Conseiller CFO | `skills/claude-skills-main/c-level-advisor/cfo-advisor/SKILL.md` |
| `founder-coach` | Coaching fondateur | `skills/claude-skills-main/c-level-advisor/founder-coach/SKILL.md` |
| `board-deck-builder` | Construction de board deck | `skills/claude-skills-main/c-level-advisor/board-deck-builder/SKILL.md` |
| `competitive-intel` | Intelligence compétitive | `skills/claude-skills-main/c-level-advisor/competitive-intel/SKILL.md` |
| `executive-mentor` | Mentorat exécutif | `skills/claude-skills-main/c-level-advisor/executive-mentor/SKILL.md` |
| `scenario-war-room` | War room scénarios stratégiques | `skills/claude-skills-main/c-level-advisor/scenario-war-room/SKILL.md` |
| `intl-expansion` | Expansion internationale | `skills/claude-skills-main/c-level-advisor/intl-expansion/SKILL.md` |

---

## Comment charger un skill

Quand l'utilisateur sélectionne un skill (par numéro, nom, ou argument) :

1. Lis le fichier `SKILL.md` correspondant dans la colonne "Fichier"
2. Présente à l'utilisateur ce que ce skill fait et comment l'utiliser
3. Exécute-le selon ses propres instructions internes

**Exemple :** si l'utilisateur tape `/skills ceo-advisor`, lis `skills/claude-skills-main/c-level-advisor/ceo-advisor/SKILL.md` et active ce skill immédiatement.
