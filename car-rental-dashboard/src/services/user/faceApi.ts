import api from "./api"

export type FaceChallengeResponse = {
    challengeId: string
    expiresAt: string
    steps: string[]
}

export type FaceVerifyResponse = {
    verified: boolean
    faceVerifiedToken: string | null
}

export async function createFaceChallenge(action: string, resourceId?: string) {
    const res = await api.post<FaceChallengeResponse>("/face/challenge", {
        action,
        resourceId: resourceId || "",
    })
    return res.data
}

export async function verifyFace(challengeId: string, file: File) {
    const form = new FormData()
    form.append("challengeId", challengeId)
    form.append("image", file)

    const res = await api.post("/face/verify", form) // ✅ không set headers
    return res.data as { verified: boolean; faceVerifiedToken: string | null }
}

export async function checkFaceEnrolled() {
    const res = await api.get("/face/enrolled")
    return res.data as { registered: boolean; userId: number }
}

export async function enrollFace(file: File) {
    const form = new FormData()
    form.append("image", file)

    await api.post("/face/enroll", form) // ✅ không set headers
}