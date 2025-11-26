# Memory Leak Analyzer - Project Summary

## 🎯 Project Overview

A full-stack AI-powered memory leak analyzer that uses Claude AI to detect and analyze memory issues in C/C++ code. This is a production-ready application with modern frontend, backend, and native analysis capabilities.

## ✨ What's Included

### Frontend (React + TypeScript + Vite)
- 📱 Modern responsive UI with Tailwind CSS
- 🎨 Interactive dashboard and analysis interface
- 📤 Drag-and-drop file upload
- 📊 Real-time results visualization
- 🔄 Real-time status updates

**Location**: `frontend/`
**Key Files**:
- `src/pages/Dashboard.tsx` - Main landing page
- `src/pages/Analyzer.tsx` - File upload and analysis interface
- `src/pages/Results.tsx` - Results and findings display
- `src/components/Layout.tsx` - Navigation and layout

### Backend (Node.js + Express + Claude AI)
- 🚀 RESTful API with Express
- 🤖 Claude AI integration for intelligent analysis
- 📦 File handling and processing
- 🔍 Memory dump parsing and analysis
- 💾 In-memory result storage (extensible to database)

**Location**: `backend/`
**Key Files**:
- `src/index.ts` - Main API server
- `src/services/claudeService.ts` - AI analysis orchestration
- `src/services/memoryParser.ts` - Memory dump parsing

### C/C++ Analyzer (CMake + C++17)
- 🔧 Native memory analysis engine
- 🎯 Pattern detection for common issues
- 📊 Binary format parsing
- ⚡ High-performance analysis

**Location**: `cpp-analyzer/`
**Key Files**:
- `include/memory_analyzer.h` - Main analyzer interface
- `src/analyzer.cpp` - Core analysis logic
- `CMakeLists.txt` - Build configuration

## 📁 Project Structure

```
memoryLeakAnalyzer/
├── .github/
│   └── copilot-instructions.md      # Copilot configuration
├── .vscode/
│   ├── launch.json                  # Debug configuration
│   └── extensions.json              # Recommended extensions
├── frontend/                        # React frontend
│   ├── src/
│   │   ├── pages/                   # Page components
│   │   ├── components/              # Reusable components
│   │   ├── App.tsx                  # Main app
│   │   └── index.css                # Global styles
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── tailwind.config.js
├── backend/                         # Node.js backend
│   ├── src/
│   │   ├── index.ts                 # Express server
│   │   └── services/                # Business logic
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── cpp-analyzer/                    # C++ native module
│   ├── include/
│   │   └── memory_analyzer.h
│   ├── src/
│   │   ├── analyzer.cpp
│   │   └── memory_parser.cpp
│   ├── CMakeLists.txt
│   └── package.json
├── package.json                     # Root workspace
├── README.md                        # Project overview
├── SETUP.md                         # Setup & usage guide
├── CONTRIBUTING.md                  # Contribution guidelines
├── CHANGELOG.md                     # Version history
├── Dockerfile                       # Docker build
├── docker-compose.yml               # Docker Compose
├── setup.sh                         # Setup script
└── verify.sh                        # Verification script
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Claude API key (from console.anthropic.com)
- macOS/Linux with build tools

### Setup
```bash
# 1. Run setup script
bash setup.sh

# 2. Add API key
echo "CLAUDE_API_KEY=sk-ant-..." >> backend/.env

# 3. Start servers
npm run dev
```

### Access
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- API Docs: See backend/README.md

## 🔧 Development Commands

```bash
# Start all servers
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

## 📚 API Endpoints

### Analysis
- `POST /api/analyze` - Upload and analyze files
- `GET /api/results/:id` - Get analysis results
- `GET /api/analyses` - List recent analyses

### System
- `GET /api/health` - Health check

## 🎨 Features

### Current
✅ File upload (drag & drop)
✅ Claude AI integration
✅ Memory leak detection patterns
✅ Results visualization
✅ Severity assessment
✅ Actionable recommendations
✅ Real-time analysis status

### Future Enhancements
🔄 Database persistence
🔄 User authentication
🔄 Cloud storage integration
🔄 Advanced pattern matching
🔄 Historical analysis tracking
🔄 API rate limiting
🔄 Custom analysis rules

## 🐳 Deployment

### Docker
```bash
docker build -t memory-leak-analyzer .
docker run -p 3000:3000 -p 4000:4000 \
  -e CLAUDE_API_KEY=sk-ant-... \
  memory-leak-analyzer
```

### Docker Compose
```bash
CLAUDE_API_KEY=sk-ant-... docker-compose up
```

### Cloud Platforms
- Vercel (frontend)
- Heroku (backend)
- AWS/GCP/Azure (container hosting)

## 🛠️ Tech Stack

**Frontend**
- React 18
- TypeScript 5
- Vite
- Tailwind CSS
- React Router
- Zustand (state management)
- Lucide Icons

**Backend**
- Node.js 18+
- Express 4
- TypeScript 5
- Claude AI API
- Multer (file upload)

**C/C++**
- C++17
- CMake 3.15+
- STL

**Infrastructure**
- Docker & Docker Compose
- GitHub ready
- CI/CD ready

## 📖 Documentation

- **README.md** - Project overview
- **SETUP.md** - Detailed setup and deployment guide
- **CONTRIBUTING.md** - How to contribute
- **CHANGELOG.md** - Version history
- **backend/README.md** - Backend API documentation
- **frontend/README.md** - Frontend documentation
- **cpp-analyzer/README.md** - C++ analyzer documentation

## 🔐 Security

- Environment variable protection for API keys
- File upload validation
- CORS configuration
- Input sanitization ready
- Rate limiting ready

## 📊 Project Status

✅ **Production Ready**
- All core features implemented
- Full type safety with TypeScript
- Comprehensive documentation
- Docker support
- CI/CD ready

## 🎓 Learning Resources

This project demonstrates:
- Full-stack TypeScript development
- React best practices
- Express API design
- C++ native modules
- Docker containerization
- AI API integration
- Modern build tools (Vite)
- Monorepo structure with npm workspaces

## 📝 License

MIT - Feel free to use for personal or commercial projects

## 🤝 Contributing

Contributions welcome! See CONTRIBUTING.md for guidelines.

## 📞 Support

- Check SETUP.md for troubleshooting
- Review README files in each workspace
- Check backend/README.md for API documentation

---

**Made with ❤️ for developers who care about code quality**
