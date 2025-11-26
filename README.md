# Memory Leak Analyzer

An intelligent memory leak detection and analysis tool powered by Claude AI. Analyze C/C++ binaries and source code for memory leaks, corruption, and other issues.

## Features

- **Local File Analysis**: Load and analyze C/C++ binaries and source files locally
- **AI-Powered Analysis**: Claude AI integration for intelligent leak detection and recommendations
- **Real-time Visualization**: Interactive dashboard for memory issue visualization
- **Comprehensive Reports**: Detailed analysis reports with actionable insights
- **Multi-format Support**: Support for binaries, source code, and debug symbols

## Project Structure

```
memoryLeakAnalyzer/
├── frontend/              # React + TypeScript UI
├── backend/               # Node.js + Express API
├── cpp-analyzer/          # C/C++ analysis engine
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.8+
- CMake 3.15+
- Xcode Command Line Tools (macOS)
- Claude API Key

### Installation

1. Install dependencies for all workspaces:
```bash
npm install
```

2. Set up environment variables:
```bash
cp backend/.env.example backend/.env
# Add your Claude API key to backend/.env
```

3. Build the C/C++ analyzer:
```bash
npm run build:backend
```

### Development

Start development servers:
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

### Building

```bash
npm run build
```

### Testing

```bash
npm run test
```

## Usage

1. Open the application in your browser
2. Upload a C/C++ binary or source file
3. Configure analysis parameters
4. Submit for analysis
5. View AI-powered insights and recommendations

## API Documentation

See `backend/README.md` for API documentation.

## C/C++ Analyzer

See `cpp-analyzer/README.md` for details on the analysis engine.

## Contributing

Contributions are welcome! Please follow the coding standards and submit pull requests.

## License

MIT
