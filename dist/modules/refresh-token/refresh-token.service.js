"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_service_1 = require("../../core/jwt/jwt.service");
class RefreshTokenService {
    handleRefreshToken = async (req, res, next) => {
        const cookies = req.cookies;
        const refreshToken = cookies.refreshToken;
        const decodedUser = (0, jwt_service_1.extractUser)(refreshToken, process.env.JWT_REFRESH_SECRET);
        const isHacked = await (0, jwt_service_1.refreshTokenReuseDetection)(decodedUser, refreshToken, res, next);
        console.log("Is hacked ? ", isHacked);
        if (isHacked) {
            console.log("This user is hacked");
            return;
        }
        const newDuoTokens = await (0, jwt_service_1.createTokens)(decodedUser);
        if ("accessToken" in newDuoTokens && "refreshToken" in newDuoTokens) {
            if (typeof decodedUser === "object" && decodedUser !== null) {
                const updatedRefreshToken = await (0, jwt_service_1.updateNewRefreshToken)(decodedUser.id, refreshToken, newDuoTokens.refreshToken);
                if (updatedRefreshToken) {
                    console.log("updatedRefreshToken ====> replaceRefreshTokenUser ===>  ", updatedRefreshToken);
                    res.cookie("refreshToken", newDuoTokens.refreshToken, {
                        maxAge: Number(process.env.JWT_COOKIE_EXPIRE) * 1000,
                        secure: true,
                        httpOnly: true,
                        sameSite: "strict",
                    });
                    res.status(200).json({
                        accessToken: newDuoTokens.accessToken,
                    });
                }
            }
        }
    };
}
exports.default = RefreshTokenService;
//# sourceMappingURL=refresh-token.service.js.map