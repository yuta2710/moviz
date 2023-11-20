"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongo_db_1 = require("./db/mongo.db");
const error_middleware_1 = require("../middleware/error.middleware");
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
class App {
    express;
    port;
    constructor(controllers, port) {
        this.express = (0, express_1.default)();
        this.port = port;
        this.initDbConnection();
        this.initMiddleware();
        this.initControllers(controllers);
        this.initErrorHandler();
    }
    initMiddleware() {
        this.express.use((0, cors_1.default)());
        this.express.use((0, helmet_1.default)());
        this.express.use((0, morgan_1.default)("dev"));
        this.express.use((0, compression_1.default)());
        this.express.use((0, cookie_parser_1.default)());
        this.express.use(express_1.default.json());
        this.express.use((0, express_fileupload_1.default)());
    }
    initDbConnection() {
        (0, mongo_db_1.connectMongoDB)();
    }
    initErrorHandler() {
        this.express.use(error_middleware_1.errorResponseMiddleware);
    }
    initControllers(controllers) {
        controllers.map((controller) => {
            this.express.use(`/api/${process.env.API_VERSION_1}`, controller.router);
        });
    }
    listen() {
        this.express.listen(this.port, () => {
            console.log(`Server connected to ${process.env.HOST}:${this.port}`);
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.core.js.map