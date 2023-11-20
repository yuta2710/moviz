import { NextFunction, Request, Response } from "express";
export default class UserService {
    private model;
    createUser: (req: Request, res: Response, next: NextFunction) => Promise<{
        accessToken: string;
        refreshToken: string;
    } | Error>;
    getUsers: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    getUserById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
    updateUser: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    deleteUser: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
    setAvatar: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
}
