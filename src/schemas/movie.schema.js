const joi = require('joi')

const id = joi.string().uuid()
const title = joi.string().min(1).max(120)
const year = joi.number().integer().min(1888).max(new Date().getFullYear())
const director = joi.string().min(2).max(80)
const duration = joi.number().integer().min(1)
const poster = joi.string().uri()
const genreId = joi.number().integer().min(1)
const genreName = joi.string().min(3).max(30)
const genreOption = joi.object({
  id: genreId.required(),
  name: genreName
})
const rate = joi.number().min(0).max(10)
const genre = joi.array().items(genreOption).min(1)

const getMovie = joi.object({
  id: id.required()
})

const createMovieSchema = joi.object({
  title: title.required(),
  year: year.required(),
  director: director.required(),
  duration: duration.required(),
  poster,
  genre: genre.required(),
  rate
})

const updateMovieSchema = joi.object({
  title,
  year,
  director,
  duration,
  poster,
  genre,
  rate
})

module.exports = {
  getMovie,
  createMovieSchema,
  updateMovieSchema
}
