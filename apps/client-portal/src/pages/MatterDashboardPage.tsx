import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { mattersApi } from '@/lib/api'

interface Matter {
  id: string
  title: string
  domain: string
  status: string
  next_action: string | null
  updated_at: string
}

const statusIcon = (s: string) => {
  if (s === 'closed') return <CheckCircle className="h-4 w-4 text-emerald-500" />
  if (s === 'pending_approval') return <AlertCircle className="h-4 w-4 text-amber-500" />
  return <Clock className="h-4 w-4 text-blue-500" />
}

const statusLabel = (s: string) => s.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')

export function MatterDashboardPage() {
  const [showNew, setShowNew] = useState(false)
  const [title, setTitle] = useState('')
  const [domain, setDomain] = useState('legal')
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({ queryKey: ['matters'], queryFn: () => mattersApi.list() })

  const create = useMutation({
    mutationFn: () => mattersApi.create({ title, domain }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['matters'] })
      setShowNew(false); setTitle('')
    },
  })

  const matters: Matter[] = data?.data ?? []

  return (
    <div>
      <PageHeader
        title="My Matters"
        subtitle="All active research and case files"
        action={
          <button onClick={() => setShowNew(true)} className="btn-primary">
            <Plus className="h-4 w-4" />New Matter
          </button>
        }
      />
      <div className="p-6 space-y-6">
        {/* New matter form */}
        {showNew && (
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Open New Matter</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                placeholder="Matter title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <select
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              >
                {['legal','tax','real_estate','heritage','political','consumer_credit','business'].map(d => (
                  <option key={d} value={d}>{d.replace('_',' ')}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => create.mutate()} disabled={!title.trim() || create.isPending} className="btn-primary">
                {create.isPending ? <Spinner className="h-4 w-4" /> : 'Open Matter'}
              </button>
              <button onClick={() => setShowNew(false)} className="btn-secondary">Cancel</button>
            </div>
          </Card>
        )}

        {/* Matter list */}
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : matters.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No matters yet — open one to get started</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {matters.map((m) => (
              <Card
                key={m.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/matters/${m.id}`)}
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{m.title}</p>
                    <p className="text-xs text-gray-500 capitalize mt-0.5">{m.domain.replace('_',' ')}</p>
                    <div className="flex items-center gap-2 mt-2.5">
                      {statusIcon(m.status)}
                      <Badge variant={m.status === 'closed' ? 'success' : m.status === 'pending_approval' ? 'warning' : 'info'}>
                        {statusLabel(m.status)}
                      </Badge>
                    </div>
                    {m.next_action && (
                      <p className="text-xs text-amber-600 mt-2 font-medium">→ {m.next_action}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(m.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
