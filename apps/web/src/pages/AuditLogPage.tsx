import { useQuery } from '@tanstack/react-query'
import { ScrollText, CheckCircle, XCircle, Clock } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { auditApi } from '@/lib/api'

interface AuditEvent {
  id: string
  agent_id: string
  tool_called: string
  outcome: string
  input_summary: string
  latency_ms: number
  created_at: string
}

export function AuditLogPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['audit'],
    queryFn: () => auditApi.list({ limit: 100 }),
  })

  const events: AuditEvent[] = data?.data?.events ?? []

  return (
    <div>
      <PageHeader title="Audit Log" subtitle="Append-only — all agent calls, tool access, and approvals" />
      <div className="p-8">
        <Card padding={false}>
          {isLoading ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <ScrollText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No audit events yet</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Timestamp</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Agent</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Tool</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Outcome</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Latency</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-xs text-gray-500 font-mono whitespace-nowrap">
                      {new Date(e.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 font-mono text-xs">{e.agent_id}</td>
                    <td className="px-6 py-3 text-xs">{e.tool_called}</td>
                    <td className="px-6 py-3">
                      <Badge variant={e.outcome === 'success' ? 'success' : e.outcome === 'failure' ? 'high' : 'warning'}>
                        {e.outcome === 'success' ? <CheckCircle className="h-3 w-3 mr-1" /> :
                         e.outcome === 'failure' ? <XCircle className="h-3 w-3 mr-1" /> :
                         <Clock className="h-3 w-3 mr-1" />}
                        {e.outcome}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-xs font-mono">{e.latency_ms ? `${e.latency_ms}ms` : '—'}</td>
                    <td className="px-6 py-3 text-xs text-gray-600 max-w-xs truncate">{e.input_summary ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  )
}
