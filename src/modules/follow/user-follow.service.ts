import { NextFunction, Request, Response } from "express";
import userModel from "../user/user.model";
import ErrorResponse from "../../utils/error-response.util";
import { ErrorType } from "../../utils/error-types-setting.util";

export default class FollowService {
  onFollow = async (req: Request, res: Response, next: NextFunction) => {
    const userIntendToFollow = await userModel.findById(req.params.id);

    if (userIntendToFollow !== null) {
      if (
        !userIntendToFollow.followers.includes(req.user._id) &&
        !req.user.followings.includes(userIntendToFollow._id)
      ) {
        userIntendToFollow.followers.push(req.user._id);
        req.user.followings.push(userIntendToFollow._id);

        await userIntendToFollow.save();
        await req.user.save();
      } else {
        return next(
          new ErrorResponse(
            400,
            ErrorType["BAD_REQUEST"],
            `Sorry, current user <${req.user.username}> followed new user <${userIntendToFollow.username}> before`
          )
        );
      }

      res.status(200).json({
        success: true,
        message: `Current user <${req.user.username}> followed new user <${userIntendToFollow.username}> successfully`,
      });
    } else {
      return next(
        new ErrorResponse(404, ErrorType["NOT_FOUND"], "User not found.")
      );
    }
  };
  unFollow = async (req: Request, res: Response, next: NextFunction) => {
    const userIntendToUnFollow = await userModel.findById(req.params.id);
    if (userIntendToUnFollow !== null) {
      if (
        userIntendToUnFollow.followers.includes(req.user._id) &&
        req.user.followings.includes(userIntendToUnFollow._id)
      ) {
        userIntendToUnFollow.followers.pop();
        req.user.followings.pop();

        await userIntendToUnFollow.save();
        await req.user.save();
      } else {
        return next(
          new ErrorResponse(
            400,
            ErrorType["BAD_REQUEST"],
            `Sorry, current user <${req.user.username}> unfollowed new user <${userIntendToUnFollow.username}> before`
          )
        );
      }

      res.status(200).json({
        success: true,
        message: `Current user <${req.user.username}> unfollowed new user <${userIntendToUnFollow.username}> successfully`,
      });
    } else {
      return next(
        new ErrorResponse(404, ErrorType["NOT_FOUND"], "User not found.")
      );
    }
  };

  checkFollowing = async (req: Request, res: Response, next: NextFunction) => {
    const userIntendToCheck = await userModel.findById(req.params.id);

    if (userIntendToCheck !== null) {
      if (
        userIntendToCheck.followers.includes(req.user._id) &&
        req.user.followings.includes(userIntendToCheck._id)
        ) {
        res.status(200).json({
          success: true,
          message: `Current user <${req.user.username}> is following new user <${userIntendToCheck.username}>`,
          isFollowed: true,
        });
      } else {
        res.status(200).json({
          success: true,
          message: `Current user <${req.user.username}> is not following new user <${userIntendToCheck.username}>`,
          isFollowed: false,
        });
      }
    } else {
      return next(
        new ErrorResponse(404, ErrorType["NOT_FOUND"], "User not found.")
      );
    }
  };
}
