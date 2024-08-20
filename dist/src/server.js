"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = require("express-rate-limit");
const database_config_1 = __importDefault(require("./config/database.config"));
const model_1 = __importDefault(require("./model"));
const user_1 = __importDefault(require("./route/user"));
const task_1 = __importDefault(require("./route/task"));
const app = (0, express_1.default)();
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 100, // Limit each IP to 5 requests per `window` (here, per 1 minute).
    standardHeaders: true,
    legacyHeaders: false
});
app.use(limiter);
database_config_1.default.sync().then(() => {
    (0, model_1.default)();
}).catch((err) => {
    console.log('Error Connecting database', err);
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/user', user_1.default);
app.use('/task', task_1.default);
app.get('/', (req, res) => {
    res.status(200).json({ msg: 'App Running' });
});
app.listen(5000, () => {
    console.log('app running');
});
