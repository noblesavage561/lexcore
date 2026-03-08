import { useQuery } from '@tanstack/react-query'
import { FileText, Users, CheckSquare, AlertTriangle, TrendingUp, Activity } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { mattersApi, approvalsApi } from '@/lib/api'

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: React.ElementType; color: string }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  )
}

export function DashboardPage() {
  const { data: matters } = useQuery({ queryKey: ['matters'], queryFn: () => mattersApi.list() })
  const { data: approvals } = useQuery({ queryKey: ['approvals', 'pending'], queryFn: () => approvalsApi.list({ status: 'pending' }) })

  const matterList = matters?.data ?? []
  const pendingApprovals = approvals?.data ?? []

  const statusCounts = matterList.reduce((acc: Record<string, number>, m: { status: string }) => {
    acc[m.status] = (acc[m.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="System overview — BBA Services LexCore Platform" />

      <div className="p-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Active Matters" value={matterList.length} icon={FileText} color="bg-blue-50 text-blue-600" />
          <StatCard label="Pending Approvals" value={pendingApprovals.length} icon={CheckSquare} color="bg-amber-50 text-amber-600" />
          <StatCard label="High-Risk Items" value={pendingApprovals.filter((a: { risk_score: string }) => a.risk_score === 'HIGH').length} icon={AlertTriangle} color="bg-red-50 text-red-600" />
          <StatCard label="In Research" value={statusCounts['in_research'] ?? 0} icon={TrendingUp} color="bg-emerald-50 text-emerald-600" />
        </div>

        {/* Recent matters + pending approvals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">Recent Matters</h3>
              <a href="/clients" className="text-sm text-brand-600 hover:underline">View all →</a>
            </div>
            {matterList.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No matters yet</p>
            ) : (
              <div className="space-y-3">
                {matterList.slice(0, 5).map((m: { id: string; title: string; domain: string; status: string }) => (
                  <div key={m.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{m.title}</p>
                      <p className="text-xs text-gray-500 capitalize">{m.domain}</p>
                    </div>
                    <Badge variant={m.status === 'pending_approval' ? 'warning' : m.status === 'closed' ? 'success' : 'info'}>
                      {m.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">Pending Approvals</h3>
              <a href="/approvals" className="text-sm text-brand-600 hover:underline">Manage →</a>
            </div>
            {pendingApprovals.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No pending approvals</p>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.slice(0, 5).map((a: { id: string; action_summary: string; risk_score: string; scope: string }) => (
                  <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{a.action_summary}</p>
                      <p className="text-xs text-gray-500 capitalize">{a.scope}</p>
                    </div>
                    <Badge variant={a.risk_score === 'HIGH' ? 'high' : a.risk_score === 'MEDIUM' ? 'medium' : 'low'}>
                      {a.risk_score}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Agent status */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <Activity className="h-5 w-5 text-brand-600" />
            <h3 className="font-semibold text-gray-900">Agent Status</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Intake Classifier', 'Legal Research', 'Document Intelligence', 'Real Estate Analyst',
              'Heritage Research', 'Tax Strategy', 'Political Intelligence', 'Drafting & Execution'
            ].map((name) => (
              <div key={name} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <div className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <span className="text-xs text-gray-700">{name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
