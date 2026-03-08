import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoginPage } from '../pages/LoginPage'

const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })

describe('Client Portal LoginPage', () => {
  it('renders the LexCore client portal login', () => {
    const { getByText } = render(
      <QueryClientProvider client={qc}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </QueryClientProvider>
    )
    expect(getByText('LexCore')).toBeTruthy()
  })
})
