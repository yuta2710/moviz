import BaseController from "@/utils/base-controller.util";
import { Application } from "express";
export default class App {
    express: Application;
    port: number;
    constructor(controllers: BaseController[], port: number);
    private initMiddleware;
    private initDbConnection;
    private initErrorHandler;
    private initControllers;
    listen(): void;
}
