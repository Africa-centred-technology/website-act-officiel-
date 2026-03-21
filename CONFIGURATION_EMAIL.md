# Configuration de l'envoi d'emails 📧

Le formulaire de contact du site envoie automatiquement les demandes vers **aldrin.djourobi@a-ct.ma**.

## Prérequis

Le site utilise **Resend** pour l'envoi d'emails. Resend offre :
- ✅ 100 emails/jour gratuits
- ✅ Configuration simple
- ✅ API moderne et fiable
- ✅ Support des domaines personnalisés

## Configuration étape par étape

### 1. Créer un compte Resend (gratuit)

1. Visitez [https://resend.com/signup](https://resend.com/signup)
2. Créez un compte gratuit
3. Vérifiez votre email

### 2. Obtenir votre clé API

1. Connectez-vous à [https://resend.com/api-keys](https://resend.com/api-keys)
2. Cliquez sur **"Create API Key"**
3. Donnez-lui un nom (ex: "ACT Website Production")
4. Copiez la clé (elle ne sera affichée qu'une fois)

### 3. Configurer les variables d'environnement

#### En développement local :

Modifiez le fichier `.env.local` :

```env
RESEND_API_KEY=re_votre_vraie_clé_ici
```

#### En production (Vercel, Netlify, etc.) :

Ajoutez la variable d'environnement dans votre plateforme de déploiement :

**Vercel :**
1. Projet → Settings → Environment Variables
2. Ajoutez `RESEND_API_KEY` avec votre clé

**Netlify :**
1. Site settings → Environment variables
2. Ajoutez `RESEND_API_KEY` avec votre clé

### 4. Configuration du domaine d'envoi (Optionnel mais recommandé)

Par défaut, les emails sont envoyés depuis `noreply@a-ct.ma`. Pour que cela fonctionne en production :

1. Dans Resend, allez dans **Domains**
2. Ajoutez votre domaine `a-ct.ma`
3. Configurez les enregistrements DNS (SPF, DKIM, DMARC)
4. Vérifiez le domaine

Si vous ne configurez pas de domaine, Resend utilisera un domaine de test (emails limités).

## Test du formulaire

### En local :

1. Lancez le serveur de développement :
   ```bash
   npm run dev
   # ou
   bun dev
   ```

2. Allez sur [http://localhost:3000/contact](http://localhost:3000/contact)

3. Remplissez et soumettez le formulaire

4. Vérifiez les logs dans votre terminal pour voir si l'email est envoyé

### En production :

1. Déployez le site avec la variable d'environnement configurée
2. Testez le formulaire sur votre site en production
3. Vérifiez la boîte mail **aldrin.djourobi@a-ct.ma**

## Format de l'email reçu

Les emails reçus contiennent :

- 👤 Nom complet
- 📧 Email (configuré en Reply-To pour répondre facilement)
- 🏢 Entreprise
- 📱 Téléphone
- 🎯 Type de projet
- 💰 Budget estimé
- 💬 Message détaillé
- 📅 Date et heure de réception

## Dépannage

### Erreur "Configuration email manquante"

➡️ La clé API n'est pas configurée. Vérifiez que `RESEND_API_KEY` est bien définie dans `.env.local` (dev) ou dans les variables d'environnement (prod).

### Erreur "Erreur lors de l'envoi de l'email"

➡️ Vérifiez :
1. Que la clé API est valide
2. Que vous n'avez pas dépassé la limite gratuite (100/jour)
3. Les logs de Resend : [https://resend.com/logs](https://resend.com/logs)

### Les emails arrivent en spam

➡️ Configurez un domaine personnalisé avec SPF/DKIM/DMARC pour améliorer la délivrabilité.

### Comment changer l'adresse de destination ?

Modifiez le fichier `/src/app/api/contact/route.ts` ligne 71 :

```typescript
to: ["nouvelle.adresse@exemple.com"],
```

## Support

Pour toute question sur Resend : [https://resend.com/docs](https://resend.com/docs)

---

✅ Une fois configuré, le formulaire enverra automatiquement tous les messages vers **aldrin.djourobi@a-ct.ma** !
