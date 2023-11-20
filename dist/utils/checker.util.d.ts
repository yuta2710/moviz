import { UploadedFile } from "express-fileupload";
import { NextFunction } from "express";
export declare const isValidAvatar: (file: UploadedFile, next: NextFunction) => void;
