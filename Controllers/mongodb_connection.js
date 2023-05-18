const bodyParser = require("body-parser");

//************* Mongoose Imports
const mongoose = require("mongoose");
const { Schema } = mongoose;
const { expenseSchema, userSchema, groupSchema } = require("../Functions/mongoose_schema");

const { MongoClient, ServerApiVersion } = require("mongodb");

//***************** Helper Functions
const {
  usernameRegisteredInDatabase,
  verifyIfUserExists,
  getTotalUserCount,
} = require("../Functions/mongodb_helperFunctions");
const register = require("../Model/register");

//TODO: REMOVE FROM THIS FILE, MAKE IT ENVIRONMENT VARIABLE
const uri =
  "mongodb+srv://bayzon88:alvaro88@expsentrackerapp.kxkzhkr.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//************************************ GET ALL EXPENSES BY USERNAME ************************************/
/**
 * Retrieve all expenses from a espcific username
 * @param {Express} app
 * @returns JSON
 */
async function getAllUserExpenses(app) {
  //TODO: Handle if user is authenticated
  //TODO: Handle username is null
  //TODO: Handle filters (e.g. month, year, category, etc)
  app.get("/api/:username", async (req, res) => {
    const username = req.params.username; //
    try {
      //Create Connection to database and specify Schema
      await mongoose.connect(process.env.MONGO_URI);
      const Expenses = mongoose.model("expenses", expenseSchema);

      //Query all expenses for username and close connection
      const userExpenses = await Expenses.findOne({ username: username });
      mongoose.connection.close();

      res.status(200).send(userExpenses).end(); //finish the connection
    } catch (err) {
      console.log("There is an error");
      console.error(err);
    }
  });
}

/**************************************************************************************************
 *                                              POST REQUESTS                                     *
 *************************************************************************************************/

//************************************ CREATE NEW USER IN DB ************************************/
/**
 * Retrieve all expenses from a espcific username
 * @param {Express} app
 */
function createNewUser(app) {
  app.post("/api/register", async (req, res) => {
    let userCount = await getTotalUserCount();

    let userInfo = { ...req.body, user_id: userCount + 1 };

    //TODO: Add user_id to the body based on count from totalusers

    try {
      //Connect to MongoDB and select collection
      await mongoose.connect(process.env.MONGO_URI);
      const Users = mongoose.model("users", userSchema);
      //Insert document in database
      const newUser = new Users(userInfo); //Create new user Document(datapoint)

      //Validate Schema and save into database
      const validationError = await newUser.validate().catch((err) => err);
      const userExists = await verifyIfUserExists(userInfo.username);
      if (!validationError && userExists == false) {
        await newUser.save(); //Save into database
        res.status(200);
      } else {
        console.log("Schema Validation Failed or user Exists!");
      }
    } catch (err) {
      console.log("There is an error");
      console.error(err);
      res.status(500).end();
    } finally {
      res.end();
    }
  });
}

//************************************ CREATE NEW EXPENSE IN DB ************************************/
function createNewExpense(app) {
  app.post("/api/new", async (req, res) => {
    let bodyData = req.body.username;

    console.log(bodyData);
    res.end();
  });
}

module.exports = {
  createNewExpense: createNewExpense,
  createNewUser: createNewUser,
  getAllUserExpenses: getAllUserExpenses,
};
