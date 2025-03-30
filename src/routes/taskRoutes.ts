import { Router } from 'express'
import { authenticate } from '../middleware/authMiddleware'
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskController'

const router = Router()

router.post('/', authenticate, createTask)
router.get('/', authenticate, getTasks)
router.put('/:id', authenticate, updateTask)
router.delete('/:id', authenticate, deleteTask)

export default router
