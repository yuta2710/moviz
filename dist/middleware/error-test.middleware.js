"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    // Log to console for dev
    console.log("ERRRR = ", err.message);
    // console.log(err.properties);
    // Mongoose bad objectId
    if (err.name === "CastError") {
        const message = `Resource not found`;
        // error = new ErrorResponse(404, message);
    }
    // Mongoose duplicate key
    // if (err.code === 11000) {
    //   const message = "Duplicate field value entered";
    //   // error = new ErrorResponse(message, 400);
    // }
    // // Mongoose Validation Error
    if (err.name === "ValidationError") {
        console.log("hmmmmm");
    }
    // res.status(error.status || 500).json({
    //   success: false,
    //   error: error.message || "Server Error",
    // });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-test.middleware.js.map