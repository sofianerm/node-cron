# ⚡ Quick Start Guide

Démarrez avec PDF Quote Filler en 5 minutes.

---

## 🚀 Installation Express

```bash
# 1. Cloner le repo
git clone <your-repo-url>
cd pdf-quote-filler

# 2. Installer les dépendances
npm install

# 3. Lancer en mode développement
npm run dev
```

**✨ C'est tout !** Ouvrez [http://localhost:3000](http://localhost:3000)

---

## 🎯 Premier Test

### 1. Préparez un PDF de test

Créez un PDF simple avec :
```
Description          Quantité    Prix Unit.    Total
Item A               5
Item B               10
Item C               3
```

### 2. Utilisez l'app

**Upload**
- Glissez-déposez votre PDF dans la zone d'upload

**Définir les colonnes**
- Cliquez 3 fois sur le PDF pour tracer des lignes verticales :
  1. Au milieu de la colonne "Quantité"
  2. Au milieu de la colonne "Prix Unit."
  3. Au milieu de la colonne "Total"

**Détecter**
- Cliquez sur "Détecter les quantités"
- L'app trouve automatiquement : 5, 10, 3

**Remplir**
- Entrez les prix unitaires : 10.00, 15.50, 8.75
- Les totaux se calculent automatiquement : 50.00, 155.00, 26.25
- Total général : **231.25**

---

## 🛠️ Scripts Disponibles

```bash
# Développement
npm run dev          # Lance le serveur dev sur :3000

# Production
npm run build        # Build l'app pour production
npm run start        # Lance le serveur prod

# Code quality
npm run lint         # Lint avec ESLint
```

---

## 📁 Structure Rapide

```
pdf-quote-filler/
├── app/              # Pages Next.js + API routes
├── components/       # Composants React
├── lib/              # Utilitaires
├── store/            # State Zustand
├── types/            # Types TypeScript
└── public/           # Assets statiques
```

**Les fichiers clés :**
- `app/page.tsx` - Page principale
- `store/useStore.ts` - État global
- `components/PDFViewer.tsx` - Affichage PDF
- `app/api/ocr/route.ts` - API OCR

---

## 🎨 Personnalisation Rapide

### Changer les couleurs

Dans `tailwind.config.ts` :
```typescript
theme: {
  extend: {
    colors: {
      primary: '#votre-couleur',
    }
  }
}
```

### Changer la langue

Dans les composants, remplacez les strings français par votre langue.

### Ajouter un logo

```typescript
// app/page.tsx
import Image from 'next/image';

<Image src="/logo.png" alt="Logo" width={40} height={40} />
```

---

## 🔌 Activer l'OCR Google Cloud Vision

### 1. Setup Google Cloud

```bash
# Installer le client
npm install @google-cloud/vision

# Créer le fichier de credentials
# Téléchargez depuis Google Cloud Console
```

### 2. Configuration

```bash
# .env.local
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
```

### 3. Activer le code

Dans `app/api/ocr/route.ts`, décommentez :
```typescript
import vision from '@google-cloud/vision';
// ... code OCR réel
```

---

## 🐛 Dépannage

### Le PDF ne s'affiche pas
- Vérifiez la console : PDF.js worker est chargé ?
- Essayez un PDF plus simple

### L'OCR ne détecte rien
- En mode dev, utilisez le mock OCR
- Vérifiez que les colonnes sont bien définies
- Les quantités doivent être des nombres clairs

### Le build échoue
```bash
# Nettoyer et réinstaller
rm -rf node_modules .next
npm install
npm run build
```

### Erreur de types TypeScript
```bash
# Régénérer les types Next.js
rm -rf .next
npm run dev
```

---

## 📚 Ressources

- **README.md** - Vue d'ensemble et features
- **ARCHITECTURE.md** - Architecture détaillée
- **CONTRIBUTING.md** - Guide de contribution

---

## 💡 Tips

### Raccourcis développement

```typescript
// Store dans la console Chrome
window.__store = useStore.getState()

// Réinitialiser rapidement
useStore.getState().reset()
```

### Debug OCR

Ajoutez des logs dans `app/api/ocr/route.ts` :
```typescript
console.log('Detected quantities:', quantities);
```

### Test avec différents PDFs

L'app fonctionne mieux avec :
- ✅ PDFs texte (pas scannés)
- ✅ Colonnes bien alignées
- ✅ Nombres clairs et lisibles
- ❌ PDFs scannés de mauvaise qualité
- ❌ Colonnes mal alignées
- ❌ Texte manuscrit

---

## 🎯 Next Steps

Une fois que vous maîtrisez les bases :

1. **Lisez ARCHITECTURE.md** pour comprendre le data flow
2. **Ajoutez des features** (voir CONTRIBUTING.md)
3. **Activez l'OCR réel** avec Google Cloud Vision
4. **Déployez sur Vercel** :
   ```bash
   npm install -g vercel
   vercel
   ```

---

**Vous êtes prêt ! 🚀 Amusez-vous bien avec PDF Quote Filler.**

*Questions ? Ouvrez une issue sur GitHub.*
