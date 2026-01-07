# CLAUDE.MD - Svensk Kassa

## Project Overview

Svensk Kassa is a Swedish cash register calculator application built with Next.js. It helps users count and calculate totals for Swedish currency (SEK) including coins and banknotes. The application provides a clean interface for counting denominations, tracking totals, and exporting/importing cash register data.

## Tech Stack

- **Framework**: Next.js 15.5.9 (with Turbopack)
- **React**: 19.2.1
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 3.4.1 + tailwindcss-animate
- **UI Components**: Radix UI (comprehensive component library)
- **Icons**: Lucide React
- **AI**: Google Genkit 1.20.0 (for AI features)
- **Backend**: Firebase 11.9.1
- **Form Handling**: React Hook Form 7.54.2 + Zod validation
- **Date Handling**: date-fns 3.6.0
- **Charts**: Recharts 2.15.1

## Project Structure

```
svensk-kassa/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main cash register interface
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── ui/                # Radix UI components (shadcn/ui style)
│   │   └── denomination-icon.tsx
│   ├── lib/
│   │   └── denominations.ts   # Swedish currency definitions
│   ├── hooks/
│   │   ├── use-toast.tsx
│   │   └── use-mobile.tsx
│   └── ai/
│       └── dev.ts             # Genkit AI development entry
├── package.json
└── README.md
```

## Key Features

### 1. Currency Counting
- Count Swedish coins: 1, 5, 10 kr
- Count Swedish banknotes: 20, 50, 100, 200, 500, 1000 kr
- Real-time subtotal calculations per denomination
- Separate totals for coins and notes
- Grand total display in sticky footer

### 2. Data Management
- **Auto-save**: State persists to localStorage (`svensk-kassa-state`)
- **Export**: Save as JSON with metadata (title, date, counts, totals, comments)
- **Import**: Load previously saved JSON files
- **Copy**: Generate formatted markdown report to clipboard
- **Reset**: Clear all data with confirmation toast

### 3. User Interface
- Responsive design (mobile-first)
- Swedish localization (SEK currency formatting)
- Toast notifications for user feedback
- Dropdown menu for actions (reset, export, import, copy)
- Date field with ISO format (YYYY-MM-DD)
- Title field for naming cash counts
- Comment field for additional notes

### 4. State Persistence
The app uses localStorage to save:
- `counts`: Object mapping denomination values to quantities
- `title`: Custom title for the count
- `date`: Date of the count
- `comment`: Additional notes

## Development Commands

```bash
# Development server (port 9002 with Turbopack)
npm run dev

# Genkit AI development
npm run genkit:dev
npm run genkit:watch

# Build for production
npm run build

# Start production server
npm start

# Linting
npm run lint

# Type checking
npm run typecheck
```

## Important Patterns & Conventions

### Currency Formatting
Uses Swedish locale formatting:
```typescript
const formatter = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
```

### State Management
- React useState for local component state
- useMemo for computed values (totals)
- useEffect for localStorage sync
- No global state management (Redux/Context) needed

### Component Architecture
- Client-side rendering (`"use client"` directive)
- Composition pattern with shadcn/ui components
- Controlled inputs for all form fields
- Custom DenominationRow component for each currency line item

## File Locations

### Key Files
- Main application: `src/app/page.tsx:1`
- UI components: `src/components/ui/`
- Currency definitions: `src/lib/denominations.ts` (assumed)
- Layout: `src/app/layout.tsx`

### Component Examples
- Buttons: `src/components/ui/button.tsx`
- Cards: `src/components/ui/card.tsx`
- Inputs: `src/components/ui/input.tsx`
- Dialogs: `src/components/ui/dialog.tsx`
- Toasts: `src/components/ui/toast.tsx`

## Common Tasks

### Adding a New Denomination
1. Update `src/lib/denominations.ts` with new coin/note value
2. The UI will automatically render the new denomination
3. DenominationIcon component may need updates

### Modifying Export Format
See `handleExport()` function in `src/app/page.tsx:146`
Current format includes:
- version: 1
- createdAt (ISO timestamp)
- title, date, counts, totals, comment

### Changing Locale/Currency
Update the Intl.NumberFormat configuration in `src/app/page.tsx:32`

### Styling Changes
- Tailwind classes used throughout
- Custom styles in Tailwind config
- shadcn/ui theming via CSS variables

## Known Gotchas

1. **localStorage Timing**: The app uses `isLoaded` flag to prevent saving initial empty state
2. **File Input Reset**: Import file input is manually reset after each import to allow re-importing same file
3. **Number Input**: Empty string is used instead of 0 for better UX (placeholder shows "0")
4. **Mobile Responsiveness**: Uses responsive classes (sm:, md:) extensively

## Deployment

The project includes a GitHub Actions workflow for Next.js deployment (`.github/workflows/` - check for details).

## Git Workflow

- Main branch: (check with repository)
- Current feature branch: `claude/update-claude-md-9xZj9`
- Always commit with descriptive messages
- Push with `-u origin <branch-name>`

## Firebase Integration

Firebase is configured but implementation details may be in separate files. Check for:
- Firebase config files
- Authentication setup
- Database/Firestore usage
- Hosting configuration

## AI Features

Google Genkit is integrated for AI capabilities:
- Entry point: `src/ai/dev.ts`
- Development server: `npm run genkit:dev`
- Watch mode available for hot reload

## Code Quality

- TypeScript strict mode enabled
- ESLint configuration present
- Type checking with `npm run typecheck`
- No PropTypes needed (TypeScript handles types)

## Accessibility

- ARIA labels on inputs (e.g., `aria-label={Antal för ${denomination.label}}`)
- Semantic HTML structure
- Screen reader support for menu button
- Keyboard navigation supported through Radix UI

## Performance Optimizations

- useMemo for expensive calculations (totals)
- Turbopack in development for faster builds
- Client-side rendering (CSR) for interactive features
- Minimal bundle size with tree-shaking

## Browser Support

Next.js 15 default browser support applies. LocalStorage and Clipboard API required for full functionality.

---

**Last Updated**: 2026-01-07
**Version**: 0.1.0
**Framework**: Next.js 15 + React 19
