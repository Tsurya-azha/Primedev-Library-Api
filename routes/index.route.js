import express from 'express'
import booksRoute from './books.routes.js'
import usersRoute from './users.routes.js'
import profilesRoute from './profiles.routes.js'
import categoriesRoute from './categories.route.js'
import borrowingsRoute from './borrowings.routes.js'
import authRoutes from './auth.routes.js'
import reviewsRoutes from './reviews.routes.js'
import { authenticateToken } from '../middleware/auth.middleware.js'
import { authorizeAdmin } from '../middleware/admin.middleware.js'
const router = express.Router()

router.get('/', (req, res) => {
  res.send('Welcome to the API Library Yee')
})

router.use('/books',authenticateToken, booksRoute)
router.use('/users', authorizeAdmin, authenticateToken, usersRoute)
router.use('/profiles', authorizeAdmin, authenticateToken, profilesRoute)
router.use('/categories',authenticateToken, categoriesRoute)
router.use('/borrowings', authorizeAdmin, authenticateToken, borrowingsRoute)
router.use('/auth', authRoutes)
router.use('/reviews', authenticateToken, reviewsRoutes)

export default router