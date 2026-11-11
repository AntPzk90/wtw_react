export const getRatingLevel = (rating: number) => {
  if (rating === 10) return 'Awesome'
  if (rating >= 8) return 'Very good'
  if (rating >= 5) return 'Good'
  if (rating >= 3) return 'Normal'
  return 'Bad'
}
