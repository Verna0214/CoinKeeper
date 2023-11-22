const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const recordController = require('../controllers/record-controller')
const auth = require('./modules/auth')

const { authenticator } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/auth', auth)
router.get('/records/chart', authenticator, recordController.chartPage)
router.get('/records/new', authenticator, recordController.createPage)
router.get('/records/:id/edit', authenticator, recordController.editPage)
router.put('/records/:id', authenticator, recordController.putRecord)
router.delete('/records/:id', authenticator, recordController.deleteRecord)
router.post('/records', authenticator, recordController.postRecord)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin' }), userController.signIn)
router.get('/logout', userController.logout)
router.get('/records', authenticator, recordController.getRecords)
router.get('/', authenticator, (req, res) => res.redirect('/records'))
router.use('/', generalErrorHandler)

module.exports = router
