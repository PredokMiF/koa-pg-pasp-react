const noCache = require('koa-no-cache')

module.exports = app =>
    app.use(noCache({ paths: ['/custom/api/'] }))
