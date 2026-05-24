import bcrypt from 'bcryptjs'
import 'dotenv/config'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import prisma from '../configs/database.config.js'
import logger from '../configs/pino.config.js'

export const register = async (req, res) => {
  const validationErrors = validationResult(req)

  if (!validationErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: validationErrors.array(),
    })
  }

  try {
    const { name, email, password } = req.body

    const count = await prisma.users.count({ where: { email } })

    if (count > 0) {
      return res.status(409).json({
        success: false,
        error: 'Email already in use',
      })
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS),
    )

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    logger.info(`User baru berhasil terdaftar: ${email}`)

    res.status(201).json({
      message: 'Registration successful',
      user,
    })
  } catch (error) {
    logger.error(error, 'Error saat proses registrasi user')
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
}

export const login = async (req, res) => {
  const validationErrors = validationResult(req)

  if (!validationErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: validationErrors.array(),
    })
  }

  try {
    const { email, password } = req.body

    const user = await prisma.users.findUnique({
      where: { email },
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    )

    delete user.password

    logger.info(`User sukses login: ${email}`)

    res.status(200).json({
      message: 'Login successful. Copy the token below for authenticated requests. Expires in 1 hour.',
      user,
      token,
    })
  } catch (error) {
    logger.error(error, 'Error saat proses login user')
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
}