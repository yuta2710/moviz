"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorResponse extends Error {
    status;
    type;
    message;
    constructor(status, type, message) {
        super(message);
        this.type = type;
        this.message = message;
        this.status = status;
    }
}
exports.default = ErrorResponse;
//# sourceMappingURL=error-response.util.js.map