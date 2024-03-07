const userController = require('../controllers/userController')
const { authValidator } = require('../validators/authValidator')
const router = require('express').Router()

router.post('/', authValidator, userController.getAuth)

module.exports = { router}