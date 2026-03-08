import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Briefcase, CheckSquare, Bell, LogOut, Scale } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import clsx from 'clsx'

const nav = [
  { to: '/matters',   label: 'My Matters',      icon: Briefcase },
  { to: '/approvals', label: 'Approval Center',  icon: CheckSquare },
  { to: '/alerts',    label: 'Alerts',           icon: Bell },
]

export function ClientLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-60 bg-brand-900 flex flex-col">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-brand-700">
          <Scale className="h-6 w-6 text-brand-100" />
          <div>
            <p className="text-white font-bold text-base">LexCore</p>
            <p className="text-brand-300 text-xs">Client Portal</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive ? 'bg-brand-700 text-white' : 'text-brand-200 hover:bg-brand-800 hover:text-white')
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-brand-700">
          <p className="text-white text-sm font-medium truncate mb-1">{user?.full_name ?? 'Client'}</p>
          <button
            onClick={() => { logout(); navigate('/login') }}
            className="flex items-center gap-2 text-brand-300 hover:text-white text-sm py-1"
          >
            <LogOut className="h-4 w-4" />Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto"><Outlet /></main>
    </div>
  )
}
