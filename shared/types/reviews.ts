export interface Review {
  id: string
  videoUrl: string
  name: string
  subtitle: string
}

export interface ReviewsContent {
  items: Review[]
}

export function createEmptyReviewsContent(): ReviewsContent {
  return { items: [] }
}
