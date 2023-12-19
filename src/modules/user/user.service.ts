import { NextFunction, Request, Response } from "express";
import { createTokens } from "../../core/jwt/jwt.service";
import userModel from "./user.model";
import { UserRegisterRequest } from "./user.request";
import ErrorResponse from "../../utils/error-response.util";
import { ErrorType } from "../../utils/error-types-setting.util";
import { getUrlFromS3, uploadFileToS3 } from "../../core/aws/s3.service";
import { UploadedFile } from "express-fileupload";
import { isValidAvatar } from "../../utils/checker.util";
// import { ReviewCustomization } from "../reviews/review.interface";
import letterboxd from "letterboxd-api";

interface UserUpdateReviewProps {
  // newReviews: ReviewCustomization[];
}

export default class UserService {
  private model = userModel;

  createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<{ accessToken: string; refreshToken: string } | Error> => {
    try {
      const { firstName, lastName, username, email, password, role, gender } =
        req.body as UserRegisterRequest;
      const user = await this.model.create({
        username,
        firstName,
        lastName,
        email,
        password,
        role,
        gender,
      });

      return createTokens(user);
    } catch (error) {
      next(
        new ErrorResponse(
          404,
          ErrorType["INTERNAL_SERVER_ERROR"],
          "Unable to create this user"
        )
      );
    }
  };
  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.model.find({});

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          type: ErrorType["NOT_FOUND"],
          message: "No user in this database",
        });
      }

      return res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      return next(
        new ErrorResponse(
          500,
          ErrorType["INTERNAL_SERVER_ERROR"],
          "Unable to get all users"
        )
      );
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.model.findById(req.params.id).exec();

      return user === null
        ? res.status(404).json({
            success: false,
            type: ErrorType["NOT_FOUND"],
            message: "No user in this database",
          })
        : res.status(200).json({
            success: true,
            data: user,
          });
    } catch (error) {
      throw new Error(`Unable to get this user <${req.params.id}>`);
    }
  };
  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedUser = await this.model.findByIdAndUpdate(
        req.params.id,
        req.body as Partial<UserRegisterRequest>,
        { new: true }
      );
      return updatedUser === null
        ? res.status(404).json({
            success: false,
            type: ErrorType["NOT_FOUND"],
            message: "No user in this database",
          })
        : res.status(200).json({
            success: true,
            data: updatedUser,
          });
    } catch (error) {
      return next(
        new ErrorResponse(
          400,
          ErrorType["BAD_REQUEST"],
          `Unable to update this user <${req.params.id}>`
        )
      );
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.model.findByIdAndDelete(req.params.id);

      return user !== null
        ? res.status(404).json({
            success: false,
            type: ErrorType["NOT_FOUND"],
            message: "No user in this database",
          })
        : res.status(200).json({
            success: true,
            data: {},
          });
    } catch (error) {
      throw new Error(`Unable to delete this user <${req.params.id}>`);
    }
  };

  setAvatar = async (req: Request, res: Response, next: NextFunction) => {
    const user = await this.model.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorResponse(404, ErrorType["NOT_FOUND"], "User not found")
      );
    }
    if (!req.files) {
      console.log("Deo co file nao het");
      return next(
        new ErrorResponse(400, ErrorType["BAD_REQUEST"], "Please upload a file")
      );
    }

    const file = req.files.file as UploadedFile;

    isValidAvatar(file, next);
    await uploadFileToS3(file);

    const url = await getUrlFromS3(file.name as string);
    const result = await user.updateOne({ photo: url }, { new: true });

    return res.status(200).json({
      success: true,
      message: `Successfully uploaded the photo to S3 bucket and update the avatar of user ${req.params.id}`,
      data: result,
    });
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {};

  // refreshCurrentUserReviewsFromLetterboxdServer = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const data = (await letterboxd(
  //       req.user.username
  //     )) as ReviewCustomization[];

  //     console.log("Data of user", data);

  //     console.log(req.params.id);

  //     // const updatedUser = await userModel.findById(req.params.id);

  //     // console.log(updatedUser);

  //     // updatedUser.reviews = data;

  //     // await updatedUser.save();

  //     res.status(200).json({
  //       success: true,
  //       data,
  //     });
  //   } catch (error) {
  //     return next(
  //       new ErrorResponse(
  //         400,
  //         ErrorType["BAD_REQUEST"],
  //         `Unable to update this user <${req.params.id}>`
  //       )
  //     );
  //   }
  // };
}
