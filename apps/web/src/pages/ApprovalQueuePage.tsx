import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, XCircle, RotateCcw, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { approvalsApi } from '@/lib/api'

interface Approval {
  id: string
  action_summary: string
  risk_score: 'HIGH' | 'MEDIUM' | 'LOW'
  scope: string
  status: string
  proposed_action: Record<string, unknown>
  created_at: string
}

export function ApprovalQueuePage() {
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL')
  const [notes, setNotes] = useState<Record<string, string>>({})
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['approvals', 'pending'],
    queryFn: () => approvalsApi.list({ status: 'pending' }),
  })

  const decide = useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: string }) =>
      approvalsApi.decide(id, decision, notes[id]),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['approvals'] })
      setNotes(prev => { const n = { ...prev }; delete n[id]; return n })
    },
  })

  const approvals: Approval[] = data?.data ?? []
  const filtered = filter === 'ALL' ? approvals : approvals.filter((a) => a.risk_score === filter)

  const riskOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 }
  const sorted = [...filtered].sort((a, b) => riskOrder[a.risk_score] - riskOrder[b.risk_score])

  return (
    <div>
      <PageHeader
        title="Approval Queue"
        subtitle={`${approvals.length} pending item${approvals.length !== 1 ? 's' : ''} across all clients`}
      />

      <div className="p-8 space-y-6">
        {/* Filters */}
        <div className="flex gap-2">
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                filter === r
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-brand-400'
              }`}
            >
              {r === 'ALL' ? 'All Items' : `${r} Risk`}
            </button>
          ))}
        </div>

        {/* Queue */}
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : sorted.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Queue is clear</p>
              <p className="text-sm text-gray-400 mt-1">No pending approvals{filter !== 'ALL' ? ` at ${filter} risk` : ''}</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {sorted.map((approval) => (
              <Card key={approval.id} padding={false}>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant={approval.risk_score === 'HIGH' ? 'high' : approval.risk_score === 'MEDIUM' ? 'medium' : 'low'}>
                          {approval.risk_score === 'HIGH' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {approval.risk_score} RISK
                        </Badge>
                        <Badge variant="info">{approval.scope.toUpperCase()}</Badge>
                      </div>
                      <h3 className="text-gray-900 font-medium">{approval.action_summary}</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Requested {new Date(approval.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Proposed action preview */}
                  <div className="mt-4 bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-500 mb-1">Proposed Action</p>
                    <pre className="text-xs text-gray-700 overflow-auto max-h-32 whitespace-pre-wrap">
                      {JSON.stringify(approval.proposed_action, null, 2)}
                    </pre>
                  </div>

                  {/* Note input */}
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="Audit note (required for deny/return)..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      value={notes[approval.id] ?? ''}
                      onChange={(e) => setNotes(prev => ({ ...prev, [approval.id]: e.target.value }))}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => decide.mutate({ id: approval.id, decision: 'approved' })}
                      disabled={decide.isPending}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => decide.mutate({ id: approval.id, decision: 'denied' })}
                      disabled={decide.isPending}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                      Deny
                    </button>
                    <button
                      onClick={() => decide.mutate({ id: approval.id, decision: 'returned' })}
                      disabled={decide.isPending}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Return
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
