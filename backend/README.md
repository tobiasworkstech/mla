# Backend

Node.js + Express backend for the Memory Leak Analyzer.

## Setup

```bash
npm install
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Add your Claude API key:

```
CLAUDE_API_KEY=sk-ant-...
```

## Development

```bash
npm run dev
```

The API will run on `http://localhost:4000`.

## Build

```bash
npm run build
```

## API Endpoints

- `POST /api/analyze` - Upload and analyze files
- `GET /api/results/:id` - Get analysis results
- `GET /api/analyses` - List recent analyses
- `GET /api/health` - Health check

## Structure

- `src/index.ts` - Main Express server
- `src/services/claudeService.ts` - Claude AI integration
- `src/services/memoryParser.ts` - Memory dump parsing
