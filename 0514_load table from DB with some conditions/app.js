let express = require('express');
let http = require('http');
let app = express();
let server = http.createServer(app).listen(80);

var bodyParser = require ('body-parser');
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'test'
});
connection.connect();

// 가격 입력받고 구입가능 물건 출력
app.get('/price', function(req, res) {
  res.sendfile("price2.html");
});

app.post('/priceSender', function(req, res) {

  let prdList = [{name : "item 1", price : 1000},
    {name : "item 2", price : 5000},
    {name : "item 3", price : 10000},
    {name : "item 4", price : 30000},
    {name : "item 5", price : 50000},
    {name : "item 6", price : 100000},
    {name : "item 7", price : 500000}];

  // let pricearr = [];
  // let minPrice = 0;
  // let prdIndex = 0;
  let budget = 0;
  let output = "not enough minerals.";

  budget = req.body.userBudget;

  // 수정 전 코드

//   for (let i = 0; i < prdList.length; i++){
//     pricearr[i] = prdList[i].price
//   }
//
//   minPrice = Math.min.apply(null, pricearr)
//
//   if (budget < minPrice){
//     res.send(`not enough minerals.`)
//   }
//
//   if (budget >= minPrice){
//     for (let i = 0; i < prdList.length; i++){
//       if (budget >= prdList[i].price){
//         prdIndex = i;
//       }
//     }
//   res.send(`${prdList[prdIndex].name}`);
// }
// });

  for (let i = 0; i < prdList.length; i++){
    if (budget >= prdList[i].price){
      output = prdList[i].name
    }
  }
  res.send(`${output}`);
});


  // 테이블에서 상품정보 추출 후 구입가능 물건 출력

app.get('/priceSearch', function(req, res) {
  res.sendfile("search.html");
});

  // 반복문을 이용한 테이블 정보입력

app.get('/priceTable', function(req, res) {

  let prdList = [{name : "item 1", price : 1000},
    {name : "item 2", price : 5000},
    {name : "item 3", price : 10000},
    {name : "item 4", price : 30000},
    {name : "item 5", price : 50000},
    {name : "item 6", price : 100000},
    {name : "item 7", price : 500000}];

    for (let i = 0; i < prdList.length; i++){
      connection.query(`INSERT INTO item
        (itemName, itemPrice) VALUES
        ('${prdList[i].name}', ${prdList[i].price})`),
      function (error, results, fields) {
        if (error) throw error;
        return;
      };
    };
    console.log(`table init complete`);
  });


app.get('/listSender', function(req, res){

    connection.query(`select * from item`,
    function (error, results, fields) {
      if (error) throw error;

      budget = Number(req.query.prdPr);
      let output = "not enough minerals."

      if (budget == "" || isNaN(budget)){
        budget = 0;
      }

      console.log(results);
      for (let i = 0; i < results.length; i++){
        if (budget >= results[i].itemPrice){
          output = results[i].itemName
        }
      }
      res.send(output);
      return;
	});
});
