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
exports.GetTask = exports.DeleteTask = exports.UpdateTask = exports.CreateTask = void 0;
const task_1 = require("../model/task");
const CreateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const IsValid = yield CheckCreateTaskObject(req.body);
    if (IsValid.valid) {
        try {
            yield task_1.TaskInstance.create({
                user_id: Number(req.userId),
                title: req.body.title,
                description: req.body.description,
                status: 'new',
                due_date: req.body.due_date
            });
            res.status(200).json({ msg: 'Successfully created task' });
        }
        catch (err) {
            res.status(200).json({ msg: 'Eeatingrror on creating taks' });
        }
    }
    else {
        res.status(500).json({ msg: IsValid.message });
    }
});
exports.CreateTask = CreateTask;
const UpdateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Isvalid = yield CheckUpdateObject(req.body, Number(req.userId));
    if (Isvalid.valid) {
        let UpdateObj = {};
        if (req.body.status !== undefined && req.body.status !== null && req.body.status !== '') {
            UpdateObj['status'] = req.body.status;
        }
        if (req.body.title !== undefined && req.body.title !== null && req.body.title !== '') {
            UpdateObj['title'] = req.body.title;
        }
        if (req.body.description !== undefined && req.body.description !== null && req.body.description !== '') {
            UpdateObj['description'] = req.body.description;
        }
        if (req.body.due_date !== undefined && req.body.due_date !== null && req.body.due_date !== '') {
            UpdateObj['due_date'] = req.body.due_date;
        }
        yield task_1.TaskInstance.update(UpdateObj, {
            where: {
                id: req.body.task_id
            }
        });
        res.status(200).json({ msg: 'Succesffully Updated the task' });
    }
    else {
        res.status(500).json({ msg: Isvalid.message });
    }
});
exports.UpdateTask = UpdateTask;
const DeleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = { id: Number(req.params.id) };
    const IsValid = yield CheckDeleteAccess(taskId, Number(req.userId));
    if (IsValid.valid) {
        try {
            yield task_1.TaskInstance.destroy({
                where: {
                    id: taskId.id
                }
            });
            res.status(200).json({ msg: 'Sucessfully deleted the task' });
        }
        catch (err) {
            res.status(500).json({ msg: 'Erron on deleting task' });
        }
    }
    else {
        res.status(500).json({ msg: IsValid.message });
    }
});
exports.DeleteTask = DeleteTask;
const GetTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let offset = parseInt(req.query.offset)
        ? parseInt(req.query.offset)
        : undefined;
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : undefined;
    offset = (offset - 1) * Number(limit);
    if (offset >= 0) {
        offset = offset;
    }
    else {
        offset = 0;
    }
    const sortField = req.query.sortby || 'createdAt';
    const sortOrder = req.query.sortorder || 'DESC';
    const status = req.query.status;
    const dueDate = req.query.due_date;
    const whereCondition = { user_id: req.userId };
    if (status) {
        whereCondition.status = status;
    }
    if (dueDate) {
        whereCondition.due_date = dueDate;
    }
    // Perform the query with the options provided or defaults
    const GetTasks = yield task_1.TaskInstance.findAll({
        where: whereCondition,
        limit: limit,
        offset: offset,
        order: [
            [sortField, sortOrder]
        ]
    });
    return res.status(200).json({ list: GetTasks });
});
exports.GetTask = GetTask;
function CheckDeleteAccess(Obj, UserId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Obj || typeof Obj !== 'object') {
            return {
                valid: false,
                message: 'Invalid input data'
            };
        }
        if (Obj.id === undefined || Obj.id === null) {
            return {
                valid: false,
                message: 'task_id is required'
            };
        }
        const CheckTask = yield task_1.TaskInstance.findOne({
            where: {
                id: Obj.id
            }
        });
        if (CheckTask === null) {
            return {
                valid: false,
                message: 'task_id does not exists'
            };
        }
        else {
            if (CheckTask.dataValues.user_id !== UserId) {
                return {
                    valid: false,
                    message: 'You dont have permission to delete this task'
                };
            }
        }
        return {
            valid: true,
            message: 'Validation successfull'
        };
    });
}
function CheckUpdateObject(Obj, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Obj || typeof Obj !== 'object') {
            return {
                valid: false,
                message: 'Invalid input data'
            };
        }
        if (Obj.task_id === undefined || Obj.task_id === null) {
            return {
                valid: false,
                message: 'task_id is required'
            };
        }
        const CheckTask = yield task_1.TaskInstance.findOne({
            where: {
                id: Obj.task_id
            }
        });
        if (CheckTask === null) {
            return {
                valid: false,
                message: 'task_id does not exists'
            };
        }
        else {
            if (CheckTask.dataValues.user_id !== userId) {
                return {
                    valid: false,
                    message: 'You dont have permission to update this task'
                };
            }
        }
        return {
            valid: true,
            message: 'Validation successfull'
        };
    });
}
function CheckCreateTaskObject(Obj) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Obj || typeof Obj !== 'object') {
            return {
                valid: false,
                message: 'Invalid input data'
            };
        }
        if (Obj.title === undefined || Obj.title === null || Obj.title === '') {
            return {
                valid: false,
                message: 'title is required'
            };
        }
        if (Obj.description === undefined || Obj.description === null || Obj.description === '') {
            return {
                valid: false,
                message: 'description is required'
            };
        }
        if (Obj.due_date === undefined || Obj.due_date === null || Obj.due_date === '') {
            return {
                valid: false,
                message: 'due_date is required'
            };
        }
        return {
            valid: true,
            message: 'Validation successful'
        };
    });
}
