module.exports = async (ctx,next) => {
    const type = 'application/json; charset=utf-8'
    ctx.set('Content-Type',type)
    ctx.set('Access-Control-Allow-Origin',"*")
    ctx.set('Access-Control-Allow-Methods',"OPTIONS,GET,PUT,POST,DELETE")
    const res = await next()
}