const {Router} = require('express')
const upload = require('../middleware/upload.middleware')
const songController = require('../controller/song.controller')

const router =  Router()

router.post('/', upload.single('song'), songController.uploadSong )

router.get('/',songController.getSong)

module.exports = router