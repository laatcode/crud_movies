const createApp = require('./app')
const MovieModel = require('./models/moviesFile.model')

createApp({ movieModel: new MovieModel() })
