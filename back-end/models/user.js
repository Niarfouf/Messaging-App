const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  pseudo: { type: String, required: true, maxLength: 20, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 8 },
  profile_picture: { type: String, default: "img_url" },
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  conversation: [{ type: Schema.Types.ObjectId, ref: "Conversation" }],
  emitted_friends_requests: [{ type: Schema.Types.ObjectId, ref: "User" }],
  received_friends_requests: [{ type: Schema.Types.ObjectId, ref: "User" }],

  online: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
