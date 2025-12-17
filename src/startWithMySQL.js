const createApp = require('./app')
const MovieModel = require('./models/MoviesMySQL.model')

createApp({ movieModel: new MovieModel() })
