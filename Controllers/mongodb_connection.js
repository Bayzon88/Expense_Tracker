const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
const {
  usernameRegisteredInDatabase,
  createConnectionToCollection,
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

function getMongoData(app) {
  app.get("/getmongo", async (req, res) => {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });

      const db = client.db("expensetracker"); //Select database to access
      const coll = db.collection("expenses"); //Select Collection (table)

      //Query data from database
      const query = { category: { $ne: "" } };
      const data = await coll.find(query);
      console.log(data);
      res.status(200);
      res.end(); //closes the initial request
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "there is an error" });
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
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

//************************************ CREATE NEW USER IN DB ************************************/
function createNewUser(app) {
  app.post("/api/register", async (req, res) => {
    //Returns an JSON object containng the user information
    let registerObject = register.registerModel(req); //{username: "", password: "", email: ""}

    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      await client.db("admin").command({ ping: 1 }); // Send a ping to confirm a successful connection
      const db = client.db("expensetracker"); //Select database to access
      const coll = db.collection("users"); //Select Collection (table)

      //Add new user if it doesnt exists in database
      /**
       * @param username JSON, MongoClient
       */
      if (await !usernameRegisteredInDatabase(registerObject.username, client)) {
        const data = await coll.insertOne(query);
        if (data.acknowledged) {
          console.log("Success!!");
          res.status(200);
          await client.close();
        } else {
          console.log("Could Not add to database");
        }
      } else {
        console.log("User already exists!");
        await client.close();
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "there is an error" });
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }

    res.end();
  });
}

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
    try {
      //creates the connection to the database and returns a collection object
      await client.connect();
      const coll = await createConnectionToCollection(client, "expensetracker", "expenses");

      //Query to MongoDB
      const query = req.params;
      const options = { sort: { category: 1 } };
      const data = coll.find(query, options);
      const expenses = await data.toArray();
      await client.close(); //close mongoDB client

      res.status(200).send(expenses).end(); //send data an close API request
    } catch (err) {
      console.log("getAllUserExpenses Error");
      console.log(err);
    }
  });
}

module.exports = {
  getMongoData: getMongoData,
  createNewExpense: createNewExpense,
  createNewUser: createNewUser,
  getAllUserExpenses: getAllUserExpenses,
};
