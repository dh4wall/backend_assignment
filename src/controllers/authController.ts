import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../config/database'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = signupSchema.parse(req.body)

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, password: hashedPassword }
    })

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' })
    res.status(201).json({ token })
  } catch (err) {
    res.status(400).json({ message: 'Invalid input' })
  }
}

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = signinSchema.parse(req.body)

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' })
    res.status(200).json({ token })
  } catch {
    res.status(401).json({ message: 'Invalid input' })
  }
}