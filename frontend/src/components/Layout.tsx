import { Link } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950">
      <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">MLA</span>
            </div>
            <span className="text-xl font-bold text-slate-50">Memory Leak Analyzer</span>
          </Link>
          <div className="flex gap-6">
            <Link to="/" className="text-slate-300 hover:text-white transition">
              Dashboard
            </Link>
            <Link to="/analyze" className="text-slate-300 hover:text-white transition">
              Analyze
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
