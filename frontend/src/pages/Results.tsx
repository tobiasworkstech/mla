import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AlertCircle, CheckCircle, TrendingDown, Loader, FolderOpen } from 'lucide-react'

interface Issue {
  type: string
  location: string
  severity: string
  description: string
  recommendation: string
  codeSnippet?: {
    lineNumber: number
    code: string
    context: string[]
  }
  lineNumber?: number
}

interface FileResult {
  fileName: string
  fullPath?: string
  leaksFound?: number
  severity?: string
  issues?: Issue[]
  analysis?: string
  error?: string
}

interface AnalysisResult {
  id: string
  fileName?: string
  filesAnalyzed?: number
  filesFound?: number
  directoryPath?: string
  timestamp: string
  leaksFound?: number
  severity?: string
  issues?: Issue[]
  aiAnalysis?: string
  results?: FileResult[]
  status: string
}

export default function Results() {
  const { id } = useParams<{ id: string }>()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/results/${id}`)
        if (!response.ok) throw new Error('Failed to fetch results')
        const data = await response.json()
        setResult(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchResults()
  }, [id])

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    )

  if (error)
    return (
      <div className="card border-red-700 bg-red-950 flex gap-3">
        <AlertCircle className="w-6 h-6 text-red-400" />
        <p className="text-red-200">{error}</p>
      </div>
    )

  if (!result) return null

  const severityColors: Record<string, string> = {
    critical: 'text-red-400',
    high: 'text-orange-400',
    medium: 'text-yellow-400',
    low: 'text-green-400',
  }

  // Check if this is a batch result (multiple files) or single file
  const isBatchResult = result.results && result.results.length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {result.directoryPath ? (
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-8 h-8" />
                  <span>Directory Analysis</span>
                </div>
              ) : (
                result.fileName
              )}
            </h1>
            {result.directoryPath && <p className="text-slate-400">{result.directoryPath}</p>}
          </div>
          <p className="text-slate-400">{new Date(result.timestamp).toLocaleString()}</p>
        </div>
      </div>

      {/* Summary Stats */}
      {isBatchResult ? (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <FolderOpen className="w-6 h-6 text-blue-400" />
              <span className="text-sm font-semibold text-slate-400">Files Analyzed</span>
            </div>
            <p className="text-2xl font-bold text-blue-400">{result.filesAnalyzed}</p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-6 h-6 text-red-400" />
              <span className="text-sm font-semibold text-slate-400">Total Issues</span>
            </div>
            <p className="text-2xl font-bold text-red-400">
              {(result.results || []).reduce((sum, r: FileResult) => sum + (r.leaksFound || 0), 0)}
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-sm font-semibold text-slate-400">Status</span>
            </div>
            <p className="text-2xl font-bold text-green-400">Completed</p>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className={`w-6 h-6 ${severityColors[result.severity || 'low']}`} />
              <span className="text-sm font-semibold text-slate-400">Severity</span>
            </div>
            <p className={`text-2xl font-bold ${severityColors[result.severity || 'low']}`}>
              {(result.severity || 'low').toUpperCase()}
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-6 h-6 text-red-400" />
              <span className="text-sm font-semibold text-slate-400">Issues Found</span>
            </div>
            <p className="text-2xl font-bold text-red-400">{result.leaksFound}</p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-blue-400" />
              <span className="text-sm font-semibold text-slate-400">Status</span>
            </div>
            <p className="text-2xl font-bold text-blue-400">Analyzed</p>
          </div>
        </div>
      )}

      {/* Batch Results */}
      {isBatchResult ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Analysis Results</h2>
          {result.results?.map((fileResult: FileResult, idx: number) => (
            <div key={idx} className="card">
              <button
                onClick={() => {
                  const newSet = new Set(expandedFiles)
                  if (newSet.has(fileResult.fileName)) {
                    newSet.delete(fileResult.fileName)
                  } else {
                    newSet.add(fileResult.fileName)
                  }
                  setExpandedFiles(newSet)
                }}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{fileResult.fileName}</h3>
                      {fileResult.error ? (
                        <p className="text-red-400 text-sm">Error: {fileResult.error}</p>
                      ) : (
                        <div className="flex gap-4 text-sm text-slate-400">
                          <span>Issues: {fileResult.leaksFound}</span>
                          <span className={`${severityColors[fileResult.severity?.toLowerCase() || 'low']}`}>
                            {(fileResult.severity || 'low').toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-slate-400">{expandedFiles.has(fileResult.fileName) ? '▼' : '▶'}</span>
                </div>
              </button>

              {expandedFiles.has(fileResult.fileName) && !fileResult.error && (
                <div className="mt-4 space-y-4 border-t border-slate-700 pt-4">
                  {fileResult.analysis && (
                    <div className="bg-slate-800 p-4 rounded">
                      <h4 className="font-semibold mb-2 text-slate-300">AI Analysis</h4>
                      <p className="text-slate-300 text-sm whitespace-pre-wrap">{fileResult.analysis}</p>
                    </div>
                  )}

                  {fileResult.issues && fileResult.issues.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-slate-300">Detected Issues</h4>
                      <div className="space-y-3">
                        {fileResult.issues.map((issue: Issue, issuIdx: number) => (
                          <div key={issuIdx} className="border-l-4 border-blue-500 pl-4 py-2">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold">{issue.type}</h5>
                              <span className={`text-sm font-medium ${severityColors[issue.severity?.toLowerCase() || 'low']}`}>
                                {issue.severity}
                              </span>
                            </div>
                            <p className="text-slate-400 text-sm mb-2">{issue.location}</p>
                            <p className="text-slate-300 mb-2">{issue.description}</p>
                            
                            {/* Code Snippet Display */}
                            {issue.codeSnippet && (
                              <div className="bg-slate-900 rounded p-3 mb-3 font-mono text-sm">
                                <div className="text-slate-400 mb-2">
                                  <span className="text-yellow-400">→ Line {issue.codeSnippet.lineNumber}</span>
                                </div>
                                <div className="bg-slate-950 rounded p-2 mb-2 border-l-2 border-red-500">
                                  <div className="text-red-300">{issue.codeSnippet.code}</div>
                                </div>
                                {issue.codeSnippet.context && issue.codeSnippet.context.length > 0 && (
                                  <div className="text-slate-500 text-xs mt-2 pt-2 border-t border-slate-700">
                                    <div className="text-slate-400 mb-1">Context:</div>
                                    {issue.codeSnippet.context.map((line, i) => (
                                      <div key={i} className="text-slate-600">{line.trim() || '...'}</div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            <div className="bg-slate-900 rounded p-2 text-sm text-slate-300">
                              <span className="font-semibold text-green-400">💡 Fix: </span>
                              {issue.recommendation}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Single File Results */}
          {result.aiAnalysis && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">AI Analysis</h2>
              <p className="text-slate-300 whitespace-pre-wrap">{result.aiAnalysis}</p>
            </div>
          )}

          {result.issues && result.issues.length > 0 && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Detected Issues</h2>
              <div className="space-y-4">
                {result.issues.map((issue: Issue, idx: number) => (
                  <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{issue.type}</h3>
                      <span className={`text-sm font-medium ${severityColors[issue.severity?.toLowerCase() || 'low']}`}>
                        {issue.severity}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{issue.location}</p>
                    <p className="text-slate-300 mb-2">{issue.description}</p>
                    
                    {/* Code Snippet Display */}
                    {issue.codeSnippet && (
                      <div className="bg-slate-900 rounded p-3 mb-3 font-mono text-sm">
                        <div className="text-slate-400 mb-2">
                          <span className="text-yellow-400">→ Line {issue.codeSnippet.lineNumber}</span>
                        </div>
                        <div className="bg-slate-950 rounded p-2 mb-2 border-l-2 border-red-500">
                          <div className="text-red-300">{issue.codeSnippet.code}</div>
                        </div>
                        {issue.codeSnippet.context && issue.codeSnippet.context.length > 0 && (
                          <div className="text-slate-500 text-xs mt-2 pt-2 border-t border-slate-700">
                            <div className="text-slate-400 mb-1">Context:</div>
                            {issue.codeSnippet.context.map((line, i) => (
                              <div key={i} className="text-slate-600">{line.trim() || '...'}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="bg-slate-800 rounded p-2 text-sm text-slate-300">
                      <span className="font-semibold text-green-400">💡 Fix: </span>
                      {issue.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
