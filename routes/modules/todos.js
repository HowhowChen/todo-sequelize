const router = require('express').Router()
const db = require('../../models')
const Todo = db.Todo

router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', async (req, res) => {
  try {
    const UserId = req.user.id
    const name = req.body.name
    await Todo.create({ name, UserId })
    res.redirect('/')
  } catch (e) {
    console.log(e)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const todo = await Todo.findByPk(id)
    res.render('detail', { todo: todo.toJSON() })
  } catch (e) {
    console.log(e)
  }
})

router.get('/:id/edit', async (req, res) => {
  try {
    const UserId = req.user.id
    const id = req.params.id
    const todo = await Todo.findOne({ where: { id, UserId } })
    res.render('edit', { todo: todo.toJSON() })
  } catch (e) {
    console.log(e)
  }
})

router.put('/:id', async (req, res) => {
  try {
    const UserId = req.user.id
    const id = req.params.id
    const { name, isDone } = req.body
    const todo = await Todo.findOne({ where: { id, UserId } })
    todo.name = name
    todo.isDone = isDone === 'on'
    await todo.save()
    res.redirect(`/todos/${id}`)
  } catch (e) {
    console.log(e)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const UserId = req.user.id
    const id = req.params.id
    const todo = await Todo.findOne({ where: { id, UserId} })
    await todo.destroy()
    res.redirect('/')
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
