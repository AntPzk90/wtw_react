import { render, screen } from '@testing-library/react'

import { MovieDetails } from '@/components/movie/MovieDetails/MovieDetails'

const baseProps = {
  director: 'mock Director',
  starring: ['A', 'B'],
  runTime: 99,
  genre: 'Drama',
  released: 2018,
}

describe('MovieDetails', () => {
  it('shows the director', () => {
    render(<MovieDetails {...baseProps} director="Wes Anderson" />)
    expect(screen.getByText('Wes Anderson')).toBeInTheDocument()
  })

  it('shows all actors, even more than four', () => {
    const starring = ['A', 'B', 'C', 'D', 'E', 'F']
    render(<MovieDetails {...baseProps} starring={starring} />)
    starring.forEach((actor) => {
      expect(screen.getByText(actor)).toBeInTheDocument()
    })
  })

  it('formats the run time', () => {
    render(<MovieDetails {...baseProps} runTime={90} />)
    expect(screen.getByText('1h 30m')).toBeInTheDocument()
  })

  it('shows the genre', () => {
    render(<MovieDetails {...baseProps} genre="Comedy" />)
    expect(screen.getByText('Comedy')).toBeInTheDocument()
  })

  it('shows the released year', () => {
    render(<MovieDetails {...baseProps} released={2019} />)
    expect(screen.getByText('2019')).toBeInTheDocument()
  })
})
