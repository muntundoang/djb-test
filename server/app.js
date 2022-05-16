if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  
  const express = require('express')
  const cors = require('cors')
  const app = express()
  const port = process.env.PORT || 3000
  const router = require('./routes/index.js')
  
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  
  app.use('/', router)
  
  app.listen(port, () => {
    console.log(`Gas keun ${port}`)
  })
  
  // module.exports = app