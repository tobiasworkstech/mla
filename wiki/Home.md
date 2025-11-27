# Memory Leak Analyzer (MLA) - Documentation

Welcome to the **Memory Leak Analyzer** wiki! This is your comprehensive guide to understanding, using, and contributing to the MLA project.

## 📋 Quick Navigation

- [About MLA](#about-mla)
- [Key Features](#key-features)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🎯 About MLA

The **Memory Leak Analyzer (MLA)** is an intelligent, AI-powered tool designed to detect and analyze memory leaks and corruption in C/C++ code. By leveraging Claude AI, MLA provides comprehensive analysis with actionable insights and recommendations.

### What Makes MLA Special?

✨ **AI-Powered Analysis** - Claude AI integration for intelligent leak detection
🔍 **Comprehensive Detection** - Identifies memory leaks, corruption, and related issues
📊 **Real-time Visualization** - Interactive dashboard for memory issue visualization
📤 **Easy File Upload** - Drag-and-drop interface for binary and source files
🐳 **Docker Ready** - Production-ready containerization
⚡ **Full Stack** - React frontend, Node.js backend, and C/C++ analysis engine

---

## ✨ Key Features

### For Users
- **Local File Analysis**: Load and analyze C/C++ binaries and source files locally
- **AI-Powered Insights**: Claude AI provides intelligent analysis and recommendations
- **Real-time Status**: Watch analysis progress in real-time
- **Comprehensive Reports**: Detailed findings with severity levels and actionable fixes
- **Multi-format Support**: Support for binaries, source code, and debug symbols

### For Developers
- **TypeScript Codebase**: Full type safety across frontend and backend
- **Modern Stack**: React 18, Express, TypeScript, Tailwind CSS
- **Well Documented**: Comprehensive documentation and code comments
- **Easy to Extend**: Modular architecture for adding new features
- **Docker Support**: Out-of-the-box containerization

---

## 📸 Screenshots

### Frontend Dashboard
![Memory Leak Analyzer Dashboard](./images/frontend-dashboard.png)
*Main dashboard showing recent analyses and overview*

### Analyzer Interface
![Analyzer Upload Interface](./images/analyzer-interface.png)
*File upload and analysis configuration interface*

### Results Visualization
![Analysis Results](./images/analysis-results.png)
*AI-powered findings and detailed memory leak analysis*

---

## 🚀 Getting Started

### Quick Start (Docker)

```bash
# Clone the repository
git clone https://github.com/tobiasworkstech/mla.git
cd mla

# Set your Claude API key
export CLAUDE_API_KEY=sk-ant-...

# Start with Docker Compose
docker-compose up
```

Then open:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000

### Manual Setup

1. **Prerequisites**: Node.js 18+, Python 3.8+, CMake 3.15+
2. **Install dependencies**: `npm install`
3. **Configure environment**: `cp backend/.env.example backend/.env`
4. **Add your Claude API key** to `backend/.env`
5. **Start development servers**: `npm run dev`

### First Analysis

1. Open http://localhost:3000
2. Navigate to the **Analyzer** page
3. Upload a C/C++ binary or source file
4. Click **Analyze**
5. View AI-powered insights and recommendations

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────┐
│   React Frontend│
│  (TypeScript)   │
└────────┬────────┘
         │ HTTP
         ↓
┌─────────────────┐
│  Express API    │
│  (Node.js)      │
└────────┬────────┘
         │
    ┌────┴────┐
    ↓         ↓
┌──────────┐ ┌──────────┐
│ Claude   │ │ Memory   │
│ AI API   │ │ Parser   │
└──────────┘ └──────────┘
```

### Component Details

#### Frontend (React + TypeScript)
- **Location**: `frontend/`
- **Tech Stack**: React 18, Vite, Tailwind CSS, TypeScript
- **Key Pages**:
  - **Dashboard**: Overview and recent analyses
  - **Analyzer**: File upload and configuration interface
  - **Results**: Analysis results and insights visualization

#### Backend (Node.js + Express)
- **Location**: `backend/`
- **Responsibilities**:
  - API endpoint management
  - File upload handling
  - Claude AI integration
  - Memory dump parsing
  - Results storage and retrieval

#### C/C++ Analyzer
- **Location**: `cpp-analyzer/`
- **Purpose**: Native memory analysis engine
- **Features**: Pattern detection, binary format parsing, analysis algorithms

---

## 📚 API Documentation

### Upload and Analyze

**Endpoint**: `POST /api/analyze`

Upload a file for analysis:

```bash
curl -X POST http://localhost:4000/api/analyze \
  -F "file=@binary_file"
```

**Response**:
```json
{
  "id": "analysis-123",
  "status": "processing",
  "message": "Analysis started"
}
```

### Get Results

**Endpoint**: `GET /api/results/:id`

Retrieve analysis results:

```bash
curl http://localhost:4000/api/results/analysis-123
```

**Response**:
```json
{
  "id": "analysis-123",
  "status": "completed",
  "findings": [
    {
      "type": "memory_leak",
      "severity": "high",
      "description": "Leaked memory in allocation...",
      "recommendation": "Add corresponding free() call..."
    }
  ]
}
```

### List Recent Analyses

**Endpoint**: `GET /api/analyses`

Get list of recent analyses:

```bash
curl http://localhost:4000/api/analyses
```

### Health Check

**Endpoint**: `GET /api/health`

```bash
curl http://localhost:4000/api/health
```

---

## 🐳 Deployment

### Docker Deployment

**Step 1: Build the image**
```bash
docker build -t memory-leak-analyzer .
```

**Step 2: Run the container**
```bash
docker run -p 3000:3000 -p 4000:4000 \
  -e CLAUDE_API_KEY=sk-ant-... \
  memory-leak-analyzer
```

### Docker Compose Deployment

```bash
CLAUDE_API_KEY=sk-ant-... docker-compose up -d
```

### Production Deployment Options

#### Vercel (Frontend)
```bash
npm install -g vercel
cd frontend
vercel --prod
```

#### Heroku (Backend)
```bash
heroku create mla-backend
git push heroku main
```

#### Cloud Platforms (Docker)
Deploy to AWS, GCP, Azure, or DigitalOcean using the provided Docker image.

---

## 🔧 Development Guide

### Available Commands

```bash
# Start all development servers
npm run dev

# Build everything
npm run build

# Run tests
npm run test

# Format code
npm run format

# Lint code
npm run lint
```

### Project Structure

```
memoryLeakAnalyzer/
├── frontend/              # React UI
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   └── App.tsx       # Main app
│   └── package.json
├── backend/               # Express API
│   ├── src/
│   │   ├── index.ts      # Main server
│   │   └── services/     # Business logic
│   └── package.json
├── cpp-analyzer/          # C++ analyzer
│   ├── include/
│   ├── src/
│   └── CMakeLists.txt
├── docker-compose.yml     # Docker Compose config
└── package.json          # Root workspace
```

---

## 🛠️ Troubleshooting

### Backend Won't Start

**Issue**: Port 4000 in use
```bash
# Find and kill process on port 4000
lsof -i :4000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

**Issue**: Missing Claude API key
```bash
# Ensure backend/.env has valid CLAUDE_API_KEY
cat backend/.env
```

### Frontend Not Loading

**Issue**: Clear browser cache
```bash
# Press Cmd+Shift+Delete (macOS) or Ctrl+Shift+Delete (Windows/Linux)
# Clear all cached files
```

**Issue**: Vite dev server not running
```bash
npm run dev:frontend
```

### API Connection Errors

**Check backend health**:
```bash
curl http://localhost:4000/api/health
```

**Check frontend config**:
```bash
# Verify VITE_API_URL in frontend/.env or vite.config.ts
```

### Docker Issues

**Rebuild containers**:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

**View logs**:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## 📖 Additional Resources

- **README.md** - Project overview and quick links
- **SETUP.md** - Detailed setup and deployment guide
- **CONTRIBUTING.md** - How to contribute to the project
- **CHANGELOG.md** - Version history and updates
- **backend/README.md** - Backend-specific documentation
- **frontend/README.md** - Frontend-specific documentation
- **cpp-analyzer/README.md** - C++ analyzer documentation

---

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](../CONTRIBUTING.md) for:
- Code style guidelines
- Commit message conventions
- Pull request process
- Issue reporting guidelines

---

## 📝 License

MIT License - See [LICENSE](../LICENSE) file for details

---

## 💡 Tips & Tricks

### Performance

- Use production builds for better performance: `npm run build`
- Enable caching in browser DevTools for faster development
- Use Docker for consistent environments

### Development

- Use TypeScript strict mode for better type safety
- Write tests for new features
- Follow ESLint rules (auto-fix with `npm run format`)

### Debugging

- Use VS Code debugger for backend (configured in `.vscode/launch.json`)
- Use Chrome DevTools for frontend debugging
- Check Docker logs for deployment issues: `docker-compose logs`

---

## 📞 Support

- **Issues**: Report bugs on [GitHub Issues](https://github.com/tobiasworkstech/mla/issues)
- **Discussions**: Ask questions on [GitHub Discussions](https://github.com/tobiasworkstech/mla/discussions)
- **Documentation**: Check wiki pages for detailed guides

---

## 🎉 Getting Started Checklist

- [ ] Clone the repository
- [ ] Install Node.js 18+
- [ ] Get Claude API key from https://console.anthropic.com
- [ ] Run `bash setup.sh` or `npm install`
- [ ] Add API key to `backend/.env`
- [ ] Start with `npm run dev` or `docker-compose up`
- [ ] Open http://localhost:3000
- [ ] Upload a test C/C++ file
- [ ] Explore the analysis results

---

**Made with ❤️ for developers who care about code quality**

*Last updated: November 2025*
