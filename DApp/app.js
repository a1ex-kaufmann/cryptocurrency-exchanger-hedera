const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const Excalibur_ = require("./lib/JavaScript/Excalibur");

// перестраиваем и достраиваем БД в соответствии с SC
function rebuildDataBase(dataBase) {
    let lastIndex = dataBase.length;

    // признаки ордеров
    // 0 - не создан, остановить поиск
    // 1 - ордер создан и актуален
    // 2 - ордер исполнен

    // ходим по ордерам (и выгружаем) до статуса 0
    let methodName = "getData";
    let arguments = `${lastIndex},0`;
    let amount = "0";
    let orderNum = excalibur.callContract(userAccount, userPrivateKey, contractID, gasValue, pathToAbi, methodName, amount, arguments);
    console.log(`orderNum=${orderNum}`);
    while (orderNum !== '0') {
        let obj = [];
        for (let i = 0; i < 5; i++) {
            const methodName = "getData";
            const arguments = `${lastIndex},${i}`;
            const amount = "0";
            obj.push(excalibur.callContract(userAccount, userPrivateKey, contractID, gasValue, pathToAbi, methodName, amount, arguments));
            console.log(obj);
        }
        lastIndex++;
        let methodName = "getData";
        let arguments = `${lastIndex},0`;
        amount = "0";
        orderNum = excalibur.callContract(userAccount, userPrivateKey, contractID, gasValue, pathToAbi, methodName, amount, arguments);
        console.log(`orderNum=${orderNum}`);
        dataBase.push(obj);
    }
    return dataBase
}

// отбираем открытые ордера
function filterDataBase(dataBase) {
    let filteredBase = [];
    for (let i = 0; i < dataBase.length; i++) {
        if(dataBase[i][0] === '1') {
            filteredBase.push(dataBase[i])
        }
    }
    return filteredBase;
}


function makeOrder(orderDara) {
    let methodName = "order";
    let arguments = `${orderDara['typeBuyToken']},${orderDara['amountBuyToken']},${orderDara['typeSellToken']},${orderDara['amountSellToken']}`;
    let amount = "0";
    console.log(arguments);
    try {
        excalibur.callContract(userAccount, userPrivateKey, contractID, gasValue, pathToAbi, methodName, amount, arguments);
    } catch (e) {
    }
}


function getUserBalance(userAccount) {
    let methodName = "order";
    let amount = "0";
    excalibur.createContract(userAccount, userPrivateKey, contractID, gasValue, pathToAbi, methodName, amount, arguments)
}


// настройки ноды HH
const nodeAddress = "t2.hedera.com:50003";
const nodeAccount = "0.0.4";
const excalibur = new Excalibur_(nodeAddress, nodeAccount);

// контракт и его ABI, к котому обращаемся
const contractID = "0:0:1281";
const pathToAbi = "smartContracts/excalibur.abi";
const gasValue = "1000000";

// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({extended: false});

// объявляем БД
const pathToDataBase = "dataBase.txt";
let dataBaseObject = [];

// подключаем БД
fs.readFile(pathToDataBase, "utf8", function (err, data) {
    if(err) {
        const blankObject = '[]';
        fs.writeFileSync(pathToDataBase,blankObject);
        dataBaseObject = JSON.parse(blankObject);
    } else {
        dataBaseObject = JSON.parse(data);
        console.log(dataBaseObject)
    }});

const app = express();

// выдаём статику
app.use(express.static('public'));

//TODO make getBalance function
app.get("/getBalance", function(request, response){
    const token = request.body;

    const myBalance =
    console.log(dataBaseObject);
    response.send()
});

//TODO make buyOrder method
app.post("/buyOrder", urlencodedParser, function (request, response) {
    console.log(request.body);
    const order = request.body;
    response.send('ok');
});

// создаёт ордер на обменнике
app.post("/makeOrder", urlencodedParser, function (request, response) {
    console.log(request.body);
    const inputOrderData = request.body;
    // обращение к HH
    makeOrder(inputOrderData);
    response.send('ok');
});

// выдать список актуальных ордеров
app.get("/getOrders", function(request, response){
    // перестраимваем и достраиваем БД в соответствии с хранилищем смарт-контракта
    dataBaseObject = rebuildDataBase(dataBaseObject);
    fs.writeFileSync(pathToDataBase,JSON.stringify(dataBaseObject));
    // отбираем открытые ордера
    let respondedData = filterDataBase(dataBaseObject);
    response.send(respondedData);
});

// TODO исправить порт
app.listen(3300);