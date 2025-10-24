import api from "./user/api"

// DTO từ BE
export type BrandDTO = {
  brandId: number
  brandName: string
  description?: string | null
  logoUrl?: string | null
}

// Trang phân trang
export type BrandPage = {
  content: BrandDTO[]
  totalElements: number
  totalPages: number
  page: number
  pageSize: number
}

// Kiểu dữ liệu khi thêm/sửa
export type BrandUpsert = {
  brandName: string
  description?: string
  logo?: File | null
}

// Helper: convert thành FormData
function toFormData(data: BrandUpsert): FormData {
  const fd = new FormData()
  fd.append("brandName", data.brandName)
  if (data.description !== undefined) fd.append("description", data.description)
  if (data.logo) fd.append("logo", data.logo)
  return fd
}

export const brandApi = {
  getAll: async (): Promise<BrandDTO[]> => {
    const res = await api.get<BrandDTO[]>(`/brands`)
    return res.data
  },

  getById: async (brandId: number): Promise<BrandDTO> => {
    const res = await api.get<BrandDTO>(`/brands/${brandId}`)
    return res.data
  },

  getPage: async (page = 1, pageSize = 10, keyword = ""): Promise<BrandPage> => {
    const res = await api.get<BrandPage>(`/brands/page`, { params: { page, pageSize, keyword } })
    return res.data
  },

  create: async (data: BrandUpsert): Promise<BrandDTO> => {
    const res = await api.post<BrandDTO>(`/brands`, toFormData(data), {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data
  },

  update: async (brandId: number, data: BrandUpsert): Promise<BrandDTO> => {
    const res = await api.put<BrandDTO>(`/brands/${brandId}`, toFormData(data), {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data
  },

  delete: async (brandId: number): Promise<{ message: string }> => {
    const res = await api.delete<{ message: string }>(`/brands/${brandId}`)
    return res.data
  },
}
