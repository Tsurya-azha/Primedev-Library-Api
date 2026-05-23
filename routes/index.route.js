import express from 'express'
import booksRoute from './books.routes.js'
import usersRoute from './users.routes.js'
import profilesRoute from './profiles.routes.js'
import categoriesRoute from './categories.route.js'
import borrowingsRoute from './borrowings.routes.js'
const router = express.Router()

router.get('/', (req, res) => {
  res.send('Welcome to the API Library')
})

router.use('/books', booksRoute)
router.use('/users', usersRoute)
router.use('/profiles', profilesRoute)
router.use('/categories', categoriesRoute)
router.use('/borrowings', borrowingsRoute)

export default router