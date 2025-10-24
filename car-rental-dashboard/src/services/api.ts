// Mock API services for the car rental dashboard
import carsData from "../data/cars.json"
import brandsData from "../data/brands.json"
import customersData from "../data/customers.json"
import bookingsData from "../data/bookings.json"
import transactionsData from "../data/transactions.json"
import postsData from "../data/posts.json"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const carsApi = {
  getAll: async () => {
    await delay(500)
    return carsData
  },
  getById: async (id: number) => {
    await delay(300)
    return carsData.find((car) => car.id === id)
  },
  create: async (car: any) => {
    await delay(800)
    return { ...car, id: Date.now() }
  },
  update: async (id: number, car: any) => {
    await delay(600)
    return { ...car, id }
  },
  delete: async (id: number) => {
    await delay(400)
    return { success: true }
  },
}

export const brandsApi = {
  getAll: async () => {
    await delay(300)
    return brandsData
  },
  create: async (brand: any) => {
    await delay(500)
    return { ...brand, id: Date.now() }
  },
  update: async (id: number, brand: any) => {
    await delay(400)
    return { ...brand, id }
  },
  delete: async (id: number) => {
    await delay(300)
    return { success: true }
  },
}

export const customersApi = {
  getAll: async () => {
    await delay(400)
    return customersData
  },
  getById: async (id: number) => {
    await delay(300)
    return customersData.find((customer) => customer.id === id)
  },
}

export const bookingsApi = {
  getAll: async () => {
    await delay(500)
    return bookingsData
  },
  getById: async (id: string) => {
    await delay(300)
    return bookingsData.find((booking) => booking.id === id)
  },
  updateStatus: async (id: string, status: string) => {
    await delay(400)
    return { success: true, id, status }
  },
}

export const transactionsApi = {
  getAll: async () => {
    await delay(400)
    return transactionsData
  },
}

export const postsApi = {
  getAll: async () => {
    await delay(300)
    return postsData
  },
  create: async (post: any) => {
    await delay(600)
    return { ...post, id: Date.now() }
  },
  update: async (id: number, post: any) => {
    await delay(500)
    return { ...post, id }
  },
  delete: async (id: number) => {
    await delay(300)
    return { success: true }
  },
}

// Dashboard stats API
export const dashboardApi = {
  getStats: async () => {
    await delay(600)
    return {
      totalCars: 26,
      bookingsThisMonth: 45,
      revenueThisMonth: 12500,
      newCustomers: 8,
      pendingBookings: 3,
      cancelRate: 5.2,
    }
  },
  getChartData: async () => {
    await delay(700)
    return {
      monthlyRevenue: [
        { month: "Jan", revenue: 8500 },
        { month: "Feb", revenue: 9200 },
        { month: "Mar", revenue: 11000 },
        { month: "Apr", revenue: 10500 },
        { month: "May", revenue: 12000 },
        { month: "Jun", revenue: 13500 },
        { month: "Jul", revenue: 15000 },
        { month: "Aug", revenue: 14200 },
        { month: "Sep", revenue: 13800 },
        { month: "Oct", revenue: 12800 },
        { month: "Nov", revenue: 11500 },
        { month: "Dec", revenue: 12500 },
      ],
      dailyBookings: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        bookings: Math.floor(Math.random() * 10) + 1,
      })),
      brandRatio: [
        { brand: "Toyota", count: 8, percentage: 31 },
        { brand: "Honda", count: 6, percentage: 23 },

        { brand: "Ford", count: 5, percentage: 19 },
        { brand: "Tesla", count: 3, percentage: 12 },
      ],
    }
  },
}
