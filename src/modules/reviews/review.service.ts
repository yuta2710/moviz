import { NextFunction, Request, Response } from "express";
import userModel from "../user/user.model";
import { ReviewCustomization } from "./review.interface";
import { ErrorType } from "@/utils/error-types-setting.util";
import ErrorResponse from "@/utils/error-response.util";

interface UserUpdateReviewProps {
  newReviews: ReviewCustomization[];
}
export default class ReviewService {
  refreshCurrentUserReviewsFromLetterboxdServer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const updatedUser = await userModel.findByIdAndUpdate(
        req.params.id,
        req.body as Partial<UserUpdateReviewProps>,
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
}
