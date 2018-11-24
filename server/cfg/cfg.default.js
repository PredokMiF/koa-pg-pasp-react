const path = require('path')

const KB = 1024
const MB = 1024 * KB


const CONFIG = {

    logger: {
        logLevel: process.env.NODE_ENV === 'production' ? ['info', 'warn', 'error'] : ['debug', 'info', 'warn', 'error'],
        logDir: path.resolve(__dirname, '..', 'logs'),
        maxsize: MB,
        useConsole: process.env.NODE_ENV !== 'production',
    },

    pg: {
        host: '127.0.0.1',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        database: 'mydb',
    },

    mongoConnStr: 'mongodb://127.0.0.1:27017/mydb',

    http: {
        port: 8080,
        koaAppKeys: [],
    },

};

module.exports = CONFIG;
