import api from "./user/api"  // axios instance

export type CarTypeDTO = {
    carTypeId: number
    typeName: string
}

export type CarTypePage = {
    content: CarTypeDTO[]
    totalElements: number
    totalPages: number
    page: number
    pageSize: number
}

export type CarTypeUpsert = {
    typeName: string
}

export const carTypeApi = {
    getPage: async (
        page = 1,
        pageSize = 10,
        keyword = ""
    ): Promise<CarTypePage> => {
        const res = await api.get<CarTypePage>(`/cartypes/page`, {
            params: { page, pageSize, keyword },
        })
        return res.data
    },

    getAll: async (): Promise<CarTypeDTO[]> => {
        const res = await api.get<CarTypeDTO[]>(`/cartypes`)
        return res.data
    },

    getById: async (carTypeId: number): Promise<CarTypeDTO> => {
        const res = await api.get<CarTypeDTO>(`/cartypes/${carTypeId}`)
        return res.data
    },

    create: async (data: CarTypeUpsert): Promise<CarTypeDTO> => {
        const res = await api.post<CarTypeDTO>(`/cartypes`, data)
        return res.data
    },

    update: async (carTypeId: number, data: CarTypeUpsert): Promise<CarTypeDTO> => {
        const res = await api.put<CarTypeDTO>(`/cartypes/${carTypeId}`, data)
        return res.data
    },

    delete: async (carTypeId: number): Promise<{ message: string }> => {
        const res = await api.delete<{ message: string }>(`/cartypes/${carTypeId}`)
        return res.data
    },
}
