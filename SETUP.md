# Memory Leak Analyzer - Setup & Usage Guide

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture](#architecture)
3. [Configuration](#configuration)
4. [Development](#development)
5. [Building for Production](#building-for-production)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

## Quick Start

### One-Command Setup

```bash
bash setup.sh
```

This script will:
- ✓ Check Node.js installation
- ✓ Install all dependencies
- ✓ Create environment configuration
- ✓ Provide next steps

### Manual Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment**
```bash
cp backend/.env.example backend/.env
```

3. **Add Claude API Key**
Edit `backend/.env`:
```
CLAUDE_API_KEY=sk-ant-your-key-here
PORT=4000
NODE_ENV=development
```

4. **Start Development Servers**
```bash
npm run dev
```

5. **Access Applications**
- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- API Health: http://localhost:4000/api/health

## Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Features**:
  - Drag-and-drop file upload
  - Real-time analysis status
  - Results visualization
  - Interactive dashboard

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express
- **AI Integration**: Anthropic Claude API
- **Features**:
  - File processing
  - Memory dump analysis
  - AI-powered analysis
  - RESTful API

### C/C++ Analyzer
- **Language**: C++17
- **Build**: CMake
- **Features**:
  - Memory leak detection
  - Corruption pattern recognition
  - Binary format parsing

## Configuration

### Backend Environment Variables

```env
# API Configuration
PORT=4000
NODE_ENV=development

# Claude AI
CLAUDE_API_KEY=sk-ant-...

# Optional
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=104857600  # 100MB
```

### Frontend Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:4000
```

## Development

### Project Scripts

```bash
# Start all development servers
npm run dev

# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend

# Build all
npm run build

# Build frontend
npm run build:frontend

# Build backend
npm run build:backend

# Run tests
npm run test

# Backend tests
npm run test:backend

# Frontend tests
npm run test:frontend
```

### VS Code Extensions

Recommended extensions (auto-suggested):
- ESLint - Code quality
- Prettier - Code formatter
- TypeScript Nightly - TS support
- C/C++ Tools - Native development

### Debugging

**Backend Debug Mode**
```bash
node --inspect-brk --loader ts-node/esm backend/src/index.ts
```

Then attach VS Code debugger (configured in `.vscode/launch.json`)

**Frontend Debug Mode**
- Press F12 in browser
- Use Chrome DevTools

## Building for Production

### Build All Packages

```bash
npm run build
```

This creates:
- `frontend/dist/` - Optimized frontend
- `backend/dist/` - Compiled backend
- `cpp-analyzer/build/` - Native libraries

### Production Environment

Create `.env.production`:
```env
PORT=4000
NODE_ENV=production
CLAUDE_API_KEY=sk-ant-...
```

### Start Production Server

```bash
cd backend
npm run build
npm start
```

## Deployment

### Docker Deployment

**Build Image**
```bash
docker build -t memory-leak-analyzer .
```

**Run Container**
```bash
docker run -p 3000:3000 -p 4000:4000 \
  -e CLAUDE_API_KEY=sk-ant-... \
  memory-leak-analyzer
```

### Docker Compose

```bash
CLAUDE_API_KEY=sk-ant-... docker-compose up -d
```

### Cloud Deployment Options

**Vercel (Frontend)**
```bash
npm install -g vercel
vercel --prod
```

**Heroku (Backend)**
```bash
heroku create memory-leak-analyzer
git push heroku main
```

**DigitalOcean, AWS, GCP**
- Use Docker images
- Set environment variables
- Configure CI/CD pipeline

## Troubleshooting

### Dependencies Installation Issues

```bash
# Clear npm cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### Backend Won't Start

1. Check Node.js version: `node -v` (needs 18+)
2. Verify Claude API key in `.env`
3. Check port 4000 isn't in use: `lsof -i :4000`
4. Check logs: `npm run dev:backend`

### Frontend Won't Load

1. Clear browser cache (Ctrl+Shift+Delete / Cmd+Shift+Delete)
2. Check Vite is running: `npm run dev:frontend`
3. Verify localhost:3000 is accessible
4. Check browser console for errors

### API Connection Issues

1. Verify backend is running: `curl http://localhost:4000/api/health`
2. Check CORS is enabled in Express
3. Verify frontend API URL in config
4. Check network tab in DevTools

### C++ Compilation Errors

```bash
# Requires CMake 3.15+
cmake --version

# Rebuild
npm run build
```

On macOS, ensure Xcode tools:
```bash
xcode-select --install
```

### Claude API Errors

1. Verify API key is correct
2. Check API quota at https://console.anthropic.com
3. Ensure network access to api.anthropic.com
4. Check rate limits

## Performance Optimization

### Frontend
- Enable production builds
- Use lazy loading for routes
- Optimize images
- Enable gzip compression

### Backend
- Use connection pooling
- Implement caching
- Optimize database queries
- Use clustering for multiple cores

### C++ Analyzer
- Compile with optimizations (-O3)
- Use static linking
- Profile hot paths

## Security Checklist

- [ ] Never commit `.env` files
- [ ] Use HTTPS in production
- [ ] Validate file uploads
- [ ] Sanitize user input
- [ ] Keep dependencies updated
- [ ] Use security headers
- [ ] Enable CORS properly
- [ ] Rate limit API endpoints

## Next Steps

1. **Customize Analysis**
   - Edit `backend/src/services/claudeService.ts`
   - Add more detection patterns

2. **Improve UI**
   - Customize components in `frontend/src/`
   - Add more visualization charts

3. **Extend Backend**
   - Add database (MongoDB/PostgreSQL)
   - Implement authentication
   - Add file storage (S3/GCS)

4. **Enhance C++ Analyzer**
   - Implement more detection algorithms
   - Add binary format support
   - Optimize performance

## Support

- Check documentation in each workspace
- Review example usage in page components
- Check API endpoints in backend README
- See C++ analyzer documentation

## License

MIT - See LICENSE file
