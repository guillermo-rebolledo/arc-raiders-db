import { Link, Outlet, useRouterState } from '@tanstack/react-router'
import {
  Package,
  Swords,
  ScrollText,
  Store,
  Clock,
  Home,
  Menu,
  X,
  Database,
  Zap,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/items', label: 'Items', icon: Package },
  { path: '/quests', label: 'Quests', icon: ScrollText },
  { path: '/traders', label: 'Traders', icon: Store },
  { path: '/events', label: 'Events', icon: Clock },
  { path: '/arcs', label: 'ARCs', icon: Swords },
]

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-amber-900/30 bg-zinc-950/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/20 blur-xl group-hover:bg-amber-500/30 transition-colors" />
                <Zap className="relative h-8 w-8 text-amber-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-amber-500">
                  ARC RAIDERS
                </span>
                <span className="text-[10px] font-medium tracking-widest text-zinc-500 uppercase">
                  Community Wiki
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive =
                  currentPath === item.path ||
                  (item.path !== '/' && currentPath.startsWith(item.path))
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Cache indicator */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-zinc-500">
              <Database className="h-3 w-3" />
              <span>Cached</span>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-zinc-100"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-zinc-800 bg-zinc-900/95 backdrop-blur-sm">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive =
                  currentPath === item.path ||
                  (item.path !== '/' && currentPath.startsWith(item.path))
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </nav>
        )}
      </header>

      {/* Main content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 mt-16">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-zinc-500 text-sm">
              <Zap className="h-4 w-4 text-amber-500/50" />
              <p className="text-zinc-500 text-sm">
                Made by{' '}
                <a
                  href="https://memorebo.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-500 hover:text-amber-400 transition-colors"
                >
                  @memo
                </a>{' '}
                All game data is sourced from the{' '}
                <a
                  href="https://metaforge.app/arc-raiders"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-500 hover:text-amber-400 transition-colors"
                >
                  MetaForge API
                </a>
                , maintained by the community. As well as{' '}
                <a
                  href="https://github.com/wangyz1999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-500 hover:text-amber-400 transition-colors"
                >
                  @wangyz1999
                </a>
                's{' '}
                <a
                  href="https://github.com/wangyz1999/arcforge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-500 hover:text-amber-400 transition-colors"
                >
                  arcforge
                </a>{' '}
                GitHub repository. ARC Raiders is a trademark of Embark Studios.
                This site is not affiliated with Embark Studios.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
