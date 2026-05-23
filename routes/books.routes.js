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

const router = express.Router()

router.get('/', getBooks)
router.get('/:id', getBooksById)
router.post('/', authorizeAdmin, bookValidation, createBook)
router.put('/:id',authorizeAdmin, updateBookValidation, updateBook)
router.delete('/:id', authorizeAdmin, deleteBook)


export default router