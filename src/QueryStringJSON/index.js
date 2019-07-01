var merge = require('merge-descriptors')

module.exports = function (app) {
  var qs = require('qs')
  var converter = function (value) {
    try {
      return JSON.parse(value)
    } catch (err) {
      return value
    }
  }

  merge(app.request, {

    /**
     * Get parsed query-string.
     *
     * @return {Object}
     * @api public
     */

    get query () {
      var str = this.querystring
      if (!str) return {}

      var c = this._querycache = this._querycache || {}
      var query = c[str]
      if (!query) {
        c[str] = query = qs.parse(str)
        for (var key in query) {
          query[key] = converter(query[key])
        }
      }
      return query
    },

    /**
     * Set query-string as an object.
     *
     * @param {Object} obj
     * @api public
     */

    set query (obj) {
      this.querystring = qs.stringify(obj)
    }
  })

  return app
}
