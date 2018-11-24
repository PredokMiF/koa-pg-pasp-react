const logger = require('../logger')

module.exports = app =>
    app.use(async function errHandler(ctx, next) {
        try {
            await next()

            if (ctx.status === 200) {
                const logObj = {
                    uuid: ctx.uuid,
                    status: ctx.status,
                    method: ctx.request.method,
                    url: ctx.request.url,
                    originalUrl: ctx.request.originalUrl,
                    href: ctx.request.href,
                    requestBody: ctx.request.body,
                    header: ctx.request.header,
                }

                logger.info(`Request`, logObj)
            }

        } catch (e) {
            ctx.status = e && e.status || 500

            ctx.body = e.clientErrText || ctx.clientErrText || `Error ${ctx.status}`

            let type = ctx.accepts('html', 'json')
            if (type === 'json') {
                ctx.body = {
                    error: ctx.body
                }
            }

            const errCmnObj = {
                uuid: ctx.uuid,
                status: ctx.status,
                method: ctx.request.method,
                url: ctx.request.url,
                originalUrl: ctx.request.originalUrl,
                href: ctx.request.href,
                requestBody: ctx.request.body,
                header: ctx.request.header,
            }

            if (ctx.status === 401) {
                logger.info(`Пользователь не авторизован`, errCmnObj)
            } else {
                logger.error(`Ошибка выполнения REST метода`, e, errCmnObj)
            }
        }

    })
