import BaseController from "@/utils/base-controller.util";
export default class AuthController implements BaseController {
    path: string;
    router: import("express-serve-static-core").Router;
    private authService;
    constructor();
    private initRoutes;
    private register;
    private login;
    private getMe;
    private assignTokenForCookies;
    private forgotPassword;
    private resetPassword;
    private logOut;
}
