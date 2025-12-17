class DBError extends Error {
  constructor (message) {
    super(message)
    this.name = 'DBError'
    this.message = 'A error has occurred'
    this.errors = message
  }
}

module.exports = DBError
