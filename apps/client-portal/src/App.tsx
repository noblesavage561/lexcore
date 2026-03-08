import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/lib/store'
import { ClientLayout } from '@/components/layout/ClientLayout'
import { LoginPage } from '@/pages/LoginPage'
import { MatterDashboardPage } from '@/pages/MatterDashboardPage'
import { MatterDetailPage } from '@/pages/MatterDetailPage'
import { ApprovalCenterPage } from '@/pages/ApprovalCenterPage'
import { AlertsPage } from '@/pages/AlertsPage'

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
            <ClientLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/matters" replace />} />
        <Route path="matters" element={<MatterDashboardPage />} />
        <Route path="matters/:id" element={<MatterDetailPage />} />
        <Route path="approvals" element={<ApprovalCenterPage />} />
        <Route path="alerts" element={<AlertsPage />} />
      </Route>
    </Routes>
  )
}
