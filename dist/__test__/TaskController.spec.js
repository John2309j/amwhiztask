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
Object.defineProperty(exports, "__esModule", { value: true });
const task_1 = require("../src/controller/task");
const task_2 = require("../src/model/task");
jest.mock('../src/model/task');
describe('Task Controller', () => {
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
    });
    describe('CreateTask', () => {
        it('should create a task and return 200 status', () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = {
                title: 'Test Task',
                description: 'This is a test task',
                due_date: '2024-12-31',
            };
            req.userId = 1; // Use a number here
            task_2.TaskInstance.create.mockResolvedValue({});
            yield (0, task_1.CreateTask)(req, res);
            expect(task_2.TaskInstance.create).toHaveBeenCalledWith({
                user_id: 1, // Use a number here
                title: 'Test Task',
                description: 'This is a test task',
                status: 'new',
                due_date: '2024-12-31',
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Successfully created task' });
        }));
        it('should return 500 if validation fails', () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = {
                description: 'This is a test task',
                due_date: '2024-12-31',
            };
            yield (0, task_1.CreateTask)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: 'title is required' });
        }));
    });
    describe('UpdateTask', () => {
        it('should update a task and return 200 status', () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = {
                task_id: 1,
                title: 'Updated Task',
            };
            req.userId = 1; // Use a number here
            task_2.TaskInstance.update.mockResolvedValue([1]);
            yield (0, task_1.UpdateTask)(req, res);
            expect(task_2.TaskInstance.update).toHaveBeenCalledWith({ title: 'Updated Task' }, { where: { id: 1 } });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Successfully Updated the task' });
        }));
        it('should return 500 if task_id is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = { title: 'Updated Task' };
            req.userId = 1; // Use a number here
            yield (0, task_1.UpdateTask)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: 'task_id is required' });
        }));
    });
    describe('DeleteTask', () => {
        it('should delete a task and return 200 status', () => __awaiter(void 0, void 0, void 0, function* () {
            req.params = { id: '1' };
            req.userId = 1; // Use a number here
            task_2.TaskInstance.destroy.mockResolvedValue(1);
            yield (0, task_1.DeleteTask)(req, res);
            expect(task_2.TaskInstance.destroy).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Successfully deleted the task' });
        }));
        it('should return 500 if task does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            req.params = { id: '999' };
            req.userId = 1; // Use a number here
            task_2.TaskInstance.findOne.mockResolvedValue(null);
            yield (0, task_1.DeleteTask)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: 'task_id does not exists' });
        }));
    });
    describe('GetTask', () => {
        it('should return a list of tasks', () => __awaiter(void 0, void 0, void 0, function* () {
            req.userId = 1; // Use a number here
            req.query = {
                offset: '1',
                limit: '10',
            };
            task_2.TaskInstance.findAll.mockResolvedValue([{ id: 1, title: 'Test Task' }]);
            yield (0, task_1.GetTask)(req, res);
            expect(task_2.TaskInstance.findAll).toHaveBeenCalledWith({
                where: { user_id: 1 },
                limit: 10,
                offset: 0,
                order: [['createdAt', 'DESC']],
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ list: [{ id: 1, title: 'Test Task' }] });
        }));
    });
});
