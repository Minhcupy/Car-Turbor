import api from "@/src/services/user/api"

export type ContractDTO = {
    id: number
    status: "DRAFT" | "SIGNED_ELECTRONIC" | "SIGNED_DIGITAL" | "VOID"
    pdfUnsignedPath?: string | null
    pdfElectronicSignedPath?: string | null
    pdfDigitalSignedPath?: string | null
}

export async function getContractByBooking(bookingId: number) {
    const res = await api.get(`/user/contracts/by-booking/${bookingId}`)
    return res.data as ContractDTO
}

export async function signElectronic(contractId: number, payload: {
    signaturePngBase64: string
    signerName: string
    consent: boolean
}) {
    const res = await api.post(`/user/contracts/${contractId}/sign-electronic`, payload)
    return res.data as ContractDTO
}

export async function signDigital(contractId: number) {
    const res = await api.post(`/user/contracts/${contractId}/sign-digital`)
    return res.data as ContractDTO
}

// Download/view PDF qua endpoint download
export function contractPdfUrl(contractId: number, type: "unsigned"|"electronic"|"digital") {
    return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/user/contracts/${contractId}/download?type=${type}`
}

export async function downloadContractPdf(contractId: number, type: "unsigned"|"electronic"|"digital") {
    const res = await api.get(`/user/contracts/${contractId}/download`, {
        params: { type },
        responseType: "blob",
    })
    return res.data as Blob
}

