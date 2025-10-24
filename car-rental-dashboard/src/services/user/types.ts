export type ApiResponse<T> = {
    code: number;
    message: string;
    result: T;
};

export type AuthTokens = {
    token: string;
    refreshToken: string;
    authenticated?: boolean;
};
