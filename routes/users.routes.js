import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUse,
  deleteUser,
  updateUser,
} from '../controllers/users.controller'
import { getBooks } from "../controllers/books.controller";
const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUserById)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)