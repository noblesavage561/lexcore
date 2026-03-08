import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, CheckSquare, Search,
  ScrollText, Activity, LogOut, Scale
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import clsx from 'clsx'

const nav = [
  { to: '/dashboard',  label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/clients',    label: 'Clients',       icon: Users },
  { to: '/approvals',  label: 'Approval Queue',icon: CheckSquare },
  { to: '/research',   label: 'Research',      icon: Search },
  { to: '/audit',      label: 'Audit Log',     icon: ScrollText },
  { to: '/system',     label: 'System Health', icon: Activity },
]

export function AdminLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-900 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-brand-700">
          <Scale className="h-7 w-7 text-brand-100" />
          <div>
            <p className="text-white font-bold text-lg leading-tight">LexCore</p>
            <p className="text-brand-300 text-xs">BBA Services</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-700 text-white'
                    : 'text-brand-200 hover:bg-brand-800 hover:text-white'
                )
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-brand-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-semibold">
              {user?.full_name?.charAt(0) ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.full_name ?? 'User'}</p>
              <p className="text-brand-300 text-xs capitalize">{user?.role ?? 'staff'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-brand-300 hover:text-white hover:bg-brand-800 rounded-lg text-sm transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
