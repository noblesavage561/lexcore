import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoginPage } from '../pages/LoginPage'

const qc = new QueryClient()

describe('LoginPage', () => {
  it('renders the LexCore login form', () => {
    render(
      <QueryClientProvider client={qc}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </QueryClientProvider>
    )
    expect(screen.getByText('LexCore')).toBeTruthy()
    expect(screen.getByText('Sign in to your account')).toBeTruthy()
  })
})
