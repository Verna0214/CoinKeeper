const dayjs = require('dayjs')

module.exports = {
  currentYear: () => dayjs().year(),
  dateFormat: date => dayjs(date).format('YYYY-MM-DD'),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
