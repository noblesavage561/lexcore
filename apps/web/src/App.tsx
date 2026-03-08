import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/lib/store'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ClientsPage } from '@/pages/ClientsPage'
import { ApprovalQueuePage } from '@/pages/ApprovalQueuePage'
import { ResearchWorkstationPage } from '@/pages/ResearchWorkstationPage'
import { AuditLogPage } from '@/pages/AuditLogPage'
import { SystemHealthPage } from '@/pages/SystemHealthPage'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="approvals" element={<ApprovalQueuePage />} />
        <Route path="research" element={<ResearchWorkstationPage />} />
        <Route path="audit" element={<AuditLogPage />} />
        <Route path="system" element={<SystemHealthPage />} />
      </Route>
    </Routes>
  )
}
