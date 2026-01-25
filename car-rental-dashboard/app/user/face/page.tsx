"use client";

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { createFaceChallenge, verifyFace } from "@/src/services/user/faceApi";
import api from "@/src/services/user/api";

function dataUrlToFile(dataUrl: string, filename: string) {
    const [meta, base64] = dataUrl.split(",");
    const mime = meta.match(/:(.*?);/)?.[1] || "image/jpeg";
    const bin = atob(base64);
    const u8 = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    return new File([u8], filename, { type: mime });
}

const FACE_TOKEN_KEY = "faceVerifiedToken";
const FACE_HEADER = "X-Face-Verified"; // ✅ đổi đúng theo BE nếu khác

export default function FaceTestPage() {
    const webcamRef = useRef<Webcam>(null);

    const action = "CREATE_BOOKING";
    const resourceId = "";

    const [challengeId, setChallengeId] = useState<string | null>(null);
    const [steps, setSteps] = useState<string[]>([]);
    const [preview, setPreview] = useState<string | null>(null);
    const [faceToken, setFaceToken] = useState<string | null>(null);
    const [status, setStatus] = useState<string>("");

    // Load token khi refresh trang
    useEffect(() => {
        const saved = sessionStorage.getItem(FACE_TOKEN_KEY);
        if (saved) setFaceToken(saved);
    }, []);

    async function handleChallenge() {
        try {
            setStatus("Creating challenge...");

            // tạo challenge mới => xoá token cũ
            setFaceToken(null);
            sessionStorage.removeItem(FACE_TOKEN_KEY);

            const ch = await createFaceChallenge(action, resourceId);
            setChallengeId(ch.challengeId);
            setSteps(ch.steps);
            setStatus(`Challenge OK: ${ch.challengeId}`);
        } catch (e: any) {
            setStatus(e?.response?.data?.message || e.message || "Challenge error");
        }
    }

    async function handleCapture() {
        const imgSrc = webcamRef.current?.getScreenshot();
        if (!imgSrc) {
            setStatus("Cannot capture image");
            return;
        }
        setPreview(imgSrc);
        setStatus("Captured ✅");
    }

    async function handleVerify() {
        if (!challengeId) {
            setStatus("No challengeId. Create challenge first.");
            return;
        }
        if (!preview) {
            setStatus("No captured image.");
            return;
        }

        try {
            setStatus("Verifying...");

            const file = dataUrlToFile(preview, "face.jpg");
            const res = await verifyFace(challengeId, file);

            if (!res.verified || !res.faceVerifiedToken) {
                setStatus("Face NOT matched ❌");
                setFaceToken(null);
                sessionStorage.removeItem(FACE_TOKEN_KEY);
                return;
            }

            setFaceToken(res.faceVerifiedToken);
            sessionStorage.setItem(FACE_TOKEN_KEY, res.faceVerifiedToken);
            setStatus("Verified ✅ token created");
        } catch (e: any) {
            setStatus(e?.response?.data?.message || e.message || "Verify error");
        }
    }

    // ✅ gọi API “nhạy cảm” (create booking) với header face
    async function handleSensitiveApi() {
        const token = faceToken || sessionStorage.getItem(FACE_TOKEN_KEY);

        if (!token) {
            setStatus("Need faceVerifiedToken first.");
            return;
        }

        try {
            setStatus("Calling sensitive API (create booking)...");

            // ✅ gửi payload đúng BookingRequestDTO
            const dto = {
                carId: 2,
                pricingId: 1,
                rentalUnits: 1,
                pickupLocation: "HCM",
                returnLocation: "HCM",
                pickupDate: "2026-01-25",
                returnDate: "2026-01-26",
                pickupTime: "09:00",
                returnTime: "09:00",
                notes: "demo",
                fullName: "Test User",
                email: "test@gmail.com",
                phone: "0123456789",
                address: "HCM",
                idNumber: "012345678901",
                licenseNumber: "B123456789",
            };

            const res = await api.post("/user/bookings", dto, {
                headers: {
                    [FACE_HEADER]: token,
                },
            });

            setStatus("Sensitive API OK ✅ (booking created)");
            console.log(res.data);

            // nếu token mặt là one-time, bạn có thể xoá luôn:
            // sessionStorage.removeItem(FACE_TOKEN_KEY);
            // setFaceToken(null);
        } catch (e: any) {
            setStatus(e?.response?.data?.message || e.message || "Sensitive API error");
        }
    }

    return (
        <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
            <h1 style={{ fontSize: 24, fontWeight: 700 }}>Face Verify Test</h1>

            <div style={{ marginTop: 16, display: "flex", gap: 16, flexWrap: "wrap" }}>
                <button onClick={handleChallenge}>1) Create Challenge</button>
                <button onClick={handleCapture}>2) Capture</button>
                <button onClick={handleVerify}>3) Verify</button>
                <button onClick={handleSensitiveApi}>4) Call Sensitive API</button>
            </div>

            <p style={{ marginTop: 12 }}>
                <b>Status:</b> {status}
            </p>

            <div style={{ marginTop: 12 }}>
                <div>
                    <b>challengeId:</b> {challengeId || "-"}
                </div>
                <div>
                    <b>steps:</b> {steps.length ? steps.join(", ") : "-"}
                </div>
                <div>
                    <b>faceVerifiedToken:</b> {faceToken || "-"}
                </div>
            </div>

            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                    <h3>Webcam</h3>
                    <Webcam
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: "user" }}
                        style={{ width: "100%", borderRadius: 12 }}
                    />
                </div>

                <div>
                    <h3>Preview</h3>
                    {preview ? (
                        <img src={preview} alt="preview" style={{ width: "100%", borderRadius: 12 }} />
                    ) : (
                        <div style={{ width: "100%", height: 240, background: "#eee", borderRadius: 12 }} />
                    )}
                </div>
            </div>
        </div>
    );
}
