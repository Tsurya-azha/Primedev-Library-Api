import express from 'express'
import prisma from '../database.js'
import {
  getBooks,
  getBooksById,
  createBook,
  updateBook,
  deleteBook,
} from '../controllers/books.controller.js'

const router = express.Router()

router.get('/', getBooks)
router.get('/:id', getBooksById)
router.post('/', createBook)
router.put('/:id', updateBook)
router.delete('/:id', deleteBook)

export default router