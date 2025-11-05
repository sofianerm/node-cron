# 🚀 Deployment Guide

Guide complet pour déployer PDF Quote Filler en production.

---

## 🎯 Plateformes Recommandées

### ⭐ Vercel (Recommandé)

**Pourquoi Vercel ?**
- Créé par l'équipe Next.js
- Déploiement zero-config
- Edge functions pour l'API
- Preview deployments automatiques
- Free tier généreux

**Déploiement en 2 minutes :**

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel
```

**Via l'interface web :**
1. Aller sur [vercel.com](https://vercel.com)
2. "Import Project"
3. Connecter votre repo GitHub
4. Click "Deploy" - c'est tout !

**Variables d'environnement :**
```bash
# Dans Vercel Dashboard → Settings → Environment Variables
GOOGLE_APPLICATION_CREDENTIALS=<base64-encoded-json>
```

---

### 🔷 Netlify

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Déployer
netlify deploy --prod
```

**Build settings :**
- Build command: `npm run build`
- Publish directory: `.next`

---

### 🐳 Docker

**Créer `Dockerfile` :**
```dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

**Créer `.dockerignore` :**
```
node_modules
.next
.git
*.md
.env.local
```

**Build et run :**
```bash
# Build
docker build -t pdf-quote-filler .

# Run
docker run -p 3000:3000 pdf-quote-filler
```

---

### ☁️ AWS (EC2 + Nginx)

**Setup EC2 instance :**
```bash
# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone et build
git clone <your-repo>
cd pdf-quote-filler
npm install
npm run build

# PM2 pour process management
npm install -g pm2
pm2 start npm --name "pdf-quote-filler" -- start
pm2 save
pm2 startup
```

**Nginx config :**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔐 Configuration Google Cloud Vision

### 1. Créer un projet Google Cloud

1. Aller sur [console.cloud.google.com](https://console.cloud.google.com)
2. Créer un nouveau projet
3. Activer Cloud Vision API
4. Créer une "Service Account"
5. Télécharger la clé JSON

### 2. Configuration selon la plateforme

**Vercel / Netlify :**
```bash
# Encoder le JSON en base64
cat credentials.json | base64 -w 0

# Ajouter comme env var
GOOGLE_APPLICATION_CREDENTIALS=<base64-string>
```

**Dans le code, décoder :**
```typescript
const credentials = JSON.parse(
  Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS!, 'base64').toString()
);
```

**Docker / EC2 :**
```bash
# Monter le fichier JSON
docker run -v /path/to/creds.json:/app/creds.json \
  -e GOOGLE_APPLICATION_CREDENTIALS=/app/creds.json \
  pdf-quote-filler
```

---

## 🔧 Variables d'Environnement

### Production

Créer `.env.production` :
```bash
# Google Cloud Vision
GOOGLE_APPLICATION_CREDENTIALS=/path/or/base64

# Next.js
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optionnel
NEXT_TELEMETRY_DISABLED=1
```

### Staging

Créer `.env.staging` :
```bash
# Même structure, URLs de staging
NEXT_PUBLIC_APP_URL=https://staging.your-domain.com
```

---

## 🧪 Pre-Deployment Checklist

### Code Quality
- [ ] `npm run build` réussit sans erreurs
- [ ] `npm run lint` passe sans warnings
- [ ] Types TypeScript sont valides
- [ ] Pas de console.log ou debuggers

### Configuration
- [ ] Variables d'environnement configurées
- [ ] Google Cloud credentials ajoutées
- [ ] URLs de production mises à jour

### Performance
- [ ] Bundle size < 200KB First Load JS
- [ ] Images optimisées (si applicable)
- [ ] Fonts optimisées

### Security
- [ ] Pas de secrets dans le code
- [ ] .env* dans .gitignore
- [ ] API routes protégées (si auth ajoutée)
- [ ] CORS configuré correctement

---

## 📊 Monitoring Post-Deployment

### Vercel Analytics

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Error Tracking (Sentry)

```bash
npm install @sentry/nextjs

npx @sentry/wizard@latest -i nextjs
```

### Performance Monitoring

```typescript
// lib/analytics.ts
export function trackEvent(name: string, data?: any) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, data);
  }
}

// Usage
trackEvent('pdf_uploaded', { size: file.size });
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Créer `.github/workflows/deploy.yml` :
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 🚨 Troubleshooting

### Build échoue sur Vercel

**Erreur : "Module not found"**
```bash
# S'assurer que toutes les deps sont dans dependencies, pas devDependencies
npm install <package> --save
```

**Erreur : "Out of memory"**
```json
// package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

### API OCR ne fonctionne pas

**Vérifier les credentials :**
```typescript
// app/api/ocr/route.ts
console.log('Credentials loaded:', !!process.env.GOOGLE_APPLICATION_CREDENTIALS);
```

**Tester localement :**
```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/creds.json
npm run dev
```

### PDF.js worker error

**Vérifier next.config.js :**
```javascript
webpack: (config) => {
  config.resolve.alias.canvas = false;
  return config;
}
```

---

## 📈 Scaling Considerations

### Performance
- **CDN** : Vercel inclut CDN global
- **Image optimization** : Utiliser next/image
- **API caching** : Cache les résultats OCR côté client

### Cost
- **Vercel Free** : 100GB bandwidth, suffisant pour commencer
- **Google Cloud Vision** : $1.50 per 1000 requests
- **Optimization** : Batch OCR requests si possible

### Database (Future)
Si vous ajoutez persistence :
- **Vercel Postgres** : Managed PostgreSQL
- **Supabase** : Open-source alternative
- **MongoDB Atlas** : Document storage

---

## ✅ Post-Deployment

1. **Tester le site live** avec un vrai PDF
2. **Configurer les DNS** pour votre domaine
3. **Activer HTTPS** (automatique sur Vercel)
4. **Configurer analytics** pour suivre l'usage
5. **Mettre en place monitoring** pour les erreurs

---

## 🎉 Vous êtes en production !

**Next steps :**
- Partager avec vos premiers users
- Collecter du feedback
- Itérer sur les features
- Monitorer les performances
- Optimiser selon les métriques

---

**Besoin d'aide ?** Ouvrez une issue sur GitHub avec le tag `deployment`.
