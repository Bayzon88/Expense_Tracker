const mongoose = require("mongoose");
//************************************ GET USERS FROM DB ************************************/

const { Collection, MongoClient } = require("mongodb");
const { userSchema } = require("./mongoose_schema");

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

//************************************ VERIFY IF USER EXISTS ************************************/
/**
 *@param {String} username
 */
async function verifyIfUserExists(username) {
  await mongoose.connect(process.env.MONGO_URI);
  const Users = mongoose.model("users");

  const userExists = await Users.find({ username: username });
  console.log(userExists.length);
  return userExists.length > 0;
}

//************************************ GET TOTAL USER COUNT  ************************************/

async function getTotalUserCount() {
  await mongoose.connect(process.env.MONGO_URI);
  const Users = mongoose.model("users", userSchema);
  return await Users.countDocuments();
}

module.exports = {
  usernameRegisteredInDatabase: usernameRegisteredInDatabase,
  verifyIfUserExists: verifyIfUserExists,
  getTotalUserCount: getTotalUserCount,
};
