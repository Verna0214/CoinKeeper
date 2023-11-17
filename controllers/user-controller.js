const bcrypt = require('bcryptjs')
const Users = require('../models/user')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signUp: async (req, res, next) => {
    try {
      const { name, email, password, passwordConfirm } = req.body
      if (password !== passwordConfirm) throw new Error('Passwords do not match！')
      const user = await Users.findOne({ email })
      if (user) throw new Error('User had an account already！')

      await Users.create({
        name,
        email,
        password: bcrypt.hashSync(password, 10)
      })
      req.flash('success_messages', 'Successfully create an account！')
      res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Successfully login！')
    return res.redirect('/records')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Successfully logout！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController
