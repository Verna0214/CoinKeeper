const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const userController = require('../controllers/user-controller')

router.get('/signup', userController.signUpPage)
router.get('/signin', userController.signInPage)
router.post('/signup', userController.signUp)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin' }), userController.signIn)
router.get('/', (req, res) => {
  res.render('records')
})

module.exports = router
