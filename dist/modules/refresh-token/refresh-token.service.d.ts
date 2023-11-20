import { NextFunction, Request, Response } from "express";
export default class RefreshTokenService {
    handleRefreshToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
