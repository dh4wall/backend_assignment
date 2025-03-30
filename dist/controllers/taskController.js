"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTasks = exports.createTask = void 0;
const database_1 = __importDefault(require("../config/database"));
const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const task = await database_1.default.task.create({
            data: { title, description, userId }
        });
        res.status(201).json(task);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
};
exports.createTask = createTask;
const getTasks = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const tasks = await database_1.default.task.findMany({ where: { userId } });
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get tasks' });
    }
};
exports.getTasks = getTasks;
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const task = await database_1.default.task.findUnique({ where: { id } });
        if (!task || task.userId !== userId) {
            res.status(403).json({ error: 'Not authorized to update this task' });
            return;
        }
        const updatedTask = await database_1.default.task.update({
            where: { id },
            data: { title, description }
        });
        res.status(200).json(updatedTask);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const task = await database_1.default.task.findUnique({ where: { id } });
        if (!task || task.userId !== userId) {
            res.status(403).json({ error: 'Not authorized to delete this task' });
            return;
        }
        await database_1.default.task.delete({ where: { id } });
        res.status(200).json({ message: 'Task deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
};
exports.deleteTask = deleteTask;
