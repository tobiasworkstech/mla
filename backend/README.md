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

The default configuration uses **Ollama** with `gemma3:1b`. You can customize this in `.env`:

```
OLLAMA_MODEL=gemma3:1b
OLLAMA_HOST=http://host.docker.internal:11434
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
- `src/index.ts` - Main Express server
- `src/services/ollamaService.ts` - Ollama AI integration
- `src/services/memoryParser.ts` - Memory dump parsing
