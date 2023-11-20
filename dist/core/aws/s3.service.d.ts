import { UploadedFile } from "express-fileupload";
import S3 from "aws-sdk/clients/s3";
export declare const uploadFileToS3: (file: UploadedFile) => Promise<import("aws-sdk/lib/request").PromiseResult<S3.PutObjectOutput, import("aws-sdk/lib/error").AWSError>>;
export declare const getUrlFromS3: (key: string) => Promise<string>;
