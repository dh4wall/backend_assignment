import { Response } from 'express'
import prisma from '../config/database'
import { UserRequest } from '../middleware/authMiddleware'

export const createTask = async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const task = await prisma.task.create({
      data: { title, description, userId }
    })

    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' })
  }
}

export const getTasks = async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const tasks = await prisma.task.findMany({ where: { userId } })
    res.status(200).json(tasks)
  } catch (error) {
    res.status(500).json({ error: 'Failed to get tasks' })
  }
}

export const updateTask = async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { title, description } = req.body
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const task = await prisma.task.findUnique({ where: { id } })
    if (!task || task.userId !== userId) {
      res.status(403).json({ error: 'Not authorized to update this task' })
      return
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { title, description }
    })

    res.status(200).json(updatedTask)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' })
  }
}

export const deleteTask = async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const task = await prisma.task.findUnique({ where: { id } })
    if (!task || task.userId !== userId) {
      res.status(403).json({ error: 'Not authorized to delete this task' })
      return
    }

    await prisma.task.delete({ where: { id } })
    res.status(200).json({ message: 'Task deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' })
  }
}