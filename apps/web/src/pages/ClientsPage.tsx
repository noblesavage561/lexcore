import { useQuery } from '@tanstack/react-query'
import { User, Building2, Mail } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { clientsApi } from '@/lib/api'

interface Client {
  id: string
  email: string
  full_name: string
  role: string
  tier: string
  is_active: boolean
}

export function ClientsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsApi.list(),
  })

  const clients: Client[] = data?.data ?? []

  return (
    <div>
      <PageHeader
        title="Client Management"
        subtitle={`${clients.length} registered client${clients.length !== 1 ? 's' : ''}`}
      />
      <div className="p-8">
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : clients.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No clients onboarded yet</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {clients.map((c) => (
              <Card key={c.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
                    {c.role === 'business_owner' ? (
                      <Building2 className="h-5 w-5 text-brand-600" />
                    ) : (
                      <User className="h-5 w-5 text-brand-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{c.full_name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Mail className="h-3 w-3 text-gray-400" />
                      <p className="text-xs text-gray-500 truncate">{c.email}</p>
                    </div>
                    <div className="flex gap-2 mt-2.5">
                      <Badge variant={c.is_active ? 'success' : 'default'}>
                        {c.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="info" className="capitalize">{c.tier}</Badge>
                    </div>
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
