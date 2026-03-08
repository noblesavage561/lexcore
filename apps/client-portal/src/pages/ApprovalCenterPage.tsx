import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
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
  proposed_action: Record<string, unknown>
  created_at: string
}

export function ApprovalCenterPage() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['my-approvals'],
    queryFn: () => approvalsApi.list({ status: 'pending' }),
  })

  const decide = useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: string }) =>
      approvalsApi.decide(id, decision),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-approvals'] }),
  })

  const approvals: Approval[] = data?.data ?? []

  return (
    <div>
      <PageHeader title="Approval Center" subtitle="Review AI-drafted actions before execution. Nothing sends without your approval." />
      <div className="p-6 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : approvals.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <p className="text-gray-500">No pending approvals</p>
              <p className="text-sm text-gray-400 mt-1">AI actions will appear here before they execute</p>
            </div>
          </Card>
        ) : (
          approvals.map((a) => (
            <Card key={a.id}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={a.risk_score === 'HIGH' ? 'high' : a.risk_score === 'MEDIUM' ? 'medium' : 'low'}>
                      {a.risk_score === 'HIGH' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {a.risk_score} RISK
                    </Badge>
                    <Badge variant="info">{a.scope}</Badge>
                  </div>
                  <p className="font-medium text-gray-900">{a.action_summary}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(a.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs font-medium text-gray-500 mb-1">What will happen</p>
                <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-auto max-h-24">
                  {JSON.stringify(a.proposed_action, null, 2)}
                </pre>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => decide.mutate({ id: a.id, decision: 'approved' })}
                  disabled={decide.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700"
                >
                  <CheckCircle className="h-4 w-4" />Approve
                </button>
                <button
                  onClick={() => decide.mutate({ id: a.id, decision: 'denied' })}
                  disabled={decide.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
                >
                  <XCircle className="h-4 w-4" />Deny
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
