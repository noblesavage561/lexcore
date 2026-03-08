import clsx from 'clsx'

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={clsx('animate-spin h-5 w-5 border-2 border-brand-600 border-t-transparent rounded-full', className)} />
  )
}
