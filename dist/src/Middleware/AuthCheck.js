"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthCheck = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthCheck = (req, res, next) => {
    const Token = req.headers.authorization;
    if (Token === undefined || Token === null || Token === '') {
        res.status(401).json({ msg: 'Unauthorized' });
    }
    else {
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
};
exports.AuthCheck = AuthCheck;
