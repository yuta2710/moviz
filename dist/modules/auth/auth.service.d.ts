import User from "../user/user.interface";
import { NextFunction, Request, Response } from "express";
export default class AuthService {
    private userService;
    register: (req: Request, res: Response, next: NextFunction) => Promise<{
        accessToken: string;
        refreshToken: string;
    } | Error>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<{
        accessToken: string;
        refreshToken: string;
    } | Error>;
    getMe: (req: Request, res: Response, next: NextFunction) => Promise<User>;
    forgotPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    resetPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    logOut: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
