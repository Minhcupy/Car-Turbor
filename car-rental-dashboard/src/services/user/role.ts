import { jwtDecode, JwtPayload as DefaultJwtPayload } from "jwt-decode";

interface JwtPayload extends DefaultJwtPayload {
    sub: string;
    roles?: string[];
}

export const getRole = (): string | null => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        // Nếu roles là mảng thì lấy phần tử đầu tiên
        return decoded.roles && decoded.roles.length > 0 ? decoded.roles[0] : null;
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
};
