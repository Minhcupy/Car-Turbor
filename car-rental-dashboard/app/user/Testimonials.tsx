"use client"

import { useEffect, useState } from "react"
import { getAllReviews, ReviewDTO } from "@/src/services/user/reviewApi"

export default function Testimonials() {
    const [reviews, setReviews] = useState<ReviewDTO[]>([])
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        async function fetchReviews() {
            try {
                const data = await getAllReviews()
                setReviews(data)
            } catch (err) {
                console.error("Lỗi khi lấy review:", err)
            }
        }
        fetchReviews()
    }, [])

    // Tự động chuyển slide
    useEffect(() => {
        if (reviews.length === 0) return
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % reviews.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [reviews])

    if (reviews.length === 0) {
        return (
            <section className="py-20 bg-gradient-to-r from-sky-50 to-blue-100">
                <div className="text-center text-gray-500 text-lg font-medium">
                    ⛔ Chưa có đánh giá nào.
                </div>
            </section>
        )
    }

    // Mỗi slide hiển thị 3 review
    const itemsPerPage = 3
    const totalSlides = Math.ceil(reviews.length / itemsPerPage)

    return (
        <section className="py-20 bg-gradient-to-r from-sky-50 to-blue-100 relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <span className="text-sky-600 font-semibold uppercase tracking-wide">
                        Đánh giá khách hàng
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
                        Khách hàng nói gì về <span className="text-sky-500">CarBook</span>
                    </h2>
                </div>

                <div className="relative overflow-hidden">
                    {/* Wrapper */}
                    <div
                        className="flex transition-transform duration-700 ease-in-out"
                        style={{ transform: `translateX(-${current * 100}%)` }}
                    >
                        {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                            <div
                                key={slideIndex}
                                className="w-full flex-shrink-0 grid md:grid-cols-3 gap-6 px-6"
                            >
                                {reviews
                                    .slice(
                                        slideIndex * itemsPerPage,
                                        slideIndex * itemsPerPage + itemsPerPage
                                    )
                                    .map((review) => (
                                        <div
                                            key={review.reviewId}
                                            className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition"
                                        >
                                            <p className="text-gray-600 mb-4 text-base leading-relaxed line-clamp-4">
                                                “{review.comment}”
                                            </p>
                                            <h4 className="font-semibold text-gray-900 text-lg">
                                                {review.customerName}
                                            </h4>
                                            <p className="text-sky-500 text-sm mt-1">
                                                Đã thuê {review.carName}
                                            </p>
                                            <div className="mt-2 text-yellow-500 text-sm">
                                                {"⭐".repeat(review.rating)}{" "}
                                                <span className="text-gray-400">{review.rating}/5</span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>

                    {/* Nút điều hướng */}
                    <button
                        onClick={() =>
                            setCurrent((prev) => (prev - 1 + totalSlides) % totalSlides)
                        }
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-3 rounded-full hover:bg-sky-100 transition"
                    >
                        ◀
                    </button>
                    <button
                        onClick={() => setCurrent((prev) => (prev + 1) % totalSlides)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-3 rounded-full hover:bg-sky-100 transition"
                    >
                        ▶
                    </button>

                    {/* Dots */}
                    <div className="flex justify-center mt-6 space-x-2">
                        {Array.from({ length: totalSlides }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrent(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === current
                                    ? "bg-sky-500 scale-125"
                                    : "bg-gray-300 hover:bg-sky-300"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
