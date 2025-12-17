const moviesData = require('../data/movies.json')

class MoviesFile {
  getAllMovies () {
    return moviesData
  }

  getMovieById (id) {
    return moviesData.find(movie => movie.id === id)
  }

  createMovie (movie) {
    moviesData.push(movie)
  }
}

module.exports = MoviesFile
