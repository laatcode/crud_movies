const DBError = require('../DBError')
const mysql = require('mysql2/promise')

class MoviesMySQL {
  constructor () {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    })
  }

  async getAllMovies () {
    const [result] = await this.pool.query('SELECT BIN_TO_UUID(id) AS id, title, year, director, duration, poster FROM movies')
    return result
  }

  async getMovieById (id) {
    const [result] = await this.pool.query('SELECT BIN_TO_UUID(id) AS id, title, year, director, duration, poster, rate FROM movies WHERE id = UUID_TO_BIN(?)', [id])
    return result[0]
  }

  async getGenresByMovieId (id) {
    const [result] = await this.pool.query(
      `SELECT genres.id, genres.name FROM movies_genres
      JOIN genres ON genres.id = movies_genres.genre_id
      WHERE movies_genres.movie_id = UUID_TO_BIN(?);`, [id]
    )
    return result
  }

  async addGenreToMovie (movieId, genreId, connection) {
    try {
      if (connection) {
        await connection.query(
          'INSERT INTO movies_genres (movie_id, genre_id) VALUES (UUID_TO_BIN(?), ?)',
          [movieId, genreId]
        )
      } else {
        await this.pool.query(
          'INSERT INTO movies_genres (movie_id, genre_id) VALUES (UUID_TO_BIN(?), ?)',
          [movieId, genreId]
        )
      }
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new DBError(`Genre with id ${genreId} or movie with id ${movieId} does not exist`)
      }
      if (error.code === 'ER_DUP_ENTRY') {
        throw new DBError(`Genre with id ${genreId} is already associated with movie ${movieId}`)
      }
      throw error
    }
  }

  async createMovie (movie) {
    const connection = await this.pool.getConnection()
    connection.beginTransaction()

    try {
      const { id, title, year, director, duration, poster, genre, rate } = movie

      await connection.query(
        'INSERT INTO movies (id, title, year, director, duration, poster, rate) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)',
        [id, title, year, director, duration, poster, rate]
      )

      await Promise.all(genre.map(async (genre) => {
        await this.addGenreToMovie(id, genre.id, connection)
      }))

      connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  async updateMovie (id, movie) {
    const connection = await this.pool.getConnection()
    connection.beginTransaction()

    const { title, year, director, duration, poster, genre, rate } = movie
    const foundMovie = await this.getMovieById(id)
    if (!foundMovie) {
      throw new DBError(`Movie with id ${id} does not exist`)
    }

    foundMovie.title = title || foundMovie.title
    foundMovie.year = year || foundMovie.year
    foundMovie.director = director || foundMovie.director
    foundMovie.duration = duration || foundMovie.duration
    foundMovie.poster = poster || foundMovie.poster
    foundMovie.rate = rate || foundMovie.rate

    try {
      await this.pool.query(
        'UPDATE movies SET title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ? WHERE id = UUID_TO_BIN(?)',
        [foundMovie.title, foundMovie.year, foundMovie.director, foundMovie.duration, foundMovie.poster, foundMovie.rate, id]
      )

      if (genre) {
        await this.deleteGenresByMovie(id)
        await Promise.all(genre.map(async (genre) => {
          await this.addGenreToMovie(id, genre.id, connection)
        }))
      }
      connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    }
  }

  async deleteGenresByMovie (id, connection) {
    if (connection) {
      await connection.query('DELETE FROM movies_genres WHERE movie_id = UUID_TO_BIN(?)', [id])
    } else {
      await this.pool.query('DELETE FROM movies_genres WHERE movie_id = UUID_TO_BIN(?)', [id])
    }
  }

  async deleteMovie (id) {
    const connection = await this.pool.getConnection()
    connection.beginTransaction()
    try {
      await this.deleteGenresByMovie(id, connection)
      const [result] = await connection.query('DELETE FROM movies WHERE id = UUID_TO_BIN(?)', [id])
      if (result.affectedRows === 0) {
        throw new DBError(`Movie with id ${id} does not exist`)
      }
      connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    }
  }
}

module.exports = MoviesMySQL
