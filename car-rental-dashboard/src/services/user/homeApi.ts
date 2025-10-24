export interface FeaturedCar {
    id: number
    name: string
    brand: string
    imageUrl: string
    price: number
}

export async function getFeaturedCars(): Promise<FeaturedCar[]> {
    const res = await fetch("http://localhost:8080/api/user/cars/featured", {
        cache: "no-store",
    })

    if (!res.ok) {
        throw new Error("Failed to fetch featured cars")
    }

    const data: unknown = await res.json()

    // ép kiểu thủ công (nếu muốn kiểm tra dữ liệu từ BE)
    if (!Array.isArray(data)) {
        throw new Error("API response is not an array")
    }

    return data as FeaturedCar[]
}
