const router = require('express').Router()
const db = require('../../models')
const Todo = db.Todo

router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', async (req, res, next) => {
  try {
    const UserId = req.user.id
    const name = req.body.name
    await Todo.create({ name, UserId })
    res.redirect('/')
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const todo = await Todo.findByPk(id)
    res.render('detail', { todo: todo.toJSON() })
  } catch (err) {
    next(err)
  }
})

router.get('/:id/edit', async (req, res, next) => {
  try {
    const UserId = req.user.id
    const id = req.params.id
    const todo = await Todo.findOne({ where: { id, UserId } })
    res.render('edit', { todo: todo.toJSON() })
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const UserId = req.user.id
    const id = req.params.id
    const { name, isDone } = req.body
    const todo = await Todo.findOne({ where: { id, UserId } })
    todo.name = name
    todo.isDone = isDone === 'on'
    await todo.save()
    res.redirect(`/todos/${id}`)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const UserId = req.user.id
    const id = req.params.id
    const todo = await Todo.findOne({ where: { id, UserId} })
    await todo.destroy()
    res.redirect('/')
  } catch (err) {
    next(err)
  }
})

module.exports = router
