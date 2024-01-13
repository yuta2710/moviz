"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.advancedResponse = void 0;
const advancedResponse = (populate) => async (req, res, next) => {
    let query;
    const reqQuery = { ...req.query };
    console.log("Req query from middleware = ", req.query);
    next();
};
exports.advancedResponse = advancedResponse;
//# sourceMappingURL=advanced-response.middleware.js.map