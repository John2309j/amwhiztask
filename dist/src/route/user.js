"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controller/user");
const UserRouter = express_1.default.Router();
UserRouter.post('/register', user_1.CreateUser);
UserRouter.post('/login', user_1.LoginUser);
UserRouter.post('/logout', user_1.Logout);
exports.default = UserRouter;
