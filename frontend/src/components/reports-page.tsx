import { useState, useEffect } from 'react'
import { ArrowLeft, Sparkles, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import Markdown from 'react-markdown'
import { GlassPanel } from './glass-panel'
import { getAllReports, type Report } from '@/lib/api-reports'

export function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    getAllReports()
      .then((data) => {
        setReports(data)
        if (data.length > 0) setExpandedId(data[0].id)
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const getWeekLabel = (date: string, index: number) => {
    if (index === 0) return 'Latest Report'
    const daysAgo = Math.floor((Date.now() - new Date(date).getTime()) / (24 * 60 * 60 * 1000))
    if (daysAgo < 7) return `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`
    const weeksAgo = Math.floor(daysAgo / 7)
    return `${weeksAgo} week${weeksAgo !== 1 ? 's' : ''} ago`
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-5 py-12 md:py-20">
        <GlassPanel>
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <div className="relative flex size-10 items-center justify-center">
              <div className="border-primary/20 border-t-primary absolute inset-0 animate-spin rounded-full border-2" />
            </div>
            <p className="text-muted-foreground/60 text-sm">Loading reports...</p>
          </div>
        </GlassPanel>
      </div>
    )
  }

  if (reports.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-5 py-12 md:py-20">
        <header className="flex items-center gap-3 px-1">
          <Link
            to="/tasks"
            className="bg-glass-bg/60 border-glass-border text-muted-foreground hover:text-foreground hover:bg-glass-bg flex size-8 items-center justify-center rounded-full border backdrop-blur-xl transition-all duration-200"
          >
            <ArrowLeft className="size-3.5" />
          </Link>
          <h1 className="font-display text-foreground text-3xl font-semibold tracking-tight">
            Weekly Reports
          </h1>
        </header>
        <GlassPanel>
          <div className="flex flex-col items-center gap-4 py-14">
            <p className="text-muted-foreground/60 text-sm">No reports available yet</p>
          </div>
        </GlassPanel>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-5 py-12 md:py-20">
      <header className="flex items-center gap-3 px-1">
        <Link
          to="/"
          className="bg-glass-bg/60 border-glass-border text-muted-foreground hover:text-foreground hover:bg-glass-bg flex size-8 items-center justify-center rounded-full border backdrop-blur-xl transition-all duration-200"
        >
          <ArrowLeft className="size-3.5" />
        </Link>
        <div>
          <h1 className="font-display text-foreground text-3xl font-semibold tracking-tight">
            Weekly Reports
          </h1>
          <p className="text-muted-foreground/50 mt-0.5 text-xs">
            {reports.length} report{reports.length !== 1 ? 's' : ''}
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-3">
        {reports.map((report, index) => (
          <GlassPanel key={report.id}>
            <button
              onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
              className="flex w-full items-center justify-between p-5 text-left transition-opacity hover:opacity-80"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex size-7 items-center justify-center rounded-full">
                  <Sparkles className="text-primary size-3.5" />
                </div>
                <div>
                  <h2 className="font-display text-foreground text-base font-semibold">
                    {getWeekLabel(report.createdAt, index)}
                  </h2>
                  <p className="text-muted-foreground/50 text-xs">{formatDate(report.createdAt)}</p>
                </div>
              </div>
              <ChevronDown
                className={`text-muted-foreground/60 size-4 transition-transform ${
                  expandedId === report.id ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedId === report.id && (
              <div className="border-glass-border/60 border-t px-5 pt-4 pb-5">
                <div className="prose prose-sm dark:prose-invert text-foreground/80 max-w-none">
                  <Markdown>{report.content}</Markdown>
                </div>
              </div>
            )}
          </GlassPanel>
        ))}
      </div>
    </div>
  )
}
