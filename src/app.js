const express = require('express')
const app = express()
const port = process.env.PORT
const createMovieRouter = require('./routes/movies.route')
const errorHandler = require('./middlewares/errorHandler.middleware')
const routeNotFoundMiddleware = require('./middlewares/routeNotFound.middleware')

const createApp = ({ movieModel }) => {
  app.use(express.json())

  app.use('/movies', createMovieRouter({ movieModel }))
  app.use(errorHandler)
  app.use(routeNotFoundMiddleware)

  app.listen(port, () => {
    console.log(`Server running at port ${port}`)
  })
}

module.exports = createApp
