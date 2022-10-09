const router = require('express').Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.post('/login', (req, res) => {
  res.send('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body
    const errors = []

    if (!name || !email || !password || !confirmPassword) {
      errors.push({ message: '所有欄位都必填' })
    }

    if (password !== confirmPassword) {
      errors.push({ message: '密碼與確認密碼不相符' })
    }

    if (errors.length) {
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }

    const user = await User.findOne({ where: { email } })
    if (user) {
      errors.push({ message: '使用者已存在' })
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    await User.create({
      name,
      email,
      password: hash
    })
    res.redirect('/')
  } catch (err) {
    next(err)
  }
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'logout finish')
  res.redirect('/uses/login')
})

module.exports = router
