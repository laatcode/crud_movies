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
    const movies = await this.model.getAllMovies()
    await Promise.all(movies.map(async (movie) => {
      movie.genres = await this.model.getGenresByMovieId(movie.id)
    }))
    res.json(movies)
  }

  async getMovieById (req, res) {
    const movie = await this.model.getMovieById(req.params.id)
    if (movie) {
      movie.genres = await this.model.getGenresByMovieId(movie.id)
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
    const movie = await this.model.getMovieById(newMovie.id)
    movie.genres = await this.model.getGenresByMovieId(movie.id)
    res.status(201).json(movie)
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
    const movie = await this.model.getMovieById(req.params.id)
    movie.genres = await this.model.getGenresByMovieId(movie.id)
    res.json(movie)
  }

  async deleteMovie (req, res) {
    await this.model.deleteMovie(req.params.id)
    res.status(204).send()
  }
}

module.exports = MovieController
