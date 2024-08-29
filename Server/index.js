require("dotenv").config();
const express = require("express");
const { connectToMongoDB } = require("./database");
const path = require('path');

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, "build")));
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "build/index.html"));
})

const router = require('./routes');
app.use("/api", router);
app.use(express.static('public'))



app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const bodyParser = require("body-parser"); router.use(bodyParser.json());
const port = process.env.PORT || 5000; 

async function startServer()
{
	await connectToMongoDB();
	app.listen(port, () => 
	{
		 console.log(`Server is listening on http://localhost:${port}`);
	});
}
startServer();
