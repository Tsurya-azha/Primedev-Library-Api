// categories.route.js

import express from 'express'
import {
  getAllCategories,
  getAllBooksByCategoryId,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categories.controller.js';
import { authorizeAdmin } from '../middleware/admin.middleware.js'

const router = express.Router()

router.get('/', getAllCategories)
router.get('/:id/books', getAllBooksByCategoryId)
router.get('/:id', getCategoryById)
router.post('/', authorizeAdmin, createCategory)
router.put('/:id', authorizeAdmin, updateCategory)
router.delete('/:id', authorizeAdmin, deleteCategory)

export default router