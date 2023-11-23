import { UploadedFile } from "express-fileupload";
import { PhotoType } from "./photo-type-setting.util";
import ErrorResponse from "./error-response.util";
import { NextFunction, Request, Response } from "express";
import { ErrorType } from "./error-types-setting.util";
import { Model } from "mongoose";

export const isValidAvatar = (file: UploadedFile, next: NextFunction): void => {
  if (
    file.mimetype !== PhotoType["PNG"] &&
    file.mimetype !== PhotoType["JPEG"] &&
    file.mimetype !== PhotoType["JPG"] &&
    file.mimetype !== PhotoType["WEBP"]
  ) {
    return next(
      new ErrorResponse(400, ErrorType["BAD_REQUEST"], "Please upload an image")
    );
  }

  if (Number(file.size) > Number(process.env.MAX_FILE_UPLOAD)) {
    return next(
      new ErrorResponse(
        400,
        ErrorType["BAD_REQUEST"],
        `Please upload an image's size less than ${process.env.MAX_FILE_UPLOAD}`
      )
    );
  }
};
