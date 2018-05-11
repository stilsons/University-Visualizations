var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var myobj = [
    { id: 100654, men: 652, women: 916},
    { id: 100663, men: 758, women: 1263 },
    { id: 100706, men: 735, women: 478 },
    { id: 100724, men: 434, women: 738 },
    { id: 100751, men: 3255, women: 4304 },
    { id: 100830, men: 226, women: 368 },
    { id: 100858, men: 2147, women: 2382 },
    { id: 100937, men: 166, women: 162 },
    { id: 101073, men: 64, women: 38 },
    { id: 101189, men: 168, women: 144 },
    { id: 101365, men: 26, women: 39 },
    { id: 101435, men: 171, women: 106 },
  ];
  dbo.collection("schools").insertMany(myobj, function(err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
    db.close();
});
});
