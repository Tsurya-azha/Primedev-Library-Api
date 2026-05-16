// profiles.route.js

import express from 'express'
import {
  
} from '../controllers/profiles.controller.js'

const router = express.Router()

router.get('/', /* TODO: ADD GET ALL PROFILES CONTROLLER HERE */)
router.get('/:id', /* TODO: ADD GET PROFILE CONTROLLER HERE */)
router.post('/', /* TODO: ADD CREATE PROFILE CONTROLLER HERE */)
router.put('/:id', /* TODO: ADD UPDATE PROFILE CONTROLLER HERE */)
router.delete('/:id', /* TODO: ADD DELETE PROFILE CONTROLLER HERE */)

export default router