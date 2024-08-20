import { Request, Response } from 'express';
import { CreateTask, UpdateTask, DeleteTask, GetTask } from '../src/controller/task';
import { TaskInstance } from '../src/model/task';
import { AuthenticatedRequest } from '../src/Middleware/AuthCheck';

jest.mock('../src/model/task');

describe('Task Controller', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('CreateTask', () => {
    it('should create a task and return 200 status', async () => {
      req.body = {
        title: 'Test Task',
        description: 'This is a test task',
        due_date: '2024-12-31',
      };
      req.userId = 1; // Use a number here

      (TaskInstance.create as jest.Mock).mockResolvedValue({});

      await CreateTask(req as AuthenticatedRequest, res as Response);

      expect(TaskInstance.create).toHaveBeenCalledWith({
        user_id: 1, // Use a number here
        title: 'Test Task',
        description: 'This is a test task',
        status: 'new',
        due_date: '2024-12-31',
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Successfully created task' });
    });

    it('should return 500 if validation fails', async () => {
      req.body = {
        description: 'This is a test task',
        due_date: '2024-12-31',
      };

      await CreateTask(req as AuthenticatedRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: 'title is required' });
    });
  });

  describe('UpdateTask', () => {
    it('should update a task and return 200 status', async () => {
      req.body = {
        task_id: 1,
        title: 'Updated Task',
      };
      req.userId = 1; // Use a number here

      (TaskInstance.update as jest.Mock).mockResolvedValue([1]);

      await UpdateTask(req as AuthenticatedRequest, res as Response);

      expect(TaskInstance.update).toHaveBeenCalledWith(
        { title: 'Updated Task' },
        { where: { id: 1 } }
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Successfully Updated the task' });
    });

    it('should return 500 if task_id is missing', async () => {
      req.body = { title: 'Updated Task' };
      req.userId = 1; // Use a number here

      await UpdateTask(req as AuthenticatedRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: 'task_id is required' });
    });
  });

  describe('DeleteTask', () => {
    it('should delete a task and return 200 status', async () => {
      req.params = { id: '1' };
      req.userId = 1; // Use a number here

      (TaskInstance.destroy as jest.Mock).mockResolvedValue(1);

      await DeleteTask(req as AuthenticatedRequest, res as Response);

      expect(TaskInstance.destroy).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Successfully deleted the task' });
    });

    it('should return 500 if task does not exist', async () => {
      req.params = { id: '999' };
      req.userId = 1; // Use a number here

      (TaskInstance.findOne as jest.Mock).mockResolvedValue(null);

      await DeleteTask(req as AuthenticatedRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: 'task_id does not exists' });
    });
  });

  describe('GetTask', () => {
    it('should return a list of tasks', async () => {
      req.userId = 1; // Use a number here
      req.query = {
        offset: '1',
        limit: '10',
      };

      (TaskInstance.findAll as jest.Mock).mockResolvedValue([{ id: 1, title: 'Test Task' }]);

      await GetTask(req as AuthenticatedRequest, res as Response);

      expect(TaskInstance.findAll).toHaveBeenCalledWith({
        where: { user_id: 1 },
        limit: 10,
        offset: 0,
        order: [['createdAt', 'DESC']],
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ list: [{ id: 1, title: 'Test Task' }] });
    });
  });
});
