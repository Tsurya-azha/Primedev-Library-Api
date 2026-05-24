import express from 'express'
import prisma from '../configs/database.config.js'
import {
  getBooks,
  getBooksById,
  createBook,
  updateBook,
  deleteBook,
} from '../controllers/books.controller.js'
import {
  bookValidation,
  updateBookValidation,
} from "../validation/books.validation.js"
import { authorizeAdmin } from '../middleware/admin.middleware.js'
import multer from 'multer'
import logger from '../configs/pino.config.js'

const storage = multer.memoryStorage()
const upload = multer({ storage })

const router = express.Router()

router.get('/', getBooks)
router.get('/:id', getBooksById)
router.post('/', authorizeAdmin, upload.single('cover'), bookValidation, createBook)
router.put('/:id',authorizeAdmin, upload.single('cover'), updateBookValidation, updateBook)
router.delete('/:id', authorizeAdmin, deleteBook)


export default router