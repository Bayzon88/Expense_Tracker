const mongoose = require("mongoose");
const { Schema } = mongoose;
const expenseSchema = new Schema({
  expense_id: Number, //Needs to be cast as number when making the request
  category: String,
  store: String,
  card: String,
  payment_type: String,
  amount: { type: Number, validate: (v) => v >= 0 }, //Must be 0 or greater
  date: Date,
  user_id: Number, //Needs to be cast as number when making the request
});

const userSchema = new Schema({
  user_id: {
    type: Number,
    validate: { validator: Number.isInteger, message: "user_id must be an integer" },
    required: true,
  }, //Needs to be cast as number when making the request
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }, //TODO: Modify to use Authentication library
  email: { type: String, required: true },
  type: { type: String, required: true },
});

const groupSchema = new Schema({
  group_id: Number, //Needs to be cast as number when making the request
  user_id: Number, //Needs to be cast as number when making the request
});

module.exports = { expenseSchema: expenseSchema, userSchema: userSchema, groupSchema: groupSchema };
