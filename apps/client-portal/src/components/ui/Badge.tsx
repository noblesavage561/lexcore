import clsx from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'high' | 'medium' | 'low' | 'info' | 'success' | 'warning'
  className?: string
}

const variants = {
  default: 'bg-gray-100 text-gray-700',
  high:    'bg-red-100 text-red-800',
  medium:  'bg-amber-100 text-amber-800',
  low:     'bg-green-100 text-green-800',
  info:    'bg-blue-100 text-blue-800',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-orange-100 text-orange-800',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', variants[variant], className)}>
      {children}
    </span>
  )
}
