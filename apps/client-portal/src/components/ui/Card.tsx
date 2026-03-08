import clsx from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: boolean
  onClick?: () => void
}

export function Card({ children, className, padding = true, onClick }: CardProps) {
  return (
    <div
      className={clsx('bg-white rounded-xl border border-gray-200 shadow-sm', padding && 'p-6', onClick && 'cursor-pointer hover:shadow-md transition-shadow', className)}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
