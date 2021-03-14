var express = require("express");
var cors = require("cors");
var todoController = require("./controller/todoController.js")

var app = express();
app.set("view engine","ejs")

app.use(cors())
//fire controllers
todoController(app)

app.listen(9000);
console.log("Server started at port: 9000")