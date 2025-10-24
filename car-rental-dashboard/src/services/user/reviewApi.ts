export interface ReviewDTO {
    reviewId: number
    customerName: string
    carName: string
    rating: number
    comment: string
}

export async function getAllReviews(): Promise<ReviewDTO[]> {
    const res = await fetch("http://localhost:8080/api/reviews")
    if (!res.ok) throw new Error("Failed to fetch reviews")
    return res.json()
}

