import BaseController from "@/utils/base-controller.util";
export default class RefreshTokenController implements BaseController {
    path: string;
    router: import("express-serve-static-core").Router;
    private refreshTokenService;
    constructor();
    private initRoutes;
    private handleRefreshToken;
}
