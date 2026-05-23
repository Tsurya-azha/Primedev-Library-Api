import express from "express";
import prisma from "../configs/database.config.js";
import {
    getAllBorrowings,
    getBorrowingById,
    createBorrowing,
    returnBook,
    deleteBorrowing,
} from "../controllers/borrowings.controller.js"

const router = express.Router()

router.get('/', getAllBorrowings)
router.get('/:id', getBorrowingById)
router.post('/', createBorrowing)
router.put('/:id/', returnBook)
router.delete('/', deleteBorrowing)

export default router