const path = require('path');
const favicon = require('koa-favicon');

module.exports = app =>
    app.use(
        favicon(path.join(__dirname, '../../public/favicon.ico'))
    )
