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
// var server = http.createServer(app).listen(80);

let server = http.createServer(app).listen(80);

var bodyParser = require(`body-parser`);
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.get('/test1', function(req, res) {
  res.sendfile("form.html");
});

app.get('/insertForm', function(req, res) {
  res.sendfile("insertForm.html");
});

app.get('/listForm', function(req, res) {
  res.sendfile("listForm.html");
});

app.get('/updateForm', function(req, res) {
  res.sendfile("updateForm.html");
});




// app.post('/priceTest', function(req, res) {
// 주문을 생성하는 로직

//   let itemList = [{
//       name: "item1",
//       price: 1000
//     },
//     {
//       name: "item2",
//       price: 5000
//     },
//     {
//       name: "item3",
//       price: 10000
//     },
//     {
//       name: "item4",
//       price: 30000
//     },
//     {
//       name: "item5",
//       price: 50000
//     },
//     {
//       name: "item6",
//       price: 100000
//     },
//     {
//       name: "item7",
//       price: 500000
//     }
//   ];
//
//
//
//   let inputPrice = Number(req.body.price);
//   let message = "구매불가";
//
//   for (let i = 0; i < itemList.length; i++) {
//     eachItem = itemList[i];
//     if (inputPrice >= eachItem.price) {
//       let itemName = itemList[i].name
//       message = itemName;
//
//     }
//   }
//
//
//
//
//
// });

app.post('/insertItem', function(req, res) {
  console.log("OK");

  let message = "입력성공";
  let inputPrice = Number(req.body.itemPrice);
  let inputName = req.body.itemName;
  let cntName = 0;
  let cntPrice = 0;

  connection.query(`SELECT * FROM item
WHERE 1=1
AND itemName = '${inputName}' OR itemPrice = ${inputPrice}`, function(error, results, fields) {
    if (error) throw error;
    console.log(results);
    res.send(results);

    if (results.length == 0) {
      connection.query(`INSERT INTO item (itemName, itemPrice) VALUES
('${req.body.itemName}','${req.body.itemPrice}')`,
        function(error, results, fields) {
          if (error) throw error;
          console.log(results);
          res.send(results)
        });

      res.send(message)
    } else if (results[0].itemName == inputName && results[0].itemPrice && results.length == 1) {
      message = "동일한 이름,가격을 가진 아이템이 존재합니다"
      res.send(message)
    } else if (results[0].itemName == inputName) {
      message = "동일한 이름을 가진 아이템이 존재합니다."
      res.send(message)
    } else if (results[0].itemPrice == inputPrice) {
      message = "동일한 가격을 가진 아이템이 존재합니다."
      res.send(message)
    }
    if (results.length > 1) {
      message = "동일한 이름,가격이 각각 존재합니다."
      res.send(message)
    }


    res.send(message)
    console.log(message);




  });


});



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
//주문을 삭제하는 로직
app.delete('/delete', function(req, res) {
  let no = req.body.no;
  connection.query(`DELETE FROM item WHERE no = ${no}`, function(error, results, fields) {
    if (error) throw error;
    console.log(results);
    res.send(results);

  });


});


app.get('/showItem', function(req, res) {
  connection.query(`SELECT * FROM item WHERE no=${req.query.no}`, function(error, results, fields) {
    if (error) throw error;
    console.log(results);
    res.send(results);

  });


});


app.put('/update', function(req, res) {
      // 주문을 수정하는 로직
        let number = req.body.no;
        let inputPrice = Number(req.body.itemPrice);
        let inputName = req.body.itemName;
        let message = "수정성공"
      // console.log(number,inputPrice,inputName)
      connection.query(`SELECT * FROM item WHERE (itemName = '${inputName}'
      or itemPrice = ${inputPrice}) and no!=${number}`,
      function(error, results, fields) {

        if (error) {
          console.log(error);
          res.send("error");
        }

        if (results.length >= 2) {
          res.send("동일한 이름, 가격이 각각 존재합니다. (2개)");
        } else if (results.length == 1) {
          if (results[0].itemName == req.body.itemName && results[0].itemPrice == req.body.itemPrice) {
            res.send("동일한 이름, 가격을 가진 아이템이 존재합니다.");
          } else if (results[0].itemName == req.body.itemName) {
            res.send("동일한 이름을 가진 아이템이 존재합니다.")
          } else if (results[0].itemPrice == req.body.itemPrice) {
            res.send("동일한 가격을 가진 아이템이 존재합니다.")
          }
        } else if (results.length == 0) {
          connection.query(`UPDATE item SET itemName = '${req.body.itemName}'
  ,itemPrice = ${req.body.itemPrice}
  WHERE no = ${req.body.no}`,

              function(error, results, fields) {

                if (error) {
                  console.log(error);
                  res.send("error");
                } else if (res.affectedRows == 1) {
                  res.send("fixed!");
                }
              });
          }
        });
      });
