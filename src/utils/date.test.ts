import { formatDateAttr, formatReviewDate } from '@/utils/date'

describe('formatReviewDate', () => {
  it('get review date format Month D, YYYY', () => {
    expect(formatReviewDate('2026-10-26T23:30:00Z')).toBe('October 26, 2026')
  })
})

describe('formatDateAttr', () => {
  it('get date attribute format Y-m-d', () => {
    expect(formatDateAttr('2026-10-26T23:30:00Z')).toBe('2026-10-26')
  })
})
