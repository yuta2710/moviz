"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrlFromS3 = exports.uploadFile = void 0;
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.S3_REGION;
const Bucket = process.env.S3_BUCKET;
const s3 = new s3_1.default({ region, accessKeyId, secretAccessKey });
const client = new client_s3_1.S3Client({ region });
const uploadFile = async (file) => {
    const data = await s3
        .putObject({
        Bucket,
        Key: `${file.name}`,
        Body: file.data,
        ACL: "public-read",
        ContentType: "image/jpg, image/png, image/jpeg",
    })
        .promise();
    return data;
};
exports.uploadFile = uploadFile;
const getUrlFromS3 = async (key) => {
    const command = new client_s3_1.GetObjectCommand({
        Bucket,
        Key: key,
    });
    try {
        return await (0, s3_request_presigner_1.getSignedUrl)(client, command);
    }
    catch (err) {
        console.error(err);
    }
};
exports.getUrlFromS3 = getUrlFromS3;
//# sourceMappingURL=s3.service.js.map