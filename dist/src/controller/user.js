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
exports.Logout = exports.LoginUser = exports.CreateUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../model/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const CreateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Isvalid = yield ValidateCreateUserObject(req.body);
    if (Isvalid.valid) {
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
        try {
            const CreateUser = yield user_1.UserInstance.create({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            });
            res.status(200).json({ msg: 'Successfully created an user' });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Error on creating the user' });
        }
    }
    else {
        res.status(500).json({ msg: Isvalid.message });
    }
});
exports.CreateUser = CreateUser;
const LoginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Isvalid = yield ValidaLoginObject(req.body);
    if (Isvalid.valid) {
        const UserDetails = yield user_1.UserInstance.findOne({
            where: {
                email: req.body.email
            }
        });
        if (UserDetails) {
            const password = UserDetails.get('password');
            if (password) {
                const isMatch = yield bcrypt_1.default.compare(req.body.password, password);
                if (isMatch) {
                    const Token = jsonwebtoken_1.default.sign({
                        data: UserDetails
                    }, 'amwhizEncrypt', { expiresIn: 60 * 60 });
                    yield user_1.UserInstance.update({
                        token: Token
                    }, {
                        where: {
                            email: req.body.email
                        }
                    });
                    res.status(200).json({
                        token: Token,
                        msg: 'login successfull'
                    });
                }
                else {
                    res.status(500).json({ msg: 'Invalid Login' });
                }
            }
        }
    }
    else {
        res.status(500).json({ msg: Isvalid.message });
    }
});
exports.LoginUser = LoginUser;
const Logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Headers = req.headers.authorization;
    if (Headers === undefined || Headers === '' || Headers === null) {
        res.status(500).json({ msg: 'Token is required' });
    }
    else {
        let Uservalid = {};
        jsonwebtoken_1.default.verify(Headers, 'amwhizEncrypt', function (err, decoded) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    res.status(500).json({ msg: 'Invalid/Expired token' });
                }
                if (decoded) {
                    Uservalid = decoded.data;
                    yield user_1.UserInstance.update({
                        token: null
                    }, {
                        where: {
                            email: Uservalid.email
                        }
                    });
                    res.status(200).json({ msg: 'logout successfull' });
                }
            });
        });
    }
});
exports.Logout = Logout;
function ValidaLoginObject(Obj) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Obj || typeof Obj !== 'object') {
            return {
                valid: false,
                message: 'Invalid input data'
            };
        }
        if (Obj.email === undefined || Obj.email === null || Obj.email === '') {
            return {
                valid: false,
                message: 'Email is required'
            };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(Obj.email)) {
            return {
                valid: false,
                message: 'Invalid email format'
            };
        }
        if (Obj.password === undefined || Obj.password === null || Obj.password === '') {
            return {
                valid: false,
                message: 'Password is required'
            };
        }
        const CheckUserExists = yield user_1.UserInstance.count({
            where: {
                email: Obj.email
            }
        });
        if (CheckUserExists === 0) {
            return {
                valid: false,
                message: 'User with this email does not exist in the system'
            };
        }
        return {
            valid: true,
            message: 'Validation successful'
        };
    });
}
function ValidateCreateUserObject(Obj) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Obj || typeof Obj !== 'object') {
            return {
                valid: false,
                message: 'Invalid input data'
            };
        }
        if (Obj.name === undefined || Obj.name === null || Obj.name === '') {
            return {
                valid: false,
                message: 'Name is required'
            };
        }
        if (Obj.email === undefined || Obj.email === null || Obj.email === '') {
            return {
                valid: false,
                message: 'Email is required'
            };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(Obj.email)) {
            return {
                valid: false,
                message: 'Invalid email format'
            };
        }
        if (Obj.password === undefined || Obj.password === null || Obj.password === '') {
            return {
                valid: false,
                message: 'Password is required'
            };
        }
        const CheckUserExists = yield user_1.UserInstance.count({
            where: {
                email: Obj.email
            }
        });
        if (CheckUserExists !== 0) {
            return {
                valid: false,
                message: 'User account already exists'
            };
        }
        return {
            valid: true,
            message: 'Validation successful'
        };
    });
}
