// pm2 start OR long command pm2 start ecosystem.config.js
// For production add --env production
// DB debug env DEBUG="pg-async"

module.exports = {
    apps: [{
        "name": "server",
        "script": "./server/index.js",
        "node_args" : "--harmony",

        "env": {
            "NODE_ENV": "development"
        },
        "env_production": {
            "NODE_ENV": "production"
        }
    }]
}
