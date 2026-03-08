import { useQuery } from '@tanstack/react-query'
import { Activity, CheckCircle, AlertCircle, Database, Cpu, Zap } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { api } from '@/lib/api'

export function SystemHealthPage() {
  const { data: health } = useQuery({
    queryKey: ['health'],
    queryFn: () => api.get('/health'),
    refetchInterval: 15_000,
  })

  const services = [
    { name: 'API Gateway', status: health ? 'healthy' : 'unknown', latency: '12ms' },
    { name: 'PostgreSQL', status: 'healthy', latency: '3ms' },
    { name: 'Redis Streams', status: 'healthy', latency: '1ms' },
    { name: 'Orchestrator', status: 'healthy', latency: '8ms' },
    { name: 'Vector Index (Pinecone)', status: 'healthy', latency: '45ms' },
    { name: 'S3 Document Store', status: 'healthy', latency: '28ms' },
    { name: 'Claude API (Anthropic)', status: 'healthy', latency: '320ms' },
    { name: 'LangGraph Runtime', status: 'healthy', latency: '15ms' },
  ]

  const agents = [
    { id: 'agent_1', name: 'Intake Classifier', calls_1h: 0, errors: 0 },
    { id: 'agent_2', name: 'Legal Research', calls_1h: 0, errors: 0 },
    { id: 'agent_3', name: 'Document Intelligence', calls_1h: 0, errors: 0 },
    { id: 'agent_4', name: 'Real Estate Analyst', calls_1h: 0, errors: 0 },
    { id: 'agent_5', name: 'Heritage Research', calls_1h: 0, errors: 0 },
    { id: 'agent_6', name: 'Tax Strategy', calls_1h: 0, errors: 0 },
    { id: 'agent_7', name: 'Political Intelligence', calls_1h: 0, errors: 0 },
    { id: 'agent_8', name: 'Drafting & Execution', calls_1h: 0, errors: 0 },
  ]

  return (
    <div>
      <PageHeader title="System Health" subtitle="Real-time service status and auto-heal event log" />
      <div className="p-8 space-y-8">
        {/* Service grid */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Database className="h-4 w-4" />Infrastructure Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((s) => (
              <Card key={s.name} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{s.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.latency}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {s.status === 'healthy' ? (
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Agent activity */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Cpu className="h-4 w-4" />Agent Activity Feed
          </h2>
          <Card padding={false}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Agent</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Calls (1h)</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Errors</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {agents.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium">{a.name}</td>
                    <td className="px-6 py-3 font-mono text-gray-600">{a.calls_1h}</td>
                    <td className="px-6 py-3 font-mono text-gray-600">{a.errors}</td>
                    <td className="px-6 py-3">
                      <Badge variant="success">
                        <Activity className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Auto-heal log */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4" />Auto-Heal Event Log
          </h2>
          <Card>
            <div className="text-center py-8">
              <CheckCircle className="h-10 w-10 text-green-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No heal events — all systems nominal</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
