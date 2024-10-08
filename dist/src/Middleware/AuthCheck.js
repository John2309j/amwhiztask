"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthCheck = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../model/user");
const AuthCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Token = req.headers.authorization;
    if (Token === undefined || Token === null || Token === '') {
        res.status(401).json({ msg: 'Unauthorized' });
    }
    else {
        const CheckTokenExists = yield user_1.UserInstance.count({
            where: {
                token: Token
            }
        });
        if (CheckTokenExists !== 0) {
            jsonwebtoken_1.default.verify(Token, 'amwhizEncrypt', (err, decoded) => {
                if (err) {
                    return res.status(401).json({ msg: 'Invalid/Expired Token' });
                }
                else {
                    req.userId = decoded.data.id;
                    req.name = decoded.data.name;
                    req.email = decoded.data.email;
                    next();
                }
            });
        }
        else {
            return res.status(401).json({ msg: 'Invalid/Expired Token' });
        }
    }
});
exports.AuthCheck = AuthCheck;
