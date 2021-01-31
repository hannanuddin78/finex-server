const express = require("express");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ugsfy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  // create mongoDB collection when use another design system BootStrap
  const buyCollectionBootStrap = client.db("FinexGateway").collection("buyFinexDataWithBootStrap");
  const sellCollectionBootStrap = client.db("FinexGateway").collection("sellFinexDataWithBootStrap");

  // optaional test create mongoDB collection when use another design system MATERIAL-UI UI but i not finish sell page
  const buyCollectionMaterial = client.db("FinexGateway").collection("buyFinexDataWithMaterial");
  const sellCollectionMaterial = client.db("FinexGateway").collection("sellFinexDataWithMaterial");

  console.log("database connect");

  app.post("/buyCoinDataWithBootStrap", (req, res) => {
    const buyData = req.body;
    buyCollectionBootStrap.insertOne(buyData).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/sellCoinDataWithBootStrap", (req, res) => {
    sellCollectionBootStrap.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  // optaional test create api when post buy and sell data when use another design system MATERIAL-UI but i not finish sell page

  app.post("/buyCoinDataWithMaterial", (req, res) => {
    const buyData = req.body;
    buyCollectionMaterial.insertOne(buyData).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/sellCoinDataWithMaterial", (req, res) => {
    sellCollectionMaterial.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World...server connect successfully");
});

app.listen(process.env.PORT || port);