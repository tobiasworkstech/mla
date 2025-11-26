import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Memory Leak Analyzer</h1>
        <p className="text-xl text-slate-400">Intelligent detection and analysis of memory issues powered by Claude AI</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="card hover:border-blue-500 transition">
          <h3 className="text-xl font-semibold mb-2">Local Analysis</h3>
          <p className="text-slate-400 mb-4">Upload your C/C++ binaries and source files for local analysis</p>
          <Link to="/analyze" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
            Start Analysis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="card hover:border-purple-500 transition">
          <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
          <p className="text-slate-400 mb-4">Claude AI analyzes patterns and provides actionable recommendations</p>
          <Link to="/analyze" className="flex items-center gap-2 text-purple-400 hover:text-purple-300">
            Learn More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-blue-400 mb-2">Memory Detection</h3>
            <p className="text-slate-400 text-sm">Identify memory leaks, use-after-free, and buffer overflows</p>
          </div>
          <div>
            <h3 className="font-semibold text-purple-400 mb-2">Pattern Analysis</h3>
            <p className="text-slate-400 text-sm">AI recognizes common memory corruption patterns</p>
          </div>
          <div>
            <h3 className="font-semibold text-green-400 mb-2">Recommendations</h3>
            <p className="text-slate-400 text-sm">Get actionable fixes and best practices</p>
          </div>
        </div>
      </div>
    </div>
  )
}
