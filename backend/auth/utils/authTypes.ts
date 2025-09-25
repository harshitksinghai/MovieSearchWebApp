export interface RefreshToken {
    id: number;
    token: string;
    expirationTime: Date;
    userId: string;
}

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export interface UserAuthDetails {
    id: number;
    password: string;
    role: string;
    googleId: string;
    refreshToken: number;
}