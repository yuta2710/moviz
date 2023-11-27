"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importData = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("./modules/user/user.model"));
require("dotenv/config");
// console.log(process.env.MONGO_URI);
// connectMongoDB();
const { MONGO_URI } = process.env;
try {
    // console.log(MONGO_URI);
    mongoose_1.default.connect(MONGO_URI);
    console.log("Database connected successfully");
}
catch (error) {
    throw new Error(`Failed to connected MongoDB`);
}
console.log("dededded");
const mockUsers = [
    {
        username: "admin_test",
        firstName: "Admin",
        lastName: "Test",
        email: "admin.test@example.com",
        password: "123456",
        gender: "m",
        role: "admin",
    },
    {
        username: "jane_smith",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        password: "123456",
        gender: "f",
        role: "user",
    },
    {
        username: "sam_jackson",
        firstName: "Sam",
        lastName: "Jackson",
        email: "sam.jackson@example.com",
        password: "123456",
        gender: "o",
        role: "user",
    },
    {
        username: "alice_wonderland",
        firstName: "Alice",
        lastName: "Wonderland",
        email: "alice.wonderland@example.com",
        password: "123456",
        gender: "f",
        role: "manager",
    },
];
console.log(process.argv[1], process.argv[2]);
const importData = async () => {
    try {
        await user_model_1.default.insertMany(mockUsers);
        process.exit(1);
    }
    catch (error) {
        console.log(error);
    }
};
exports.importData = importData;
(0, exports.importData)();
//# sourceMappingURL=seeder.js.map