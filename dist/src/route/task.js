"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_1 = require("../controller/task");
const AuthCheck_1 = require("../Middleware/AuthCheck");
const TaskRouter = express_1.default.Router();
TaskRouter.post('/', AuthCheck_1.AuthCheck, task_1.CreateTask);
TaskRouter.put('/', AuthCheck_1.AuthCheck, task_1.UpdateTask);
TaskRouter.delete('/:id', AuthCheck_1.AuthCheck, task_1.DeleteTask);
TaskRouter.get('/', AuthCheck_1.AuthCheck, task_1.GetTask);
exports.default = TaskRouter;
