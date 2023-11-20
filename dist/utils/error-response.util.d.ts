import { ErrorType } from "./error-types-setting.util";
export default class ErrorResponse extends Error {
    status: number;
    type: ErrorType;
    message: string;
    constructor(status: number, type: ErrorType, message: string);
}
