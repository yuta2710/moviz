import BaseController from "@/utils/base-controller.util";
import { Router } from "express";
export default class UserController implements BaseController {
    path: string;
    router: Router;
    private service;
    constructor();
    private initRoutes;
    private createUser;
    private getUsers;
    private getUserById;
    private updateUser;
    private deleteUser;
    private setAvatar;
}
