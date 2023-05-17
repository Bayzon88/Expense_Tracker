const express = require("express");
const app = express();
const PORT = 3000 || 5000;
const bodyParser = require("body-parser");

//use body parser
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

const {
  getMongoData,
  createNewExpense,
  createNewUser,
  getAllUserExpenses,
} = require("./Controllers/mongodb_connection");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/test.html");
});

getMongoData(app);
createNewExpense(app);
createNewUser(app);
getAllUserExpenses(app);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
