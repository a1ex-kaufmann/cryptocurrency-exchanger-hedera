const express = require("express");
const bodyParser = require("body-parser");
const Excalibur_ = require("./lib/JavaScript/Excalibur");

// вызываем express
const app = express();

// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({extended: false});

// app.get("/", urlencodedParser, function (request, response) {
//     response.sendFile(__dirname + "/");
// });

app.use(express.static('public'));

app.post("/register", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    response.send(`${request.body.userName} - ${request.body.userAge}`);
});

app.get("/getOrders", function(request, response){
    response.send("Главная страница");
});

app.listen(8000);