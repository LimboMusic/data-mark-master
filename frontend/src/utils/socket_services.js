export default class SocketService {
  isconnected = false;
  ws = null;
  // 存储回调函数的map
  callbackMap = {};

  // 单例设计模式
  static instance = null;
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService();
    }
    return this.instance;
  }

  connectTryCount = 0;
  connect() {
    // 连接服务器
    if (!window.WebSocket) {
      throw error("当前浏览器不支持websocket!");
    }
    this.ws = new WebSocket("ws://localhost:9998");
    // 连接成功事件
    this.ws.onopen = () => {
      this.connectTryCount = 0;
      console.log("连接成功！");
      this.isconnected = true;
    };
    this.ws.onclose = () => {
      console.log("连接失败！");
      this.isconnected = false;
      // 服务器断开后尝试重连
      this.connectTryCount++;
      setTimeout(() => {
        this.connect();
      }, this.connectTryCount * 500);
    };
    // 得到服务端发送过来的数据
    this.ws.onmessage = async (msg) => {
      const data = JSON.parse(msg.data);
      console.log("服务端发送过来的数据： " + data);
      const { socketType, action } = data;
      if (this.callbackMap[socketType]) {
        if (action === "getData") {
          const realData = JSON.parse(data.data);
          //   this.callbackMap[socketType].call(this, realData);
          await this.callbackMap[socketType](realData);
        } else if (action === "fullscreen") {
          await this.callbackMap[socketType](data);
        } else if (action === "themeChange") {
          await this.callbackMap[socketType](data);
        }
      }
    };
  }

  // 注册回调函数
  registerCallBack(socketType, callback) {
    this.callbackMap[socketType] = callback;
  }

  // 销毁回调函数
  unregisterCallBack(socketType) {
    this.callbackMap[socketType] = null;
  }

  sendretryCount = 0;
  // 发送数据
  send(data) {
    if (this.isconnected) {
      this.sendretryCount = 0;
      this.ws.send(JSON.stringify(data));
    } else {
      this.sendretryCount + 1;
      setTimeout(() => {
        this.send(data);
      }, this.sendretryCount * 500);
    }
  }
}
