const router = require('express').Router()
const db = require('../../models')
const Todo = db.Todo

router.get('/', async (req, res, next) => {
  try {
    const UserId = req.user.id
    const todos = await Todo.findAll({
      raw: true,
      nest: true,
      where: { UserId }
    })
    return res.render('index', { todos })
  } catch (err) {
    next(err)
  }
})

module.exports = router
