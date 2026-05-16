import express from "express";
import {
  getUsers,
  getUserById,
  getUserByIdWithProfile,
  updateUser,
  createUser,
  deleteUser,
} from '../controllers/users.controller.js'
import { getBooks } from "../controllers/books.controller.js";
const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUserById)
router.get('/:id/profile', getUserByIdWithProfile)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router