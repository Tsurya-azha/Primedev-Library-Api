import express from 'express'
import prisma from '../configs/database.config.js'
import { validationResult } from 'express-validator'
import logger from '../configs/pino.config.js'



export const submitReview = async (req, res) => {
    const validationErrors = validationResult(req)

    if(!validationErrors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            error: validationErrors.array()
        })
    }

        try{
            const {rating, comment, bookId} = req.body

            const review = await prisma.review.create({
                data:{
                    rating: Number(rating),
                    comment: comment,
                    userId: req.user.id,
                    bookId: Number(bookId),
                }
            })

             res.status(201).json({
                success: true,
                message: 'Review submitted',
                data:    review,
             })
        }

        catch (error) {
            logger.error(error, 'Error saat submit review')
            res.status(500).json({
                success: false,
                message: 'Internal server Error',
                error: error.message
            })
        }
    }

export const getReviewsByBookId = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const review = await prisma.review.findMany({
            where: {bookId: Number(id)},
            include: {
            select: {
                id: true,
                rating: true,
                comment: true,
                user: {
                    select: {
                        name: true
                    }
                }
            }}
        })

        res.json({
            success: true,
            message: 'Buku berhasil didapatkan sesuai review',
            data: review
        })
    }
    catch (error) {
        logger.error(error, 'Buku tidak berhasil didapatkan')
    res.status(500).json({
        success: false,
        message: 'Internal server error',
    })
    }
}