import { Bell, BookOpen, Calendar, Scale } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const MOCK_ALERTS = [
  { id: '1', type: 'statute', title: 'Florida Statute § 718.116 amended', description: 'Condominium association assessment collection procedures updated.', date: '2025-01-15', domain: 'real_estate' },
  { id: '2', type: 'deadline', title: 'Response deadline in 30 days', description: 'Bureau dispute response window closes March 15, 2025.', date: '2025-02-13', domain: 'consumer_credit' },
  { id: '3', type: 'legislation', title: 'HB 1203 — Committee advance', description: 'Florida House Bill 1203 passed committee, heading to floor vote.', date: '2025-02-10', domain: 'political' },
]

const typeIcon = (t: string) => {
  if (t === 'statute') return <Scale className="h-4 w-4" />
  if (t === 'deadline') return <Calendar className="h-4 w-4" />
  return <BookOpen className="h-4 w-4" />
}

export function AlertsPage() {
  return (
    <div>
      <PageHeader title="Alerts & Monitoring" subtitle="Proactive intelligence — statute changes, deadlines, legislative updates" />
      <div className="p-6 space-y-4">
        {MOCK_ALERTS.map((a) => (
          <Card key={a.id}>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0 text-brand-600">
                {typeIcon(a.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-gray-900">{a.title}</p>
                  <Badge variant="info" className="capitalize">{a.domain.replace('_',' ')}</Badge>
                </div>
                <p className="text-sm text-gray-600">{a.description}</p>
                <p className="text-xs text-gray-400 mt-1.5">{new Date(a.date).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>
        ))}
        <Card>
          <div className="text-center py-8">
            <Bell className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Bookmark statutes and properties to receive real-time change alerts</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
