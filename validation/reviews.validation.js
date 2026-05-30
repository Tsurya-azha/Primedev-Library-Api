import { body } from "express-validator"

export const ratingValidation = [
    body( 'rating' )
    .optional()
    .isInt({ min:1, max:5 })
    .withMessage('Rating must between 1 to 5')
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
