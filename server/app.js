const koa = require('koa')
const app = new koa()


const resDurationMiddleware = require('./middleware/koa_response_duration')
app.use(resDurationMiddleware)

const resHeaderMiddleware = require('./middleware/koa_response_header')
app.use(resHeaderMiddleware)

const resDataMiddleware = require('./middleware/koa_response_data')
app.use(resDataMiddleware)

app.listen(8888)

const WebsocketService = require('./services/websocket_service')
WebsocketService.listen()