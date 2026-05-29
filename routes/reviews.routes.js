import express from 'express'
import prisma from '../configs/database.config.js'
import {
    submitReview,
    getReviewsByBookId
} from '../controllers/reviews.controller.js'

const router = express.Router()

router.post('/', submitReview)
router.get('/:id/books', getReviewsByBookId)

export default router