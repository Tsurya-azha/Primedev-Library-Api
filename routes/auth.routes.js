import express from 'express'
import prisma from '../configs/database.config.js'
import {
    register,
    login,
} from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/register', register)
router.put('/login', login)

export default router