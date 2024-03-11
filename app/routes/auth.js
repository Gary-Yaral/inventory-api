const userController = require('../controllers/userController')
const { validateRefreshToken } = require('../middlewares/auth')
const { authValidator } = require('../validators/authValidator')
const router = require('express').Router()

router.post('/', authValidator, userController.getAuth)
router.post('/refresh-token', validateRefreshToken, userController.refreshtoken)

module.exports = { router}