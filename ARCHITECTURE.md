# 🏗️ Architecture Deep Dive

Une exploration détaillée de l'architecture de PDF Quote Filler.

---

## 📐 Vue d'ensemble

PDF Quote Filler suit une architecture **Next.js App Router** moderne avec :
- **Frontend** : React Server Components + Client Components
- **Backend** : API Routes Next.js
- **State** : Zustand (global) + React useState (local)
- **Styling** : Tailwind CSS utility-first
- **PDF** : PDF.js pour le rendering client-side
- **OCR** : Google Cloud Vision API (production) ou mock (dev)

---

## 🔄 Data Flow

### 1. Upload Phase

```
User uploads PDF
    ↓
UploadZone component
    ↓
File → createObjectURL
    ↓
useStore.setPdfDocument({ file, url, numPages })
    ↓
useStore.setCurrentStep('define-columns')
    ↓
PDFViewer renders PDF with PDF.js
```

### 2. Column Definition Phase

```
User clicks on PDF canvas
    ↓
PDFViewer.handleCanvasClick()
    ↓
Calculate X position from click event
    ↓
Create Column object { id, name, x, label }
    ↓
useStore.addColumn(column)
    ↓
Render vertical line overlay at X position
    ↓
Repeat 3 times for: quantity, unitPrice, totalPrice
    ↓
ColumnSelector validates 3 columns exist
    ↓
useStore.setCurrentStep('detect')
```

### 3. OCR Detection Phase

```
User clicks "Detect"
    ↓
OCRProcessor.handleDetect()
    ↓
FormData: { file: PDF, columns: JSON }
    ↓
POST /api/ocr
    ↓
Server: Extract text with Google Cloud Vision
    ↓
Server: Filter results by column X position
    ↓
Server: Parse quantities from text
    ↓
Return: { quantities: [{ value, bbox }] }
    ↓
Client: Create DetectedItem objects
    ↓
useStore.setDetectedItems(items)
    ↓
useStore.setCurrentStep('fill')
```

### 4. Form Fill Phase

```
QuantityForm renders table
    ↓
User enters unitPrice in input
    ↓
handleUnitPriceChange(id, value)
    ↓
useStore.updateItemUnitPrice(id, value)
    ↓
Calculate: totalPrice = quantity × unitPrice
    ↓
Update item in store
    ↓
useStore.updateGrandTotal()
    ↓
Sum all item.totalPrice
    ↓
Display formatted grand total
```

---

## 🗂️ State Architecture

### Zustand Store Schema

```typescript
{
  // Document
  pdfDocument: {
    file: File,
    url: string,        // Object URL for rendering
    numPages: number
  } | null,

  // Navigation
  currentStep: 'upload' | 'define-columns' | 'detect' | 'fill' | 'export',

  // Columns
  columns: [
    {
      id: string,                              // UUID
      name: 'quantity' | 'unitPrice' | 'totalPrice',
      x: number,                               // X position on canvas
      label: string                            // Display label
    }
  ],

  // Detected Items
  detectedItems: [
    {
      id: string,                              // UUID
      quantity: number,                        // Detected from OCR
      quantityBBox: { x, y, width, height },   // Position in PDF
      unitPrice: number,                       // User input
      totalPrice: number,                      // Calculated
      y: number                                // Sort order
    }
  ],

  // Calculations
  subtotals: [...],                            // Future feature
  grandTotal: number,                          // Sum of all totalPrice

  // UI State
  isProcessing: boolean,
  error: string | null
}
```

### State Mutations

#### Actions non-mutantes (safe)
```typescript
setPdfDocument()      // Replace
setCurrentStep()      // Replace
setDetectedItems()    // Replace
setError()           // Replace
```

#### Actions mutantes (use map)
```typescript
addColumn()          // [...state.columns, newColumn]
removeColumn()       // state.columns.filter()
updateItemUnitPrice() // state.detectedItems.map()
```

---

## 🎨 Component Architecture

### Component Tree

```
App (page.tsx)
├── Header
│   ├── Logo
│   └── Reset Button
├── Error Alert (conditional)
├── Step Indicator (conditional on pdfDocument)
└── Main Grid
    ├── Left Column (2/3 width)
    │   ├── UploadZone (if !pdfDocument)
    │   └── PDFViewer (if pdfDocument)
    └── Right Column (1/3 width)
        ├── ColumnSelector (if step === 'define-columns')
        ├── OCRProcessor (if step === 'detect')
        └── QuantityForm (if step === 'fill')
```

### Component Responsibilities

#### `PDFViewer`
**Responsabilité** : Rendering PDF + Column overlays
**State** : Local (page, scale, canvas)
**Store** : Read (pdfDocument, columns, currentStep), Write (addColumn)
**Logic** :
- Load PDF with PDF.js
- Render to canvas
- Handle click events for column definition
- Overlay vertical lines for columns

#### `ColumnSelector`
**Responsabilité** : Manage column list + validation
**State** : None (fully controlled by store)
**Store** : Read (columns), Write (removeColumn, clearColumns, setCurrentStep)
**Logic** :
- Display column list
- Remove individual columns
- Validate 3 columns before continue

#### `OCRProcessor`
**Responsabilité** : Trigger OCR + handle loading
**State** : Local (isProcessing)
**Store** : Read (pdfDocument, columns), Write (setDetectedItems, setCurrentStep, setError)
**Logic** :
- Call /api/ocr with FormData
- Handle loading/error states
- Transform API response to DetectedItems

#### `QuantityForm`
**Responsabilité** : Display table + handle input
**State** : None (controlled inputs via store)
**Store** : Read (detectedItems, grandTotal), Write (updateItemUnitPrice, updateItemTotalPrice)
**Logic** :
- Render table with one row per detectedItem
- Handle input changes
- Trigger recalculations
- Display grand total

---

## 🔌 API Design

### `POST /api/ocr`

**Input:**
```typescript
FormData {
  file: File,              // PDF file
  columns: string          // JSON.stringify([Column])
}
```

**Processing:**
1. Parse FormData
2. Convert PDF to image buffer
3. Call Google Cloud Vision API
4. Get all text annotations with bounding boxes
5. Filter annotations by column X position (±tolerance)
6. Parse text as numbers for quantity column
7. Sort by Y position (top to bottom)

**Output:**
```typescript
{
  success: boolean,
  quantities: [
    {
      value: number,       // Parsed quantity
      bbox: {
        x: number,
        y: number,
        width: number,
        height: number
      }
    }
  ]
}
```

**Error Handling:**
```typescript
{
  error: string,
  details?: any
}
```

---

## 🧮 Calculation Logic

### Unit Price → Total Price

```typescript
updateItemUnitPrice(id, unitPrice) {
  const item = findItem(id)
  const totalPrice = item.quantity × unitPrice
  updateItem(id, { unitPrice, totalPrice })
  updateGrandTotal()
}
```

### Total Price → Unit Price

```typescript
updateItemTotalPrice(id, totalPrice) {
  const item = findItem(id)
  const unitPrice = item.quantity > 0
    ? totalPrice / item.quantity
    : 0
  updateItem(id, { unitPrice, totalPrice })
  updateGrandTotal()
}
```

### Grand Total

```typescript
updateGrandTotal() {
  const total = detectedItems.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  )
  setGrandTotal(total)
}
```

**Automatique** : Appelé après chaque modification de prix.

---

## 🎭 Rendering Strategy

### Server Components (RSC)
- `layout.tsx` - Static layout
- Metadata generation

### Client Components
- Tous les composants avec interactivité
- Marqués avec `'use client'`
- Accès aux hooks React et browser APIs

### Why Client-Side for Everything?
- **PDF.js** nécessite browser APIs (canvas)
- **File upload** nécessite FileReader
- **State management** nécessite Zustand hooks
- **Interactive UI** nécessite event handlers

---

## 📦 Build Output

```
Route (app)                              Size     First Load JS
┌ ○ /                                    111 kB          198 kB
├ ○ /_not-found                          873 B            88 kB
└ ƒ /api/ocr                             0 B                0 B
```

**Analysis:**
- **Main page** : 111 KB (PDFViewer + all components)
- **First Load JS** : 198 KB (includes React, Next.js, PDF.js)
- **API route** : 0 KB (server-side only)

**Optimization opportunities:**
- Code splitting pour PDF.js (lazy load)
- Image optimization si logos ajoutés
- Dynamic imports pour OCRProcessor

---

## 🔒 Type Safety

### Type Flow

```
User Input (unknown)
    ↓
Parse/Validate (Zod schemas - future)
    ↓
TypeScript types (types/index.ts)
    ↓
Store (typed with Zustand)
    ↓
Components (typed props)
    ↓
Render (type-safe JSX)
```

### Key Types

```typescript
// Core domain types
Column, DetectedItem, OCRResult, BoundingBox

// Document types
PDFDocument

// UI types
AppStep

// Future: Zod schemas for validation
```

---

## 🚀 Performance Considerations

### Current Optimizations
- **Zustand** : Minimal re-renders (selector pattern)
- **Canvas rendering** : One-time render per PDF load
- **Calculations** : O(n) where n = detectedItems length
- **API calls** : Single OCR call per document

### Future Optimizations
- **Web Workers** : PDF.js rendering off main thread
- **Virtualization** : For PDFs with 100+ quantities
- **Debouncing** : Input changes in QuantityForm
- **Memoization** : Expensive calculations with useMemo

---

## 🧪 Testing Strategy

### Unit Tests (Future)
```typescript
// lib/calculations.test.ts
test('calculateItemTotal', () => {
  expect(calculateItemTotal(5, 10.5)).toBe(52.5)
})

// store/useStore.test.ts
test('updateItemUnitPrice updates totalPrice', () => {
  // Test store mutations
})
```

### Integration Tests (Future)
```typescript
// components/QuantityForm.test.tsx
test('entering unit price calculates total', () => {
  // Render with mock store
  // Type in input
  // Assert total updated
})
```

### E2E Tests (Future)
```typescript
// e2e/full-flow.spec.ts
test('complete PDF filling flow', () => {
  // Upload PDF
  // Define columns
  // Trigger OCR
  // Fill prices
  // Verify total
})
```

---

## 🔮 Extension Points

### Adding a new calculation type
1. Add type to `types/index.ts`
2. Add logic to `lib/calculations.ts`
3. Add action to `store/useStore.ts`
4. Use in component

### Adding a new step
1. Add to `AppStep` type
2. Add to `steps` array in `StepIndicator`
3. Create component for step
4. Add conditional render in `page.tsx`

### Adding PDF export
1. Create `lib/pdf-export.ts`
2. Use `pdf-lib` to modify original PDF
3. Add text overlays at item positions
4. Download modified PDF

---

## 📊 Metrics & Monitoring (Future)

```typescript
// Analytics events to track
- pdf_uploaded
- columns_defined
- ocr_completed
- form_filled
- pdf_exported

// Performance metrics
- Time to OCR
- Number of quantities detected
- Average time to fill form
- Error rates
```

---

Cette architecture est conçue pour être **simple**, **élégante**, et **extensible**. Chaque décision privilégie la clarté et la maintenabilité.
