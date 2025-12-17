const express = require('express')
const MovieController = require('../controllers/movies.controller')
const validatorHandler = require('../middlewares/validationHandler.middleware')
const { createMovieSchema, getMovie, updateMovieSchema } = require('../schemas/movie.schema')

const createMovieRouter = ({ movieModel }) => {
  const router = express.Router()
  const controller = new MovieController({ movieModel })
  router.get('/', controller.getAllMovies)
  router.get('/:id', validatorHandler(getMovie, 'params'), controller.getMovieById)
  router.post('/', validatorHandler(createMovieSchema, 'body'), controller.createMovie)
  router.patch('/:id', validatorHandler(getMovie, 'params'), validatorHandler(updateMovieSchema, 'body'), controller.updateMovie)
  router.delete('/:id', validatorHandler(getMovie, 'params'), controller.deleteMovie)
  return router
}

module.exports = createMovieRouter
