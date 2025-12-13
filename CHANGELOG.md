# Changelog

## [1.1.0] - 2025-12-13

### Changed
- **AI Provider**: Migrated from Anthropic Claude to **Ollama (Gemma 3)** for local analysis.
- **Cleanup**: Removed unused Claude services and dependencies.

### Added
- **Ollama Integration**: New `ollamaService.ts` to handle local model inference.
- **Environment Config**: Added `OLLAMA_MODEL` and `OLLAMA_HOST` configuration support.

## [1.0.0] - 2024-11-26

### Added
- Initial project setup
- React frontend with TypeScript and Tailwind CSS
- Node.js/Express backend with Claude AI integration
- C/C++ memory analysis engine scaffolding
- File upload and analysis interface
- Results visualization dashboard
- Memory leak detection patterns
- AI-powered analysis recommendations
- Docker support
- Complete project documentation

### Features
- Local file analysis for C/C++ binaries and source
- Claude AI integration for intelligent analysis
- Real-time memory issue visualization
- Comprehensive analysis reports
- Support for multiple file formats

### Infrastructure
- Docker and Docker Compose setup
- GitHub Actions ready
- ESLint and TypeScript configuration
- Development server with hot reload
