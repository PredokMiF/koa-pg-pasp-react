const _ = require('lodash')
const path = require('path')
const winston = require('winston')

const cleanStack = require('./clean-stack')


function getLogger ({ logLevel, logDir, maxsize, useConsole }) {
    const transports = []

    if (logLevel.includes('debug')) {
        transports.push(new (winston.transports.File)({
            level: 'debug',
            name: 'debug',
            filename: path.join(logDir, '1-debug.log'),
            maxsize,
            maxFiles: 10,
        }))
    }

    if (logLevel.includes('info')) {
        transports.push(new (winston.transports.File)({
            level: 'info',
            name: 'info',
            filename: path.join(logDir, '2-info.log'),
            maxsize,
        }))
    }

    if (logLevel.includes('warn')) {
        transports.push(new (winston.transports.File)({
            level: 'warn',
            name: 'warn',
            filename: path.join(logDir, '3-warn.log'),
            maxsize,
        }))
    }

    if (logLevel.includes('error')) {
        transports.push(new (winston.transports.File)({
            level: 'error',
            name: 'error',
            filename: path.join(logDir, '4-error.log'),
            maxsize,
        }))
    }

    if (useConsole) {
        transports.push(new (winston.transports.Console)({
            level: (logLevel.includes('debug') ? 'debug' : (logLevel.includes('info') ? 'info' : (logLevel.includes('warn') ? 'warn' : 'error'))),
            json: true,
            stringify: true,
            prettyPrint: true,
            humanReadableUnhandledException: true,
            showLevel: true
        }))
    }

    return winston.createLogger({transports: transports})
}

function convertMsg (msg) {
    if (_.isString(msg)) {
        return msg
    } else if (msg instanceof Error) {
        return msg.toString() + '\n' + cleanStack(msg.stack, { pretty: true })
    } else if (_.isPlainObject(msg)) {
        return JSON.stringify(msg)
    } else {
        return msg
    }
}

function convertCmn(cmn) {
    if (_.isString(cmn)) {
        return { text: cmn }
    } else if (cmn instanceof Error) {
        return { err: cmn.toString(), stack: cleanStack(cmn.stack, { pretty: true }) }
    } else if (_.isPlainObject(cmn)) {
        return cmn
    } else {
        return cmn
    }
}

function getLoggerWrapper(logger) {
    return {
        debug: function (msg, ...cmns) {
            logger.log('debug', convertMsg(msg), { date: new Date().toString() }, ...(cmns.map(convertCmn)))
        },

        info: function (msg, ...cmns) {
            logger.log('info', convertMsg(msg), { date: new Date().toString() }, ...cmns.map(convertCmn))
        },

        warn: function (msg, ...cmns) {
            logger.log('warn', convertMsg(msg), { date: new Date().toString() }, ...cmns.map(convertCmn))
        },

        error: function (msg,...cmns) {
            logger.log('error', convertMsg(msg), { date: new Date().toString() }, ...cmns.map(convertCmn))
        }
    }
}

module.exports = {
    getLogger,
    getLoggerWrapper,
}
