const path = require('path')
const utils = require('../utils/file_utils')
const Websocket = require("ws");
const wss = new Websocket.Server({
  port: 9998,
});

const listen = () => {
  // 对客户端的连接事件
  // client 代表的是连接客户端
  wss.on("connection", (client) => {
    console.log("客户端连接成功...");
    // 对客户端连接对象的信息监听
    // msg 为客户端发送过来的信息
    client.on("message", async (msg) => {
      console.log("客户端发送的信息: " + msg);
      const payload = JSON.parse(msg)
      // action 字段为 getData 值时表示客户端端需要获取数据
      if(payload.action === 'getData'){
        let filePath = '../data/' + payload.chartName + '.json'
        filePath = path.join(__dirname,filePath)
        const res = await utils.getFileJsonData(filePath)
        payload.data = res
        // 在原来消息基础上拼接 data 字段发送回客户端
        client.send(JSON.stringify(payload))
      } else {
        // 向其他客户端转达消息
        wss.clients.forEach(client => {
          client.send(JSON.stringify(payload))
        })
      }
    });
  });
};

module.exports = {
  listen,
};
