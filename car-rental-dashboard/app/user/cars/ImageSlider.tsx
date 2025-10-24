"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

// URL BE, nếu không set ENV thì fallback về localhost
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

interface ImageSliderProps {
    images: string[]
    alt: string
}

export default function ImageSlider({ images, alt }: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length)
    const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)

    return (
        <div className="relative group overflow-hidden rounded-t-xl">
            {/* Hình ảnh */}
            <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((image, index) => (
                    <div key={index} className="w-full h-64 flex-shrink-0 relative">
                        <Image
                            src={`${API_BASE}${image}`} // gắn domain BE
                            alt={`${alt} ${index + 1}`}
                            fill
                            className="object-cover"
                            unoptimized // tránh lỗi domain BE không được allow
                        />
                    </div>
                ))}
            </div>

            {/* Nút điều hướng */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? "bg-white scale-125"
                                    : "bg-white/60 hover:bg-white/80"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
