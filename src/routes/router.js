const ordersRouter = require("./orders/ordersRouter");
const productRouter = require("./products/productRouter");
const usersRouter = require("./users/usersRouter");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
let upload = multer({ dest: "/tmp/" });

const includeRouters = (app, express) => {
  app.use("/orders", ordersRouter(express));
  app.use("/products", productRouter(express));
  app.use("/users", usersRouter(express));

  app.post("/images", upload.any(), (request, response) => {
    let readableStream = fs.createReadStream(request.files[0].path);
    if (!fs.existsSync("./src/db/images")) fs.mkdirSync("./src/db/images");
    let writeabeleStream = fs.createWriteStream(
      `./src/db/images/${request.files[0].originalname}`
    );
    readableStream.on("data", chunk => {
      writeabeleStream.write(chunk);
    }); 
    readableStream.on("end", () => {
      response.send(path.resolve(__dirname + '../../../' + `./src/db/images/${request.files[0].originalname}`));
    });
  });
  app.use("/", function(request, response) {
    response.sendFile(path.resolve(__dirname + "../../../index.html"));
  });
};

module.exports = includeRouters;
