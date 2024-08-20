"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db = new sequelize_1.Sequelize('amwhiz', 'root', 'john1234', {
    host: '127.0.0.1',
    port: 3308,
    dialect: 'mysql'
});
exports.default = db;
