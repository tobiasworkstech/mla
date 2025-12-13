import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import multer, { Multer } from 'multer'
import { v4 as uuidv4 } from 'uuid'
import * as fs from 'fs'
import * as path from 'path'
import { analyzeWithOllama } from './services/ollamaService.js'
import { parseMemoryDump } from './services/memoryParser.js'

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors())
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ limit: '100mb' }))

// Setup file uploads
const storage = multer.memoryStorage()
const upload: Multer = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } })

// Store analysis results in memory (use database in production)
const analysisResults = new Map<string, any>()

// Helper: Find all C/C++ files recursively
function findCppFiles(dirPath: string, extensions = ['.c', '.cpp', '.cc', '.cxx', '.h', '.hpp', '.hxx']): string[] {
  const files: string[] = []

  function traverse(dir: string) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)

        // Skip node_modules and hidden directories
        if (entry.name.startsWith('.') || entry.name === 'node_modules') continue

        if (entry.isDirectory()) {
          traverse(fullPath)
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase()
          if (extensions.includes(ext)) {
            files.push(fullPath)
          }
        }
      }
    } catch (err) {
      console.error(`Error reading directory ${dir}:`, err)
    }
  }

  traverse(dirPath)
  return files
}

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Memory Leak Analyzer API running' })
})

// Upload and analyze files
app.post('/api/analyze', upload.array('files'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files || (req.files as any).length === 0) {
      res.status(400).json({ error: 'No files uploaded' })
      return
    }

    const analysisId = uuidv4()
    const files = (req.files as any) as Array<Express.Multer.File>

    // Analyze all uploaded files
    const analysisResults_batch = []

    for (const file of files) {
      try {
        const parsedData = await parseMemoryDump(file.buffer)
        const aiAnalysis = await analyzeWithOllama(parsedData, file.originalname)

        analysisResults_batch.push({
          fileName: file.originalname,
          leaksFound: aiAnalysis.leaksFound,
          severity: aiAnalysis.severity,
          issues: aiAnalysis.issues,
          analysis: aiAnalysis.analysis,
        })
      } catch (err) {
        console.error(`Error analyzing ${file.originalname}:`, err)
        analysisResults_batch.push({
          fileName: file.originalname,
          error: err instanceof Error ? err.message : 'Unknown error',
        })
      }
    }

    const result = {
      id: analysisId,
      filesAnalyzed: files.length,
      timestamp: new Date().toISOString(),
      results: analysisResults_batch,
      status: 'completed',
    }

    analysisResults.set(analysisId, result)

    res.json({ id: analysisId, message: `Analyzed ${files.length} files` })
  } catch (error) {
    next(error)
  }
})

// Analyze directory endpoint
app.post('/api/analyze-directory', express.json(), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { directoryPath } = req.body

    if (!directoryPath) {
      res.status(400).json({ error: 'directoryPath is required' })
      return
    }

    // Validate path exists
    if (!fs.existsSync(directoryPath)) {
      res.status(400).json({ error: `Directory not found: ${directoryPath}` })
      return
    }

    // Find all C/C++ files
    const cppFiles = findCppFiles(directoryPath)

    if (cppFiles.length === 0) {
      res.status(400).json({ error: 'No C/C++ files found in directory' })
      return
    }

    const analysisId = uuidv4()
    const analysisResults_batch = []

    // Analyze each file
    for (const filePath of cppFiles) {
      try {
        const buffer = fs.readFileSync(filePath)
        const parsedData = await parseMemoryDump(buffer)
        const relPath = path.relative(directoryPath, filePath)
        const aiAnalysis = await analyzeWithOllama(parsedData, relPath)

        analysisResults_batch.push({
          fileName: relPath,
          fullPath: filePath,
          leaksFound: aiAnalysis.leaksFound,
          severity: aiAnalysis.severity,
          issues: aiAnalysis.issues,
          analysis: aiAnalysis.analysis,
        })
      } catch (err) {
        console.error(`Error analyzing ${filePath}:`, err)
        analysisResults_batch.push({
          fileName: path.relative(directoryPath, filePath),
          fullPath: filePath,
          error: err instanceof Error ? err.message : 'Unknown error',
        })
      }
    }

    const result = {
      id: analysisId,
      directoryPath,
      filesFound: cppFiles.length,
      filesAnalyzed: analysisResults_batch.length,
      timestamp: new Date().toISOString(),
      results: analysisResults_batch,
      status: 'completed',
    }

    analysisResults.set(analysisId, result)

    res.json({
      id: analysisId,
      message: `Found and analyzed ${cppFiles.length} C/C++ files`,
      filesFound: cppFiles.length,
    })
  } catch (error) {
    next(error)
  }
})

// Get analysis results
app.get('/api/results/:id', (req: Request, res: Response) => {
  const { id } = req.params
  const result = analysisResults.get(id)

  if (!result) {
    res.status(404).json({ error: 'Analysis not found' })
    return
  }

  res.json(result)
})

// List recent analyses
app.get('/api/analyses', (req: Request, res: Response) => {
  const analyses = Array.from(analysisResults.values())
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)

  res.json(analyses)
})

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

// Start server
app.listen(PORT, () => {
  console.log(`Memory Leak Analyzer API running on http://localhost:${PORT}`)
})
