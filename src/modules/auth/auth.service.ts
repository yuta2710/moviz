import UserService from "../user/user.service";
import AuthRequest from "./auth.request";
import userModel from "../user/user.model";
import User from "../user/user.interface";
import { createTokens } from "../../core/jwt/jwt.service";
import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../../utils/error-response.util";
import { sendEmail } from "../../utils/send-email.util";
import { ErrorType } from "../../utils/error-types-setting.util";

export default class AuthService {
  private userService: UserService = new UserService();

  public register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<{ accessToken: string; refreshToken: string } | Error> => {
    console.log(req.body);
    const duoTokens = await this.userService.createUser(req, res, next);
    return duoTokens;
  };

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<{ accessToken: string; refreshToken: string } | Error> => {
    const { email, password } = req.body as AuthRequest;
    const user: User = await userModel.findOne({ email }).select("+password");

    if (!user) {
      next(
        new ErrorResponse(404, ErrorType["NOT_FOUND"], "User does not exist")
      );
      return;
    }

    const isMatchPassword = await user.isValidPassword(password);

    if (!isMatchPassword) {
      next(
        new ErrorResponse(401, ErrorType["UNAUTHORIZED"], "Invalid password")
      );
      return;
    }
    const duoTokens = await createTokens(user);

    if ("refreshToken" in duoTokens) {
      user.refreshTokens.push(duoTokens.refreshToken as string);
      await user.save();
    }

    return duoTokens;
  };

  public getMe = async (req: Request, res: Response, next: NextFunction) => {
    const user: User = await userModel
      .findById(req.user._id)
      .select("-password");

    return user;
  };

  public forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
      return next(
        new ErrorResponse(401, ErrorType["NOT_FOUND"], "User not found")
      );
    }

    const resetPasswordToken = user.getResetPasswordToken();
    console.log("User old rpt = ", resetPasswordToken);
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get("host")}`;
    const message = `You are receiving this email because you (or someone else)
    has requested the reset of password.
    Please make a PUT request to: \n\n ${resetUrl}/api/v1/auth/reset-password-token/${user.resetPasswordToken}`;
    try {
      await sendEmail({
        email: user.email,
        subject: "Day la reset  token password cua may ne",
        message,
      });
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return next(
        new ErrorResponse(
          403,
          ErrorType["BAD_REQUEST"],
          "Email could not be sent"
        )
      );
    }
  };

  public resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const updatedUser = await userModel.findOne({
      resetPasswordToken: req.params.resetPasswordToken,
      resetPasswordExpired: { $gt: Date.now() },
    });

    if (!updatedUser) {
      return next(
        new ErrorResponse(400, ErrorType["UNAUTHORIZED"], "Invalid token")
      );
    }

    // Set the new password from this.modified() in model is not trigger
    updatedUser.password = req.body.password;
    updatedUser.resetPasswordToken = undefined;
    updatedUser.resetPasswordExpired = undefined;

    await updatedUser.save();

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  };

  public logOut = async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("refreshToken", "none", {
      httpOnly: true,
      expires: new Date(Date.now() + 10 * 1000),
    });

    // res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: `Log out the account successfully`,
      data: {},
    });
  };
}
