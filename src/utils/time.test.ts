import { formatPlayerTime, formatRunTime } from '@/utils/time'

describe('formatRunTime', () => {
  it('shows hours and minutes', () => {
    expect(formatRunTime(99)).toBe('1h 39m')
  })

  it('shows only minutes for films shorter than an hour', () => {
    expect(formatRunTime(45)).toBe('45m')
  })
})

describe('formatPlayerTime', () => {
  it('pads minutes and seconds when there are hours', () => {
    expect(formatPlayerTime(5429.7)).toBe('1:30:29')
  })

  it('treats NaN and negative values as zero', () => {
    expect(formatPlayerTime(NaN)).toBe('0:00')
    expect(formatPlayerTime(-5)).toBe('0:00')
  })
})
