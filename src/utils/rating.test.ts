import { getRatingLevel } from '@/utils/rating'

describe('getRatingLevel', () => {
  it.each([
    [10, 'Awesome'],
    [9.9, 'Very good'],
    [8, 'Very good'],
    [7.9, 'Good'],
    [5, 'Good'],
    [4.9, 'Normal'],
    [3, 'Normal'],
    [2.9, 'Bad'],
  ])('returns %s → %s', (rating, level) => {
    expect(getRatingLevel(rating)).toBe(level)
  })
})
