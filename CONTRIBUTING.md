# Contributing to Memory Leak Analyzer

## Development Setup

1. Fork the repository
2. Clone your fork
3. Create a feature branch: `git checkout -b feature/my-feature`
4. Make your changes
5. Run tests: `npm run test`
6. Commit your changes: `git commit -am 'Add my feature'`
7. Push to the branch: `git push origin feature/my-feature`
8. Submit a pull request

## Code Style

- Use TypeScript for frontend and backend
- Follow ESLint configuration
- Format code with Prettier
- Write comments for complex logic
- Use meaningful variable names

## Project Structure

### Frontend
- Components in `src/components/`
- Pages in `src/pages/`
- Services in `src/services/`
- Styles in `src/*.css`

### Backend
- API routes in `src/`
- Services in `src/services/`
- Types in `src/types/`

### C++ Analyzer
- Headers in `include/`
- Implementation in `src/`

## Testing

Run all tests:
```bash
npm run test
```

Run specific test:
```bash
npm run test -- --testNamePattern="test name"
```

## Debugging

### Backend
```bash
node --inspect-brk --loader ts-node/esm src/index.ts
```

### Frontend
Use Chrome DevTools (F12)

## Building for Production

```bash
npm run build
npm start
```

## Reporting Issues

- Use clear, descriptive titles
- Include steps to reproduce
- Provide error messages and logs
- Mention your environment (OS, Node version, etc.)

## Feature Requests

Describe the feature and why it would be useful. Consider:
- How it benefits users
- Any potential issues
- Implementation approach
