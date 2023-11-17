const bcrypt = require('bcryptjs')
const Users = require('../models/user')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signUp: async (req, res) => {
    try {
      const { name, email, password, passwordConfirm } = req.body
      if (password !== passwordConfirm) {
        console.info('Passwords do not match!')
        return res.redirect('/signup')
      }
      const user = await Users.findOne({ email })
      if (user) {
        console.info('User had an account already!')
        return res.redirect('/signin')
      }

      await Users.create({
        name,
        email,
        password: bcrypt.hashSync(password, 10)
      })
      res.redirect('/signin')
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = userController
