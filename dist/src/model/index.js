"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./user");
const task_1 = require("./task");
const SyncModels = () => {
    user_1.UserInstance.sync({ alter: true });
    task_1.TaskInstance.sync({ alter: true });
};
exports.default = SyncModels;
