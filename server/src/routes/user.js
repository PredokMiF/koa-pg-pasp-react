module.exports = async function user(ctx) {
    ctx.body = { authorized: ctx.isAuthenticated() }
}