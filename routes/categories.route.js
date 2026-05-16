// categories.route.js

import express from 'express'
import {
  // TODO: IMPORT ALL CATEGORY CONTROLLERS
} from '../controllers/categories.controller.js'

const router = express.Router()

router.get('/', /* TODO: ADD GET ALL CATEGORIES CONTROLLER HERE */)
router.get('/:id', /* TODO: ADD GET CATEGORY CONTROLLER HERE */)
router.post('/', /* TODO: ADD CREATE CATEGORY CONTROLLER HERE */)
router.put('/:id', /* TODO: ADD UPDATE CATEGORY CONTROLLER HERE */)
router.delete('/:id', /* TODO: ADD DELETE CATEGORY CONTROLLER HERE */)

export default router