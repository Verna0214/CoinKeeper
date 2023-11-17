const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/', (req, res) => {
  res.render('index')
})

module.exports = router
