const ValidationError = require('../ValidationError')

const validatorHandler = (schema, property) => (req, res, next) => {
  const data = req[property]
  const { error } = schema.validate(data, { abortEarly: false, convert: false })

  if (error) {
    return next(new ValidationError(error.message))
  }

  next()
}

module.exports = validatorHandler
