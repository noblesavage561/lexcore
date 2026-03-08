import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoginPage } from '../pages/LoginPage'

const qc = new QueryClient()

describe('Client Portal LoginPage', () => {
  it('renders the LexCore client portal login', () => {
    render(
      <QueryClientProvider client={qc}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </QueryClientProvider>
    )
    expect(screen.getByText('LexCore')).toBeTruthy()
  })
})
