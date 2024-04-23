const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: "User" },
  to: { type: Schema.Types.ObjectId, ref: "Conversation" },
  time_stamp: { type: Date, default: Date.now },
  text: { type: String, required: true },
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);
