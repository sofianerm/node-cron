# 🤝 Contributing to PDF Quote Filler

Merci de considérer contribuer à PDF Quote Filler ! Ce document explique l'architecture et comment contribuer efficacement.

---

## 🏛️ Architecture Détaillée

### State Management (Zustand)

Le store global (`store/useStore.ts`) gère :
- **PDF Document** : File, URL, nombre de pages
- **Current Step** : Navigation entre les étapes
- **Columns** : Colonnes définies par l'utilisateur
- **Detected Items** : Quantités détectées avec leurs prix
- **Subtotals** : Sous-totaux identifiés
- **Grand Total** : Total général calculé
- **UI State** : Loading, erreurs, etc.

### Flux de données

```
User Upload PDF
    ↓
Store: setPdfDocument()
    ↓
PDFViewer renders PDF
    ↓
User clicks to define columns
    ↓
Store: addColumn() × 3
    ↓
User triggers OCR
    ↓
API: /api/ocr → Google Cloud Vision
    ↓
Store: setDetectedItems()
    ↓
QuantityForm renders
    ↓
User enters prices
    ↓
Store: updateItemUnitPrice()
    ↓
Auto-calculate totals
    ↓
Store: updateGrandTotal()
```

### Composants

#### `PDFViewer.tsx`
- Affiche le PDF avec PDF.js
- Gère les clics pour définir les colonnes
- Overlay pour visualiser les colonnes définies

#### `ColumnSelector.tsx`
- Liste les colonnes définies
- Permet de les supprimer/réinitialiser
- Valide que 3 colonnes sont définies avant de continuer

#### `OCRProcessor.tsx`
- Bouton pour déclencher l'OCR
- Gère le loading state
- Appelle l'API `/api/ocr`

#### `QuantityForm.tsx`
- Table dynamique générée depuis `detectedItems`
- Inputs pour prix unitaire et prix total
- Calcul automatique quand l'utilisateur entre une valeur
- Affiche le total général

#### `StepIndicator.tsx`
- Indicateur visuel des 5 étapes
- Montre la progression

### API Routes

#### `POST /api/ocr`
- Reçoit : File PDF + colonnes définies
- Traite : OCR via Google Cloud Vision (ou mock en dev)
- Retourne : Liste des quantités détectées avec bounding boxes

**Structure de retour :**
```typescript
{
  success: true,
  quantities: [
    {
      value: 5,
      bbox: { x: 100, y: 150, width: 50, height: 20 }
    },
    ...
  ]
}
```

---

## 🛠️ Setup Development

```bash
# Cloner
git clone <repo-url>
cd pdf-quote-filler

# Installer
npm install

# Dev
npm run dev

# Build
npm run build

# Lint
npm run lint
```

---

## 📝 Guidelines

### TypeScript
- **Strict mode activé** - Pas de `any`, typage complet
- Utilisez les types dans `types/index.ts`
- Ajoutez de nouveaux types si nécessaire

### React
- **Functional components** uniquement
- Hooks pour la logique
- `use client` pour les composants interactifs

### Styling
- **Tailwind CSS** uniquement
- Pas de CSS custom sauf si absolument nécessaire
- Utilisez `cn()` pour combiner des classes conditionnelles

### State
- **Zustand store** pour l'état global
- `useState` pour l'état local UI uniquement
- Pas de prop drilling - utilisez le store

### Conventions de code
- Variables : `camelCase`
- Composants : `PascalCase`
- Constantes : `UPPER_SNAKE_CASE`
- Fonctions : verbes descriptifs (`handleClick`, `fetchData`)

---

## 🎨 Design Principles

1. **Simplicité** - Si ça peut être plus simple, simplifie-le
2. **Intuitivité** - L'UI doit être évidente sans documentation
3. **Performance** - Calculs instantanés, pas de lag
4. **Élégance** - Chaque animation, chaque transition compte
5. **Fiabilité** - Validation, error handling, edge cases

---

## 🐛 Reporting Bugs

Créez une issue avec :
- **Description** claire du bug
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** si applicable
- **Browser/OS** info

---

## ✨ Proposing Features

Créez une issue "Feature Request" avec :
- **Problème** que ça résout
- **Solution** proposée
- **Alternatives** considérées
- **Mockups** si applicable

---

## 🔄 Pull Requests

1. **Fork** le repo
2. **Branch** depuis `main` : `git checkout -b feature/awesome-feature`
3. **Code** en suivant les guidelines
4. **Test** que tout compile : `npm run build`
5. **Commit** avec des messages clairs
6. **Push** vers votre fork
7. **PR** vers `main` avec description détaillée

### Commit Messages

```
feat: add PDF export functionality
fix: resolve OCR detection for rotated PDFs
docs: update README with new examples
refactor: simplify calculation logic
style: improve form layout spacing
test: add unit tests for calculations
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Upload PDF (drag & drop)
- [ ] Upload PDF (click to select)
- [ ] Define 3 columns by clicking
- [ ] Remove column
- [ ] Reset columns
- [ ] Trigger OCR detection
- [ ] Enter unit prices
- [ ] Enter total prices
- [ ] Verify calculations are correct
- [ ] Verify grand total updates
- [ ] Reset and start over

---

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [PDF.js](https://mozilla.github.io/pdf.js/)
- [Google Cloud Vision](https://cloud.google.com/vision/docs)

---

## 💬 Questions ?

N'hésitez pas à ouvrir une discussion dans les Issues pour toute question sur l'architecture ou les contributions.

---

**Merci de contribuer à rendre PDF Quote Filler encore meilleur ! 🚀**
