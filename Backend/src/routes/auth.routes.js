const express = require('express')
const authController = require('../controller/auth.controller')
const router = express.Router()


/* another way of creating routes 
const {router} = require('express)
const router = Router()
*/

router.post('/register',authController.registerUser )

router.post('/login', authController.loginUser)

module.exports = router