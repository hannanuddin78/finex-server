const express = require("express");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(express.static("public"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
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
  const buyCollectionBootStrap = client.db("FinexGateway").collection("buyFinexDataWithBootStrap");
  const buyCollectionMaterial = client.db("FinexGateway").collection("buyFinexDataWithMaterial");

  console.log("database connect");

  app.post("/buyCoinDataWithBootStrap", (req, res) => {
    const event = req.body;
    console.log(event);
    buyCollectionBootStrap.insertOne(event).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/buyCoinDataWithMaterial", (req, res) => {
    const event = req.body;
    console.log(event);
    buyCollectionMaterial.insertOne(event).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World...db connect");
});

app.listen(process.env.PORT || port);