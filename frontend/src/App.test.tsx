import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from './routes/Home.tsx'

describe('Home', () => {
  test('renders', () => {
    render(<Home />)
    expect(screen.getByText('Learn React')).toBeDefined()
  })
})
