import BaseController from "@/utils/base-controller.util";
import express, { Application } from "express";
import { connectMongoDB } from "./db/mongo.db";
import { errorResponseMiddleware } from "../middleware/error.middleware";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import Redis from "ioredis";
import colors, { inverse } from "colors";
import { redis } from "../utils/cache.util";
// import { connectRedisServer } from "@/utils/cache.util";

export default class App {
  public express: Application;
  public port: number;

  constructor(controllers: BaseController[], port: number) {
    this.express = express();
    this.port = port;

    this.initDbConnection();
    this.initRedisConnection();
    this.initMiddleware();
    this.initControllers(controllers);
    this.initErrorHandler();
  }

  private initMiddleware(): void {
    this.express.use(cors());
    this.express.use(helmet());
    this.express.use(morgan("dev"));
    this.express.use(compression());
    this.express.use(cookieParser());
    this.express.use(express.json());
    this.express.use(fileUpload());
  }
  private initDbConnection(): void {
    connectMongoDB();
  }

  private async initRedisConnection() {
    redis.on("connect", () => {
      console.log("Redis connected successfully!");
    });

    redis.on("error", (error) => {
      console.error("Redis connection failed:", error);
    });
  }

  private initErrorHandler(): void {
    this.express.use(errorResponseMiddleware);
  }

  private initControllers(controllers: BaseController[]): void {
    controllers.map((controller) => {
      this.express.use(`/api/${process.env.API_VERSION_1}`, controller.router);
    });
  }

  public listen() {
    this.express.listen(this.port, () => {
      console.log(`Server connected to ${process.env.HOST}:${this.port}`);
    });
  }
}
