module.exports  = async (ctx,next) => {
    const startTime = Date.now()
    const res = await next()
    const endTime = Date.now()
    const duration = endTime - startTime
    ctx.set('X-Response-Time', duration + 'ms')
}