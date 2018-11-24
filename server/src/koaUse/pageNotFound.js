const logger = require('../logger')

module.exports = async function pageNotFound(ctx) {
    ctx.status = 404

    switch (ctx.accepts('html', 'json')) {
        case 'html':
            ctx.type = 'html'
            ctx.body = '<p>Page Not Found</p>'
            break
        case 'json':
            ctx.body = {
                message: 'Page Not Found'
            }
            break
        default:
            ctx.type = 'text'
            ctx.body = 'Page Not Found'
    }

    logger.error('Страница не найдена', {
        uuid: ctx.uuid,
        header: ctx.request.header,
        method: ctx.request.method,
        url: ctx.request.url,
        originalUrl: ctx.request.originalUrl,
        href: ctx.request.href,
    })
}
