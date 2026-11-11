import { splitInHalf } from '@/utils/splitHalf'

describe('splitInHalf', () => {
  it('splits an even-length array into equal halves', () => {
    expect(splitInHalf([1, 2, 3, 4])).toEqual([
      [1, 2],
      [3, 4],
    ])
  })

  it('puts the extra element into the first half for odd length', () => {
    expect(splitInHalf([1, 2, 3])).toEqual([[1, 2], [3]])
  })

  it('puts a single element into the first half', () => {
    expect(splitInHalf([1])).toEqual([[1], []])
  })

  it('returns two empty halves for an empty array', () => {
    expect(splitInHalf([])).toEqual([[], []])
  })

  it('does not mutate the input', () => {
    const items = [1, 2, 3]
    splitInHalf(items)
    expect(items).toEqual([1, 2, 3])
  })
})
