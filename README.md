# 🎯 PDF Quote Filler

**Remplissage intelligent de soumissions PDF en 3 clics.**

Une application Next.js élégante qui transforme vos soumissions PDF statiques en formulaires interactifs avec détection automatique des quantités par OCR.

---

## ✨ La Vision

Les soumissions arrivent souvent en PDF avec uniquement les quantités renseignées. Vous devez manuellement :
- Ajouter les prix unitaires
- Calculer chaque total
- Gérer les sous-totaux
- Calculer le total général

**C'est lent. C'est répétitif. Ça devrait être instantané.**

PDF Quote Filler résout ce problème de façon élégante :

1. **Upload** - Glissez-déposez votre PDF
2. **Définir** - 3 clics pour définir les colonnes (Quantité, Prix unitaire, Prix total)
3. **Détecter** - L'OCR extrait automatiquement toutes les quantités
4. **Remplir** - Entrez uniquement les prix unitaires, les totaux se calculent automatiquement

---

## 🚀 Features

- ✅ **Upload PDF par drag & drop** - Interface fluide et intuitive
- ✅ **Définition de colonnes par clics** - Tracez des lignes verticales en 3 clics
- ✅ **OCR intelligent** - Détection automatique des quantités (Google Cloud Vision ready)
- ✅ **Formulaires dynamiques** - Génération automatique basée sur les quantités détectées
- ✅ **Calculs en temps réel** - Prix totaux calculés instantanément
- ✅ **Total général** - Agrégation automatique de tous les montants
- ✅ **Design moderne** - Interface Tailwind CSS épurée et professionnelle
- ✅ **TypeScript strict** - Typage complet, zéro surprise
- ✅ **State management élégant** - Zustand pour une gestion d'état légère et performante

---

## 🏗️ Architecture

```
PDF Quote Filler
│
├── Frontend (Next.js 14 App Router)
│   ├── PDFViewer - Rendu PDF avec annotations (PDF.js)
│   ├── ColumnSelector - Système de clics pour colonnes
│   ├── OCRProcessor - Détection et extraction
│   ├── QuantityForm - Formulaire dynamique
│   └── StepIndicator - Navigation visuelle
│
├── Backend (API Routes)
│   └── /api/ocr - OCR processing endpoint
│
└── State (Zustand)
    └── Global store - PDF, columns, items, calculations
```

---

## 🛠️ Tech Stack

- **Next.js 14** - React framework avec App Router
- **TypeScript** - Type safety partout
- **Tailwind CSS** - Styling moderne et rapide
- **PDF.js** - Rendu PDF côté client
- **Zustand** - State management léger
- **Lucide React** - Icônes élégantes
- **Google Cloud Vision API** - OCR de classe mondiale (optionnel)

---

## 📦 Installation

```bash
# Cloner le repo
git clone <your-repo-url>
cd pdf-quote-filler

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 🎨 Utilisation

### 1. Upload du PDF
- Glissez-déposez votre soumission PDF ou cliquez pour sélectionner
- Le PDF s'affiche instantanément

### 2. Définir les colonnes
- Cliquez 3 fois sur le PDF pour définir :
  1. Colonne "Quantité"
  2. Colonne "Prix unitaire"
  3. Colonne "Prix total"
- Des lignes verticales bleues apparaissent pour visualiser les colonnes

### 3. Détecter les quantités
- Cliquez sur "Détecter les quantités"
- L'OCR analyse le PDF et extrait toutes les quantités

### 4. Remplir les prix
- Un formulaire s'affiche avec une ligne par quantité détectée
- Entrez les prix unitaires OU les prix totaux
- Les calculs se font automatiquement en temps réel
- Le total général s'affiche en bas

---

## 🔧 Configuration OCR

### Mode Demo (par défaut)
Le mode demo génère des quantités factices pour tester l'app sans configurer l'OCR.

### Google Cloud Vision API (Production)

1. Créer un projet Google Cloud
2. Activer l'API Cloud Vision
3. Créer une clé de service account
4. Télécharger le JSON credentials

```bash
# Installer le client Google Cloud Vision
npm install @google-cloud/vision

# Configurer les credentials
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/credentials.json"
```

5. Décommenter le code dans `app/api/ocr/route.ts`

---

## 📁 Structure du projet

```
/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Page d'accueil
│   ├── globals.css         # Styles globaux
│   └── api/
│       └── ocr/
│           └── route.ts    # API OCR
├── components/
│   ├── PDFViewer.tsx       # Affichage PDF + annotations
│   ├── UploadZone.tsx      # Zone d'upload
│   ├── ColumnSelector.tsx  # Sélection de colonnes
│   ├── OCRProcessor.tsx    # Déclencheur OCR
│   ├── QuantityForm.tsx    # Formulaire dynamique
│   └── StepIndicator.tsx   # Indicateur d'étapes
├── lib/
│   ├── utils.ts           # Utilitaires (cn, formatCurrency)
│   └── calculations.ts    # Logique de calculs
├── store/
│   └── useStore.ts        # Zustand store global
├── types/
│   └── index.ts           # Types TypeScript
└── public/                # Assets statiques
```

---

## 🎯 Roadmap

- [ ] Export PDF complété avec les prix
- [ ] Détection automatique des sous-totaux
- [ ] Support multi-pages
- [ ] Historique des soumissions
- [ ] Templates de colonnes sauvegardés
- [ ] Mode sombre
- [ ] Raccourcis clavier
- [ ] Export Excel/CSV

---

## 🤝 Contributing

Les contributions sont les bienvenues ! N'hésitez pas à :
- Reporter des bugs
- Proposer des features
- Soumettre des PRs

---

## 📄 License

MIT License - Utilisez librement pour vos projets personnels et commerciaux.

---

## 💡 Philosophy

> "Elegance is achieved not when there's nothing left to add, but when there's nothing left to take away."

Cette app suit les principes du design Apple :
- **Simple** - 3 clics pour tout configurer
- **Intuitif** - Pas besoin de documentation
- **Rapide** - Détection et calculs instantanés
- **Élégant** - Design épuré, animations fluides
- **Fiable** - TypeScript, validation, error handling

---

**Fait avec ❤️ et ultrathink**
