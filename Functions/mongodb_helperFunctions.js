//************************************ GET USERS FROM DB ************************************/

const { Collection, MongoClient } = require("mongodb");

/** 
Check if username exists in database, returns true or false
@type boolean
*/
async function usernameRegisteredInDatabase(username, client) {
  try {
    await client.connect();
    const coll = client.db("expensetracker").collection("users");
    const user = await coll.find({ username: username }).toArray();
    if (user.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "there is an error" });
  }
}

/**
 *@param {MongoClient} client
 * @param {String} database
 * @param {String} collection
 * @returns {Collection}
 */
async function createConnectionToCollection(client, database, collection) {
  // Connect the client to the server	(optional starting in v4.7)

  await client.db("admin").command({ ping: 1 }); // Send a ping to confirm a successful connection
  const db = client.db(database); //Select database to access
  const coll = db.collection(collection); //Select Collection (table)
  return coll;
}

module.exports = {
  usernameRegisteredInDatabase: usernameRegisteredInDatabase,
  createConnectionToCollection: createConnectionToCollection,
};
