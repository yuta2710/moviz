import User from "@/modules/user/user.interface";

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}
