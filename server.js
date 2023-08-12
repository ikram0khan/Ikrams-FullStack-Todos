const express = require("express");
const mongoose = require("mongoose");
const router = require("./Routes/todo.js");
const userRouter = require("./Routes/User.js");
const error = require("./middlewares/error.js");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(cookieParser());

//Connecting Mongodb
const uri = process.env.MONGODB_CONNECTION_STRING;

try {
  mongoose.connect(uri, { dbName: "todosApp" }).then((conn) => {
    console.log(`Database Connected To Host ${conn.connection.host}`);
  });
} catch (error) {
  console.log(error);
}
///Using MiddleWares
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/", router);
app.use("/api/v1/user", userRouter);

//Using Error MiddleWare
app.use("/storage", express.static("storage"));
app.use(error);

process.on("uncaughtException", (error) => {
  console.log(`Error:${error}`);
  console.log("Shtting Server Due to Uncaught Excpetion");

  server.close(() => {
    process.exit(1);
  });
});

const server = app.listen(7000, () => {
  console.log("Server Is Running on PORT: 7000");
});

process.on("unhandledRejection", (error) => {
  console.log(`Error : ${error}`);
  console.log("Shutting Server Due to Unhandeled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});
