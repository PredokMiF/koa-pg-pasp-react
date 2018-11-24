const fse = require('fs-extra')
const koaBody = require('koa-body')
const path = require('path');

const logger = require('../logger')


const UPLOAD_DIR = path.resolve(__dirname, '..', '..', 'upload')

fse.ensureDir(UPLOAD_DIR).catch(e => logger.error('Failed to create upload dir'))


module.exports = app =>
    app.use(
        koaBody({
            multipart: true,
            formidable: {
                multiples: false,
                uploadDir: UPLOAD_DIR
            }
        })
    )
