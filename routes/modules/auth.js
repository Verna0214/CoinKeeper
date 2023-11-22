const express = require('express')
const passport = require('passport')
const router = express.Router()

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/signin'
}))
router.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }))
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/signin'
}))

module.exports = router
