import { body } from "express-validator"

export const ratingValidation = [
    body( 'rating' )
    .optional()
    .isInt({ min:1, max:5 })
    .withMessage('Rating must be a number!')
    .notEmpty()
    .withMessage('Rating is required!')
]

export const commentValidation = [
    body( 'comment' )
    .optional()
    .isString()
    .withMessage('Comment must be string!')
    .notEmpty()
    .withMessage('Comment must filled!')
]
