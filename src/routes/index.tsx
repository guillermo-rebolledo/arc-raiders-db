import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Package,
  Swords,
  ScrollText,
  Store,
  Clock,
  ChevronRight,
  Zap,
  Shield,
  Target,
  Users,
} from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
  head: () => ({
    meta: [
      { title: 'ARC Raiders Wiki - Your Ultimate Game Guide' },
      {
        name: 'description',
        content:
          'The ultimate community-driven wiki for ARC Raiders. Find items, quests, traders, ARCs, and live event timers. Your complete guide to surviving the ARC.',
      },
      {
        property: 'og:title',
        content: 'ARC Raiders Wiki - Your Ultimate Game Guide',
      },
      {
        property: 'og:description',
        content:
          'The ultimate community-driven wiki for ARC Raiders. Your complete guide to surviving the ARC.',
      },
    ],
  }),
})

const quickLinks = [
  {
    path: '/items',
    label: 'Items Database',
    description: 'Browse all items, weapons, and equipment',
    icon: Package,
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-400',
  },
  {
    path: '/quests',
    label: 'Quests',
    description: 'View all quests and their requirements',
    icon: ScrollText,
    color: 'from-emerald-500/20 to-green-500/20',
    borderColor: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
  },
  {
    path: '/traders',
    label: 'Traders',
    description: 'Check trader inventories and prices',
    icon: Store,
    color: 'from-purple-500/20 to-violet-500/20',
    borderColor: 'border-purple-500/30',
    iconColor: 'text-purple-400',
  },
  {
    path: '/events',
    label: 'Event Timers',
    description: 'Track active and upcoming events',
    icon: Clock,
    color: 'from-amber-500/20 to-orange-500/20',
    borderColor: 'border-amber-500/30',
    iconColor: 'text-amber-400',
  },
  {
    path: '/arcs',
    label: 'ARCs',
    description: 'Explore missions and activities',
    icon: Swords,
    color: 'from-red-500/20 to-rose-500/20',
    borderColor: 'border-red-500/30',
    iconColor: 'text-red-400',
  },
]

const features = [
  {
    icon: Zap,
    title: 'Real-time Data',
    description:
      'Powered by community-sourced data from MetaForge, updated regularly',
  },
  {
    icon: Shield,
    title: 'Cached for Speed',
    description:
      'Smart caching ensures fast load times without hammering the API',
  },
  {
    icon: Target,
    title: 'Accurate Info',
    description: 'Detailed information on items, quests, and game mechanics',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Built by raiders, for raiders. Help us improve!',
  },
]

function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-zinc-950 to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 blur-[100px] rounded-full" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #f59e0b 1px, transparent 1px),
                            linear-gradient(to bottom, #f59e0b 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              Community Wiki
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
              <span className="block text-zinc-100" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                ARC RAIDERS
              </span>
              <span className="block text-amber-500" style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>
                DATABASE
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-400 mb-12" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Your ultimate resource for ARC Raiders. Browse items, track
              quests, check trader inventories, and never miss an event.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/items"
                className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold rounded-lg transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                <Package className="h-5 w-5" />
                Browse Items
              </Link>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold rounded-lg transition-all border border-zinc-700"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                <Clock className="h-5 w-5" />
                Event Timers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="relative py-16 px-4">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-zinc-100 mb-8" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            Quick Access
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${link.color} border ${link.borderColor} p-6 transition-all hover:scale-[1.02] hover:shadow-xl`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-zinc-900/50 ${link.iconColor} mb-4`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold text-zinc-100 mb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                        {link.label}
                      </h3>
                      <p className="text-sm text-zinc-400">{link.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-zinc-900/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-100 mb-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Why Use This Wiki?
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Built with performance and usability in mind, our wiki provides
              fast access to all the game data you need.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl bg-zinc-800/30 border border-zinc-700/50"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-amber-500/10 text-amber-500 mb-4">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-100 mb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-400">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Data Attribution */}
      <section className="py-12 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-zinc-500 text-sm">
            All game data is sourced from the{' '}
            <a
              href="https://metaforge.app/arc-raiders"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:text-amber-400 transition-colors"
            >
              MetaForge API
            </a>
            , maintained by the community. Data is cached locally to ensure
            fast load times and respect API rate limits.
          </p>
        </div>
      </section>
    </div>
  )
}
