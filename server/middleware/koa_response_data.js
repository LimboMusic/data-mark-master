const path = require("path");
const fileUtils = require("../utils/file_utils");

module.exports = async (ctx, next) => {
  const url = ctx.request.url;
  let filePath = url.slice(4);
  filePath = "../data" + filePath + ".json";
  filePath = path.join(__dirname, filePath);

  // console.log("filePath====>  ", filePath);
  try {
    const res = await fileUtils.getFileJsonData(filePath);
    ctx.response.body = res;
  } catch (err) {
    const msg = {
      status: 404,
      message: "文件资源不存在！",
    };
    ctx.response.body = JSON.stringify(msg);
  }

  next();
};
