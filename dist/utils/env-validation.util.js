"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = void 0;
const envalid_1 = require("envalid");
const validateEnv = () => {
    (0, envalid_1.cleanEnv)(process.env, {
        MONGO_URI: (0, envalid_1.str)(),
        DB_NAME: (0, envalid_1.str)(),
        JWT_ACCESS_SECRET: (0, envalid_1.str)(),
        JWT_REFRESH_SECRET: (0, envalid_1.str)(),
        JWT_COOKIE_SECRET: (0, envalid_1.str)(),
        JWT_COOKIE_EXPIRE: (0, envalid_1.num)(),
        HOST: (0, envalid_1.str)(),
        PORT: (0, envalid_1.port)({ default: 8080 }),
        API_VERSION_1: (0, envalid_1.str)(),
        NODE_ENV: (0, envalid_1.str)(),
        GEOCODER_PROVIDER: (0, envalid_1.str)(),
        GEOCODER_API_KEY: (0, envalid_1.str)(),
        FILE_UPLOAD_PATH: (0, envalid_1.str)(),
        MAX_FILE_UPLOAD: (0, envalid_1.num)(),
        SMTP_HOST: (0, envalid_1.str)(),
        SMTP_PORT: (0, envalid_1.port)({ default: 2525 }),
        SMTP_EMAIL: (0, envalid_1.str)(),
        SMTP_PASSWORD: (0, envalid_1.str)(),
        FROM_EMAIL: (0, envalid_1.str)(),
        FROM_NAME: (0, envalid_1.str)(),
    });
};
exports.validateEnv = validateEnv;
//# sourceMappingURL=env-validation.util.js.map