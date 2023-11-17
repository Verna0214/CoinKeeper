const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin' }), userController.signIn)
router.get('/logout', userController.logout)
router.get('/records', (req, res) => res.render('records'))
router.get('/', (req, res) => res.redirect('/records'))
router.use('/', generalErrorHandler)
module.exports = router
