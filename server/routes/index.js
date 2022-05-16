const express = require('express')
const router = express.Router()
const routerUser = require('./userRouter')
router.use('/users', routerUser)

router.get('/', (req, res) => {
    res.send('ini home')
})

module.exports = router