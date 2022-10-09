module.exports = {
  errorHandler: (err, req, res, next) => {
    console.log(err.message)
    res.locals.layout = 'space.hbs'
    res.status(500).render('error500', { error: `Something went wrong. We're looking to see what happened.` })
  }
}