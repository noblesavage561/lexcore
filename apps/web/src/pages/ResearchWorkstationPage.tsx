import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Search, Zap, BookOpen, FileText, Building, Globe, MapPin, Users, Landmark } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { researchApi } from '@/lib/api'

const MASTER_PROMPTS = [
  { id: 'p1', icon: Globe, label: 'Cross-Jurisdictional Gap Finder', domain: 'legal',
    description: 'Flag jurisdictional conflicts, preemption, gaps, sunset provisions, enforcement trends.' },
  { id: 'p2', icon: FileText, label: 'Document Intelligence Parser', domain: 'legal',
    description: 'Extract parties, statutes, obligations, deadlines, red flags from any uploaded document.' },
  { id: 'p3', icon: BookOpen, label: 'Strategy & Precedent Builder', domain: 'legal',
    description: 'Build a full research brief with statutes, case law, regulatory guidance, strategy matrix.' },
  { id: 'p4', icon: Users, label: 'Genealogy & Heritage Deep Dive', domain: 'heritage',
    description: 'Newspaper archives, deeds, census, BLM patents, Indigenous land rights, reclassification.' },
  { id: 'p5', icon: Building, label: 'Real Estate Due Diligence Package', domain: 'real_estate',
    description: 'Chain of title, liens, zoning, permits, flood, comps, HOA — complete DD package.' },
  { id: 'p6', icon: Landmark, label: 'Political Intelligence Monitor', domain: 'political',
    description: 'Bill tracking, enacted laws, rulemaking, agency enforcement, lobbying disclosures.' },
  { id: 'p7', icon: Globe, label: 'International Tax & Treaty Analyzer', domain: 'tax',
    description: 'Treaties, withholding, PE risk, transfer pricing, CFC/GILTI/FDII/BEAT, VAT, Pillar Two.' },
  { id: 'p8', icon: Zap, label: 'Adaptive Learning Research Session', domain: 'legal',
    description: 'Living knowledge map, confidence scoring, cross-session persistence, session summary.' },
]

const JURISDICTIONS = [
  { value: 'federal', label: 'Federal Only' },
  { value: 'federal_florida', label: 'Federal + Florida' },
  { value: 'federal_florida_municipal', label: 'Federal + FL + Municipal' },
  { value: 'custom', label: 'Custom' },
]

export function ResearchWorkstationPage() {
  const [matterId, setMatterId] = useState('')
  const [query, setQuery] = useState('')
  const [domain, setDomain] = useState('legal')
  const [jurisdiction, setJurisdiction] = useState('federal_florida')
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)
  const [result, setResult] = useState<Record<string, unknown> | null>(null)

  const research = useMutation({
    mutationFn: () => researchApi.submit({ matter_id: matterId, query, domain, jurisdiction_scope: jurisdiction }),
    onSuccess: (data) => setResult(data.data),
  })

  const applyPrompt = (p: typeof MASTER_PROMPTS[0]) => {
    setSelectedPrompt(p.id)
    setDomain(p.domain)
    setQuery(`[${p.label}]\n\n`)
  }

  return (
    <div>
      <PageHeader title="Research Workstation" subtitle="Power-user interface — 8 master prompts + full configuration" />

      <div className="p-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left: Config + Prompt Library */}
        <div className="xl:col-span-1 space-y-6">
          {/* Prompt Library */}
          <Card padding={false}>
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Zap className="h-4 w-4 text-brand-600" />
                Prompt Library
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {MASTER_PROMPTS.map((p) => {
                const Icon = p.icon
                return (
                  <button
                    key={p.id}
                    onClick={() => applyPrompt(p)}
                    className={`w-full text-left px-5 py-3.5 hover:bg-gray-50 transition-colors ${
                      selectedPrompt === p.id ? 'bg-brand-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1">
                      <Icon className="h-4 w-4 text-brand-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-900">{p.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{p.description}</p>
                  </button>
                )
              })}
            </div>
          </Card>

          {/* Configuration */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Jurisdiction Scope</label>
                <select
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {JURISDICTIONS.map((j) => (
                    <option key={j.value} value={j.value}>{j.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Domain Pack</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {['legal', 'tax', 'real_estate', 'heritage', 'political', 'consumer_credit', 'international', 'business'].map((d) => (
                    <option key={d} value={d}>{d.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Query + Output */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Search className="h-4 w-4 text-brand-600" />
              Research Query
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Matter ID</label>
                <input
                  type="text"
                  value={matterId}
                  onChange={(e) => setMatterId(e.target.value)}
                  placeholder="Enter matter UUID..."
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Query</label>
                <textarea
                  rows={6}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your research query or select a master prompt from the library..."
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none font-mono"
                />
              </div>
              <button
                onClick={() => research.mutate()}
                disabled={research.isPending || !query.trim() || !matterId.trim()}
                className="btn-primary"
              >
                {research.isPending ? <Spinner className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                {research.isPending ? 'Researching...' : 'Run Research'}
              </button>
            </div>
          </Card>

          {/* Output */}
          {result && (
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Research Brief</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-500">Confidence Score</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-brand-600 h-2 rounded-full transition-all"
                      style={{ width: `${((result.confidence_score as number) ?? 0) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-gray-700">
                    {(((result.confidence_score as number) ?? 0) * 100).toFixed(0)}%
                  </span>
                </div>
                <pre className="bg-gray-50 rounded-lg p-4 text-xs text-gray-700 overflow-auto max-h-96 whitespace-pre-wrap">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
