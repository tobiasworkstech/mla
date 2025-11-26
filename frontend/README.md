# Frontend

React + TypeScript frontend for the Memory Leak Analyzer.

## Setup

```bash
npm install
npm run dev
```

The frontend will run on `http://localhost:3000` and proxy API requests to `http://localhost:4000`.

## Build

```bash
npm run build
```

## Structure

- `src/pages/` - Page components (Dashboard, Analyzer, Results)
- `src/components/` - Reusable components
- `src/index.css` - Global styles with Tailwind CSS

## Features

- File upload with drag-and-drop
- Real-time analysis status
- Results visualization
- AI-powered recommendations display
