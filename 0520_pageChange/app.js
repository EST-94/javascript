var express = require('express');
var http = require('http');
var app = express();

var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'test'
});

connection.connect();

let server = http.createServer(app).listen(80);

var bodyParser = require(`body-parser`);
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.get('/main0528', function(req, res) {
  res.sendfile("form.html");
});

app.get('/insertForm', function(req, res) {
  res.sendfile("insertForm.html");
});

//////////////////////////////////////////////////

app.post('/insertItem', function(req, res) {
  console.log("OK");

  let message = "";
  let inputPrice = Number(req.body.itemPrice);
  let inputName = req.body.itemName;

  connection.query(`SELECT * FROM item WHERE 1=1 AND
                  itemName = '${inputName}' OR itemPrice = ${inputPrice}`,
                  function(error, results, fields) {
                  if (error) throw error;

    if(results.length == 0) {

      message = "상품 목록을 추가합니다."
      connection.query(`INSERT INTO item (itemName, itemPrice)
                        VALUES ('${inputName}','${inputPrice}')`,
                        function(error, results, fields) {
                        if (error) throw error;
        });
    }

    else if (results.length == 1){

      if(results[0].itemName == inputName && results[0].itemPrice == inputPrice) {
        message = "1개의 동일한 이름, 가격의 상품이 존재합니다."
      }
      if(results[0].itemName == inputName) {
        message = "동일한 이름을 가진 아이템이 존재합니다."
      }
      if(results[0].itemPrice == inputPrice) {
        message = "동일한 가격을 가진 아이템이 존재합니다."
      }
    }

    else if (results.length <= 2){

      message = "2개 이상의 동일한 이름, 가격의 상픔이 각각 존재합니다."
    }

    console.log(results);
    res.send(message);

    // 이와 같이 별개의 괄호에 넣을 시 병렬로 실행되어, 실행속도가 달라 의도대로 실행되지 않는다.
    // res.send는 무조건 요청 1개당 1개의 응답만 보낼 수 있다.

    //   connection.query(`INSERT INTO item (itemName, itemPrice)
    // VALUES
    // ('${inputName}','${inputPrice}')`,
    //     function(error, results, fields) {
    //       if (error) throw error;
    //       console.log(results);
    //       res.send(results)
    //     });
  });
});

//////////////////////////////////////////////////////

app.get('/priceTest', function(req, res) {

  connection.query(`SELECT *
FROM item ORDER BY itemPrice`, function(error, results, fields) {
    if (error) throw error;
    console.log(results);
    let message = "구매불가";
    let inputPrice = Number(req.query.price);

    console.log(inputPrice)

    for (let i = 0; i < results.length; i++) {
      let eachItem = results[i];
      if (inputPrice >= eachItem.itemPrice) {
        let itemName = results[i].itemName
        message = itemName;

      }
    }
    res.send(message)
    console.log(message);
  });
});

app.get('/listItem', function(req, res) {
  connection.query(`SELECT *
  FROM item ORDER BY itemPrice`, function(error, results, fields) {
    if (error) throw error;
    console.log(results);
res.send(results);

  });
});

app.delete('/deleteItem', function(req, res) {
  connection.query(`DELETE FROM item WHERE no = ${req.body.itemNo}`, function(error, results, fields) {
    if (error) throw error;
    console.log(results);
res.send(results);

  });
});
