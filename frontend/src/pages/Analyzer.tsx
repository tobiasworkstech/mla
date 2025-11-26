import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, AlertCircle, FolderOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Analyzer() {
  const navigate = useNavigate()
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [directoryPath, setDirectoryPath] = useState('')
  const [mode, setMode] = useState<'upload' | 'directory'>('upload')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles])
    setError('')
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/octet-stream': ['.bin', '.o', '.so', '.dylib'],
      'text/plain': ['.c', '.cpp', '.h', '.hpp', '.cc', '.cxx'],
    },
  })

  const handleAnalyzeFiles = async () => {
    if (files.length === 0) {
      setError('Please upload at least one file')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      files.forEach((file) => formData.append('files', file))

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Analysis failed')

      const data = await response.json()
      navigate(`/results/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyzeDirectory = async () => {
    if (!directoryPath.trim()) {
      setError('Please enter a directory path')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/analyze-directory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ directoryPath: directoryPath.trim() }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Analysis failed')
      }

      const data = await response.json()
      navigate(`/results/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Analyze Memory Issues</h1>
        <p className="text-slate-400">Upload files or analyze a directory for C/C++ code</p>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-4">
        <button
          onClick={() => setMode('upload')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            mode === 'upload' ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          Upload Files
        </button>
        <button
          onClick={() => setMode('directory')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            mode === 'directory' ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          Analyze Directory
        </button>
      </div>

      {/* File Upload Mode */}
      {mode === 'upload' && (
        <div className="card">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition ${
              isDragActive
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            {isDragActive ? (
              <p className="text-blue-400">Drop files here...</p>
            ) : (
              <div>
                <p className="text-slate-300 mb-2">Drag files here or click to select</p>
                <p className="text-slate-500 text-sm">
                  Supports .c, .cpp, .h, .hpp, .cc, .cxx, .bin, .o, .so, .dylib
                </p>
              </div>
            )}
          </div>

          {files.length > 0 && (
            <div className="mt-6 space-y-4">
              <h2 className="text-lg font-semibold">Uploaded Files ({files.length})</h2>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-800 rounded">
                    <span className="text-slate-300">{file.name}</span>
                    <span className="text-slate-500 text-sm">{(file.size / 1024).toFixed(2)} KB</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleAnalyzeFiles}
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed w-full py-3"
              >
                {loading ? 'Analyzing...' : 'Analyze with AI'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Directory Analysis Mode */}
      {mode === 'directory' && (
        <div className="card space-y-4">
          <div className="flex items-center gap-3 text-slate-300 mb-4">
            <FolderOpen className="w-5 h-5" />
            <p>Enter the full path to a directory containing C/C++ files</p>
          </div>

          <input
            type="text"
            value={directoryPath}
            onChange={(e) => {
              setDirectoryPath(e.target.value)
              setError('')
            }}
            placeholder="e.g., /Users/username/Projects/myproject"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />

          <p className="text-slate-400 text-sm">
            ℹ️ Will automatically find and analyze all C/C++ files (.c, .cpp, .h, .hpp, .cc, .cxx)
          </p>

          <button
            onClick={handleAnalyzeDirectory}
            disabled={loading || !directoryPath.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed w-full py-3"
          >
            {loading ? 'Scanning and Analyzing...' : 'Analyze Directory'}
          </button>

          <div className="bg-slate-800 p-4 rounded text-sm text-slate-300">
            <p className="font-semibold mb-2">Example paths:</p>
            <p>• macOS/Linux: /home/user/projects/myapp</p>
            <p>• macOS: /Users/username/Documents/code</p>
            <p>• Windows (WSL): /mnt/c/Users/username/projects</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="card border-red-700 bg-red-950 flex gap-3">
          <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
          <p className="text-red-200">{error}</p>
        </div>
      )}
    </div>
  )
}
