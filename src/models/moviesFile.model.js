const moviesData = require('../data/movies.json')

class MoviesFile {
  getAllMovies () {
    return moviesData
  }

  getMovieById (id) {
    return moviesData.find(movie => movie.id === id)
  }

  getGenresByMovieId (id) {
    const movie = moviesData.find(movie => movie.id === id)
    return movie ? movie.genre : []
  }

  createMovie (movie) {
    moviesData.push(movie)
  }
}

module.exports = MoviesFile
