import { ErrorType } from "./error-types-setting.util";

export default class ErrorResponse extends Error {
  public status: number;
  public type: ErrorType;
  public message: string;

  constructor(status: number, type: ErrorType, message: string) {
    super(message);
    this.type = type;
    this.message = message;
    this.status = status;
  }
}
