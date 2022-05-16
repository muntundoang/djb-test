const express = require('express')
const userController = require('../controllers/userController')
let routerUser = express.Router()

// routerUser.use(authentication)
routerUser.get('/', userController.findUser)
routerUser.post('/register', userController.register)
routerUser.post('/login', userController.login)
routerUser.post('/auth', userController.authentication)

module.exports = routerUser