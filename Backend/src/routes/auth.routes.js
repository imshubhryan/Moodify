const express = require('express')
const authController = require('../controller/auth.controller')
const router = express.Router()

const {authIdentifyUser} = require('../middleware/auth.middleware')


/* another way of creating routes 
const {router} = require('express)
const router = Router()
*/

router.post('/register',authController.registerUser )

router.post('/login', authController.loginUser)

router.get('/get-me', authIdentifyUser, authController.getMe)

//  logout api
router.get('/logout', authController.logoutUser)

module.exports = router