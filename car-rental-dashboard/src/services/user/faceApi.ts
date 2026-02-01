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

// ===== ẢNH (cũ) =====
export async function verifyFace(challengeId: string, file: File) {
    const form = new FormData()
    form.append("challengeId", challengeId)
    form.append("image", file)
    const res = await api.post("/face/verify", form)
    return res.data as FaceVerifyResponse
}

export async function enrollFace(file: File) {
    const form = new FormData()
    form.append("image", file)
    await api.post("/face/enroll", form)
}

// ===== VIDEO (mới) =====
export async function verifyFaceVideo(challengeId: string, videoFile: File) {
    const form = new FormData()
    form.append("challengeId", challengeId)
    form.append("video", videoFile)

    // ✅ endpoint mong muốn: POST /api/face/verify-video
    const res = await api.post("/face/verify-video", form)

    return res.data as FaceVerifyResponse
}

export async function enrollFaceVideo(videoFile: File) {
    const form = new FormData()
    form.append("video", videoFile)

    // ✅ bạn cần tạo thêm endpoint enroll-video ở BE nếu muốn enroll bằng video
    await api.post("/face/enroll-video", form)
}

export async function checkFaceEnrolled() {
    const res = await api.get("/face/enrolled")
    return res.data as { registered: boolean; userId: number }
}
