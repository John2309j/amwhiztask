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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../src/controller/user"); // Update the path accordingly
const user_2 = require("../src/model/user"); // Update the path accordingly
// Mocking the UserInstance model
jest.mock('../src/model/user');
// Mocking jsonwebtoken
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
}));
describe('User Controller', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        // Mock bcrypt methods
        bcrypt_1.default.hash = jest.fn().mockResolvedValue('$2b$10$Otz4JhJk.dB7w1zd7uGsWeZExzbmPPosO6KF/xg4dqAc5QewihCCK'); // Mocked hash for 'johndemo'
        bcrypt_1.default.compare = jest.fn().mockResolvedValue(true); // Default to success for correct password
    });
    describe('CreateUser', () => {
        it('should create a user and return 200 status', () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = {
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'johndemo', // Password used in the test
            };
            // Mock UserInstance.create
            user_2.UserInstance.create.mockReset();
            user_2.UserInstance.create.mockResolvedValue({});
            // Call the controller function
            yield (0, user_1.CreateUser)(req, res);
            // Ensure bcrypt.hash was called and matches expected output
            expect(bcrypt_1.default.hash).toHaveBeenCalledWith('johndemo', 10);
            // Ensure UserInstance.create was called with the correct arguments
            expect(user_2.UserInstance.create).toHaveBeenCalledWith({
                name: 'Test User',
                email: 'testuser@example.com',
                password: '$2b$10$Otz4JhJk.dB7w1zd7uGsWeZExzbmPPosO6KF/xg4dqAc5QewihCCK', // Mocked hashed password
            });
            // Check the response status and message
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Successfully created an user' });
        }));
        it('should return 500 if validation fails', () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = {
                email: 'testuser@example.com',
                password: 'johndemo',
            };
            yield (0, user_1.CreateUser)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Name is required' });
        }));
    });
    describe('LoginUser', () => {
        it('should login a user and return a token', () => __awaiter(void 0, void 0, void 0, function* () {
            // Simulate a hashed password for the existing user
            user_2.UserInstance.findOne.mockResolvedValue({
                get: jest.fn().mockReturnValue('$2b$10$Otz4JhJk.dB7w1zd7uGsWeZExzbmPPosO6KF/xg4dqAc5QewihCCK'), // Mocked hashed password
            });
            user_2.UserInstance.update.mockResolvedValue([1]);
            const token = 'mockedToken';
            jsonwebtoken_1.default.sign.mockReturnValue(token);
            req.body = {
                email: 'testuser@example.com',
                password: 'johndemo', // Password used in the test
            };
            // Mock bcrypt.compare for successful password match
            bcrypt_1.default.compare = jest.fn().mockResolvedValue(true);
            yield (0, user_1.LoginUser)(req, res);
            expect(user_2.UserInstance.findOne).toHaveBeenCalledWith({
                where: { email: 'testuser@example.com' },
            });
            expect(jsonwebtoken_1.default.sign).toHaveBeenCalledWith({ data: { email: 'testuser@example.com' } }, 'amwhizEncrypt', { expiresIn: 60 * 60 });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                token,
                msg: 'login successfull',
            });
        }));
        it('should return 500 if login fails', () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = {
                email: 'testuser@example.com',
                password: 'wrongpassword',
            };
            // Simulate a hashed password for the existing user
            user_2.UserInstance.findOne.mockResolvedValue({
                get: jest.fn().mockReturnValue('$2b$10$Otz4JhJk.dB7w1zd7uGsWeZExzbmPPosO6KF/xg4dqAc5QewihCCK'), // Mocked hashed password
            });
            // Mock bcrypt.compare for incorrect password
            bcrypt_1.default.compare = jest.fn().mockResolvedValue(false);
            yield (0, user_1.LoginUser)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid Login' });
        }));
    });
    describe('Logout', () => {
        it('should logout a user and return 200 status', () => __awaiter(void 0, void 0, void 0, function* () {
            req.headers = { authorization: 'validtoken' };
            jsonwebtoken_1.default.verify.mockImplementation((token, secret, callback) => callback(null, { data: { email: 'testuser@example.com' } }));
            user_2.UserInstance.update.mockResolvedValue([1]);
            yield (0, user_1.Logout)(req, res);
            expect(jsonwebtoken_1.default.verify).toHaveBeenCalledWith('validtoken', 'amwhizEncrypt', expect.any(Function));
            expect(user_2.UserInstance.update).toHaveBeenCalledWith({ token: null }, { where: { email: 'testuser@example.com' } });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: 'logout successfull' });
        }));
        it('should return 500 if token is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            req.headers = { authorization: 'invalidtoken' };
            jsonwebtoken_1.default.verify.mockImplementation((token, secret, callback) => callback(new Error('Invalid token'), null));
            yield (0, user_1.Logout)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid/Expired token' });
        }));
        it('should return 500 if no token is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            req.headers = {};
            yield (0, user_1.Logout)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Token is required' });
        }));
    });
});
