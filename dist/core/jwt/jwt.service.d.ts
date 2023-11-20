/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import User from "@/modules/user/user.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import Token from "./jwt.interface";
import AuthResponse from "@/modules/auth/auth.response";
import { NextFunction, Response } from "express";
export declare const createTokens: (user: User | JwtPayload) => Promise<AuthResponse | Error>;
export declare const verifyToken: (accessToken: string) => Promise<Token | jwt.JsonWebTokenError>;
export declare const refreshTokenReuseDetection: (decodedUser: JwtPayload, refreshToken: string, res: Response, next: NextFunction) => Promise<Boolean>;
export declare const assignRefreshTokenToUser: (userId: string, refreshToken: string) => Promise<import("mongoose").Document<unknown, {}, User> & User & {
    _id: import("mongoose").Types.ObjectId;
}>;
export declare const getUserByRefreshToken: (userId: string, refreshToken: string) => Promise<import("mongoose").Document<unknown, {}, User> & User & {
    _id: import("mongoose").Types.ObjectId;
}>;
export declare const removeAllRefreshTokensFromUser: (userId: string) => Promise<import("mongoose").UpdateWriteOpResult>;
export declare const removeRefreshTokenFromUser: (userId: string, refreshToken: string) => Promise<import("mongoose").UpdateWriteOpResult>;
export declare const extractUser: (token: string, secret: string) => string | JwtPayload;
export declare const updateNewRefreshToken: (userId: string, oldRefreshToken: string, newRefreshToken: string) => Promise<import("mongoose").UpdateWriteOpResult>;
