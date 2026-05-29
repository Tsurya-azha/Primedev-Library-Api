import express from "express";
import prisma from "../configs/database.config.js";
import {
    getAllBorrowings,
    getBorrowingById,
    createBorrowing,
    returnBook,
    deleteBorrowing,
} from "../controllers/borrowings.controller.js"
import { authorizeAdmin } from "../middleware/admin.middleware.js";

const router = express.Router()

router.get('/', authorizeAdmin, getAllBorrowings)
router.get('/:id',authorizeAdmin, getBorrowingById)
router.post('/', createBorrowing)
router.put('/:id/', returnBook)
router.delete('/', deleteBorrowing)

export default router