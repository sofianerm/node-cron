# Changelog

All notable changes to PDF Quote Filler will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2024-11-05

### 🎉 Initial Release

#### ✨ Features

**Core Functionality**
- PDF upload via drag & drop or file selection
- Interactive PDF viewer with PDF.js rendering
- Click-to-define column system (3 columns: Quantity, Unit Price, Total)
- Visual column indicators with vertical lines
- OCR detection ready (Google Cloud Vision API integration)
- Mock OCR for development and testing
- Dynamic form generation based on detected quantities
- Real-time price calculations (bidirectional: unit price ↔ total price)
- Automatic grand total aggregation
- Multi-step workflow with progress indicator

**User Interface**
- Modern, responsive design with Tailwind CSS
- Clean and intuitive layout
- Step-by-step visual guidance
- Error handling with user-friendly messages
- Loading states for async operations
- Currency formatting (CAD by default)
- Hover effects and smooth transitions

**Developer Experience**
- TypeScript strict mode throughout
- Zustand for lightweight state management
- Modular component architecture
- API routes with Next.js 14 App Router
- ESLint and Prettier configuration
- VSCode settings for optimal DX
- Comprehensive documentation

#### 📚 Documentation

- `README.md` - Project overview and features
- `QUICKSTART.md` - 5-minute getting started guide
- `ARCHITECTURE.md` - Detailed technical architecture
- `CONTRIBUTING.md` - Contribution guidelines
- `DEPLOYMENT.md` - Production deployment guide
- `CHANGELOG.md` - Version history (this file)

#### 🏗️ Architecture

**Frontend**
- Next.js 14 with App Router
- React Server Components + Client Components
- PDF.js for PDF rendering
- Zustand for state management
- Tailwind CSS for styling
- Lucide React for icons

**Backend**
- Next.js API Routes
- Google Cloud Vision API ready
- Mock OCR for development

**State Management**
- Global store with Zustand
- Typed actions and selectors
- Automatic calculations
- Reset functionality

#### 🎨 Components

- `UploadZone` - File upload with drag & drop
- `PDFViewer` - Interactive PDF display with column overlays
- `ColumnSelector` - Column management interface
- `OCRProcessor` - OCR trigger and loading states
- `QuantityForm` - Dynamic form with calculations
- `StepIndicator` - Visual progress tracker

#### 🔧 Technical Details

- **Build Size**: 198 KB First Load JS
- **Bundle**: Optimized production build
- **TypeScript**: 100% type coverage
- **Performance**: Sub-second calculations
- **Compatibility**: Node.js 20+, Modern browsers

---

## [Unreleased]

### 🔮 Planned Features

#### High Priority
- [ ] PDF export with filled prices
- [ ] Automatic subtotal detection
- [ ] Multi-page PDF support
- [ ] Keyboard shortcuts (Tab navigation)
- [ ] Print functionality

#### Medium Priority
- [ ] Submission history (with localStorage)
- [ ] Column template saving
- [ ] Dark mode
- [ ] Multiple currency support
- [ ] CSV/Excel export

#### Low Priority
- [ ] User accounts and cloud storage
- [ ] Collaborative editing
- [ ] Mobile app (React Native)
- [ ] Batch PDF processing
- [ ] Custom calculation rules

### 🐛 Known Issues

- PDF.js requires modern browser (no IE11 support)
- Large PDFs (>50MB) may be slow to render
- OCR accuracy depends on PDF quality
- Column detection requires clear alignment

### 🔧 Technical Debt

- Add unit tests for calculations
- Add integration tests for components
- Add E2E tests with Playwright
- Implement proper error boundaries
- Add Sentry for error tracking
- Optimize bundle size (code splitting)

---

## Version History Summary

| Version | Date       | Highlights                    |
|---------|------------|-------------------------------|
| 1.0.0   | 2024-11-05 | 🎉 Initial release           |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on submitting features and bug fixes.

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.
