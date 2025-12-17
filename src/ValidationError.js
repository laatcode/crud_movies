class ValidationError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ValidationError'
    this.message = 'A validation error has occurred'
    this.errors = message.split('.')
  }
}

module.exports = ValidationError
