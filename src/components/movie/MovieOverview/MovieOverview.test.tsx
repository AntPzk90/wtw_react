import { render, screen } from '@testing-library/react'

import { MovieOverview } from '@/components/movie/MovieOverview/MovieOverview'

const baseProps = {
  rating: 8.0,
  scoresCount: 210,
  description: 'Some mock description',
  director: 'mock Director',
  starring: ['A', 'B'],
}

describe('MovieOverview', () => {
  it('formats a fractional rating with a comma', () => {
    render(<MovieOverview {...baseProps} rating={8.1} />)
    expect(screen.getByText('8,1')).toBeInTheDocument()
  })

  it('adds ",0" to a whole rating', () => {
    render(<MovieOverview {...baseProps} rating={5} />)
    expect(screen.getByText('5,0')).toBeInTheDocument()
  })

  it('shows the rating level', () => {
    render(<MovieOverview {...baseProps} rating={8.1} />)
    expect(screen.getByText('Very good')).toBeInTheDocument()
  })

  it('shows the number of ratings', () => {
    render(<MovieOverview {...baseProps} />)
    expect(screen.getByText('210 ratings')).toBeInTheDocument()
  })

  it('shows the director', () => {
    render(<MovieOverview {...baseProps} />)
    expect(screen.getByText('Director: mock Director')).toBeInTheDocument()
  })

  it('lists exactly four actors without "and other"', () => {
    render(<MovieOverview {...baseProps} starring={['A', 'B', 'C', 'D']} />)
    expect(screen.getByText('Starring: A, B, C, D')).toBeInTheDocument()
  })

  it('shows the first four actors and "and other" when there are more', () => {
    render(<MovieOverview {...baseProps} starring={['A', 'B', 'C', 'D', 'E']} />)
    expect(screen.getByText('Starring: A, B, C, D and other')).toBeInTheDocument()
  })
})
