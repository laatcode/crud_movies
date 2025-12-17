const DBError = require('../DBError')
const ValidationError = require('../ValidationError')

module.exports = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    const errors = err.errors.map(e => e.replace(/"/g, "'").trim())
    return res.status(400).json({
      message: err.message,
      errors
    })
  }

  if (err instanceof DBError) {
    return res.status(400).json({
      message: err.message,
      errors: err.errors
    })
  }

  console.error(err)
  res.status(500).json({ message: 'Ha ocurrido un error inesperado, por favor vuelva a intentarlo' })
}
