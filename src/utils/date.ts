const reviewDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

export const formatReviewDate = (isoDate: string) => reviewDateFormatter.format(new Date(isoDate))

export const formatDateAttr = (isoDate: string) => new Date(isoDate).toISOString().slice(0, 10)
