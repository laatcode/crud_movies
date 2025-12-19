const crypto = require('crypto')

class MovieController {
  constructor ({ movieModel }) {
    this.model = movieModel
    this.getAllMovies = this.getAllMovies.bind(this)
    this.getMovieById = this.getMovieById.bind(this)
    this.createMovie = this.createMovie.bind(this)
    this.updateMovie = this.updateMovie.bind(this)
    this.deleteMovie = this.deleteMovie.bind(this)
  }

  async getAllMovies (req, res) {
    res.json(await this.model.getAllMovies())
  }

  async getMovieById (req, res) {
    const movie = await this.model.getMovieById(req.params.id)
    if (movie) {
      res.json(movie)
    } else {
      res.status(404).json({ message: 'Movie not found' })
    }
  }

  async createMovie (req, res) {
    const newMovie = {
      id: crypto.randomUUID(),
      title: req.body.title,
      year: req.body.year,
      director: req.body.director,
      duration: req.body.duration,
      poster: req.body.poster,
      genre: req.body.genre,
      rate: req.body.rate
    }
    await this.model.createMovie(newMovie)
    res.status(201).json(await this.model.getMovieById(newMovie.id))
  }

  async updateMovie (req, res) {
    const updatedMovie = {
      title: req.body.title,
      year: req.body.year,
      director: req.body.director,
      duration: req.body.duration,
      poster: req.body.poster,
      genre: req.body.genre,
      rate: req.body.rate
    }
    await this.model.updateMovie(req.params.id, updatedMovie)
    res.json(await this.model.getMovieById(req.params.id))
  }

  async deleteMovie (req, res) {
    await this.model.deleteMovie(req.params.id)
    res.status(204).send()
  }
}

module.exports = MovieController
