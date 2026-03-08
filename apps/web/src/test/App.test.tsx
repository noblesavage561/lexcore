import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoginPage } from '../pages/LoginPage'

const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })

describe('LoginPage', () => {
  it('renders the LexCore login form', () => {
    const { getByText } = render(
      <QueryClientProvider client={qc}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </QueryClientProvider>
    )
    expect(getByText('LexCore')).toBeTruthy()
    expect(getByText('Sign in to your account')).toBeTruthy()
  })
})
