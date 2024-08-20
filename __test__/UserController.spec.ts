import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import { CreateUser, LoginUser, Logout } from '../src/controller/user'; // Update the path accordingly
import { UserInstance } from '../src/model/user'; // Update the path accordingly

// Mocking the UserInstance model
jest.mock('../src/model/user');

// Mocking jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
  decode: jest.fn(),
}));

describe('User Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    // Mock bcrypt methods
    bcrypt.hash = jest.fn().mockResolvedValue('$2b$10$Otz4JhJk.dB7w1zd7uGsWeZExzbmPPosO6KF/xg4dqAc5QewihCCK'); // Mocked hash for 'johndemo'
    bcrypt.compare = jest.fn().mockResolvedValue(true); // Default to success for correct password
  });

  describe('CreateUser', () => {
    it('should create a user and return 200 status', async () => {
      req.body = {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'johndemo', // Password used in the test
      };

      // Mock UserInstance.create
      (UserInstance.create as jest.Mock).mockReset();
      (UserInstance.create as jest.Mock).mockResolvedValue({});

      // Call the controller function
      await CreateUser(req as Request, res as Response);

      // Ensure bcrypt.hash was called and matches expected output
      expect(bcrypt.hash).toHaveBeenCalledWith('johndemo', 10);

      // Ensure UserInstance.create was called with the correct arguments
      expect(UserInstance.create).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'testuser@example.com',
        password: '$2b$10$Otz4JhJk.dB7w1zd7uGsWeZExzbmPPosO6KF/xg4dqAc5QewihCCK', // Mocked hashed password
      });

      // Check the response status and message
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Successfully created an user' });
    });

    it('should return 500 if validation fails', async () => {
      req.body = {
        email: 'testuser@example.com',
        password: 'johndemo',
      };

      await CreateUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Name is required' });
    });
  });

  describe('LoginUser', () => {
    it('should login a user and return a token', async () => {
      // Simulate a hashed password for the existing user
      (UserInstance.findOne as jest.Mock).mockResolvedValue({
        get: jest.fn().mockReturnValue('$2b$10$Otz4JhJk.dB7w1zd7uGsWeZExzbmPPosO6KF/xg4dqAc5QewihCCK'), // Mocked hashed password
      });

      (UserInstance.update as jest.Mock).mockResolvedValue([1]);

      const token = 'mockedToken';
      (Jwt.sign as jest.Mock).mockReturnValue(token);

      req.body = {
        email: 'testuser@example.com',
        password: 'johndemo', // Password used in the test
      };

      // Mock bcrypt.compare for successful password match
      bcrypt.compare = jest.fn().mockResolvedValue(true);

      await LoginUser(req as Request, res as Response);

      expect(UserInstance.findOne).toHaveBeenCalledWith({
        where: { email: 'testuser@example.com' },
      });

      expect(Jwt.sign).toHaveBeenCalledWith(
        { data: { email: 'testuser@example.com' } },
        'amwhizEncrypt',
        { expiresIn: 60 * 60 }
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        token,
        msg: 'login successfull',
      });
    });

    it('should return 500 if login fails', async () => {
      req.body = {
        email: 'testuser@example.com',
        password: 'wrongpassword',
      };

      // Simulate a hashed password for the existing user
      (UserInstance.findOne as jest.Mock).mockResolvedValue({
        get: jest.fn().mockReturnValue('$2b$10$Otz4JhJk.dB7w1zd7uGsWeZExzbmPPosO6KF/xg4dqAc5QewihCCK'), // Mocked hashed password
      });

      // Mock bcrypt.compare for incorrect password
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await LoginUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid Login' });
    });
  });

  describe('Logout', () => {
    it('should logout a user and return 200 status', async () => {
      req.headers = { authorization: 'validtoken' };

      (Jwt.verify as jest.Mock).mockImplementation((token, secret, callback) =>
        callback(null, { data: { email: 'testuser@example.com' } })
      );
      (UserInstance.update as jest.Mock).mockResolvedValue([1]);

      await Logout(req as Request, res as Response);

      expect(Jwt.verify).toHaveBeenCalledWith('validtoken', 'amwhizEncrypt', expect.any(Function));

      expect(UserInstance.update).toHaveBeenCalledWith(
        { token: null },
        { where: { email: 'testuser@example.com' } }
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ msg: 'logout successfull' });
    });

    it('should return 500 if token is invalid', async () => {
      req.headers = { authorization: 'invalidtoken' };

      (Jwt.verify as jest.Mock).mockImplementation((token, secret, callback) =>
        callback(new Error('Invalid token'), null)
      );

      await Logout(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid/Expired token' });
    });

    it('should return 500 if no token is provided', async () => {
      req.headers = {};

      await Logout(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Token is required' });
    });
  });
});
