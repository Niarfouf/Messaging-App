const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  name: { type: String, required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  last_message: { type: Schema.Types.ObjectId, ref: "Message" },
});

// Export model
module.exports = mongoose.model("Conversation", ConversationSchema);
