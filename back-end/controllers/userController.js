const asyncHandler = require("express-async-handler");
const {
  checkExact,
  query,
  param,
  body,
  validationResult,
} = require("express-validator");
const User = require("../models/user");
const Message = require("../models/message");
const Conversation = require("../models/conversation");
const imgArray = [];
//send user info back and set online to true
exports.get_user_info = asyncHandler(async (req, res, next) => {
  const userInfo = await User.findByIdAndUpdate(
    req.user,
    { online: true },
    "pseudo email profile_picture, friends, conversation, friends_requests"
  )
    .populate([
      { path: "friends", select: "_id pseudo profile_picture" },
      {
        path: "conversation",
        populate: [
          { path: "participants", select: "pseudo" },
          {
            path: "last_message",
            populate: "from",
            select: "pseudo",
          },
        ],
      },
      { path: "emitted_friends_requests", select: "pseudo profile_picture" },
      { path: "received_friends_requests", select: "pseudo profile_picture" },
    ])
    .exec();

  res.json(userInfo);
});

exports.update_user_profile = [
  // Validate and sanitize form
  body("pseudo")
    .notEmpty()
    .withMessage("Pseudo is required")
    .trim()
    .isLength({ max: 20 })
    .withMessage("Pseudo max length is 20 char")
    .escape(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email should be a correct email address")
    .normalizeEmail(),
  body("profile_picture")
    .isString()
    .withMessage("URL is not a string")
    .isIn(imgArray)
    .withMessage("You attempt to pass an invalid img link"),
  checkExact(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors.
      res.json({
        errors: errors.array(),
      });
    } else {
      //check if email is already used
      let user = await User.findOne({ email: req.body.email }).exec();
      if (user) {
        return res.status(400).json({ message: "Email already exists" });
      }

      //check if pseudo already used
      user = await User.findOne({ pseudo: req.body.pseudo }).exec();
      if (user) {
        return res.status(400).json({ message: "Pseudo already exists." });
      }

      const userProfile = await User.findByIdAndUpdate(
        req.user,
        req.body
      ).exec();

      res.json({ userProfile, message: "User profile successfully updated" });
    }
  }),
];

//search users by pseudo
exports.get_users = [
  // Validate and sanitize query
  query("pseudo")
    .notEmpty()
    .withMessage("Pseudo is required")
    .trim()
    .isLength({ max: 20 })
    .withMessage("Pseudo max length is 20 char")
    .escape(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors.
      res.json({
        errors: errors.array(),
      });
    } else {
      const results = await User.find({
        pseudo: { $regex: new RegExp(req.query.pseudo, "i") },
      }).exec();

      res.json(results);
    }
  }),
];

//post friend request
exports.post_friend_request = [
  // Validate and sanitize param
  param("friendid").trim().escape(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    const friend = await User.findById(req.params.friendid).exec();
    if (!friend) {
      // No results.
      const err = new Error("Friend not found");
      err.status = 404;
      return next(err);
    }
    const user = await User.findById(req.user).exec();
    if (user.friends.includes(friend._id)) {
      res.json({ message: "Friend already in friends list" });
    }
    if (user.received_friends_requests.includes(friend._id)) {
      user.received_friends_requests.pull(friend._id);
      user.friends.push(friend._id);
      friend.emitted_friends_requests.pull(user._id);
      friend.friends.push(user._id);
    } else {
      user.emitted_friends_requests.push(friend._id);
      friend.received_friends_requests.push(user._id);
    }
    await user.save();
    await friend.save();
    res.json({ message: "Friend successfully added" });
  }),
];

exports.post_conversation = [
  // Validate and sanitize form
  body("name").optional({ values: "falsy" }).trim().escape(),
  body("participants_pseudo")
    .isArray({ min: 1 })
    .withMessage("At least one participant must be specified"),

  body("participants_pseudo.*").trim().escape(),
  body("participants_id")
    .isArray({ min: 1 })
    .withMessage("At least one participant must be specified"),

  body("participants_id.*").trim().escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors.
      res.json({
        errors: errors.array(),
      });
    } else {
      if (!req.body.name) {
        req.body.name = req.body.participants_pseudo.join(", ");
      }

      const newConversation = new Conversation({
        name: req.body.name,
        participants: req.body.participants_id,
      });

      await newConversation.save();
      await Promise.all(
        req.body.participants_id.map(async (id) => {
          await User.findByIdAndUpdate(id, {
            $push: { conversation: newConversation._id },
          }).exec();
        })
      );

      res.json({
        conversation: newConversation,
        message: "Conversation successfully created",
      });
    }
  }),
];

exports.get_conversation_messages = [
  // Validate and sanitize param
  param("conversationid").trim().escape(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    const conversation = await Conversation.findById(
      req.params.conversationid
    ).exec();
    if (!conversation) {
      // No results.
      const err = new Error("Conversation not found");
      err.status = 404;
      return next(err);
    }
    if (!conversation.participants.includes(req.user)) {
      const err = new Error("You don't belong in this conversation");
      err.status = 404;
      return next(err);
    }
    const messages = await Message.find({ to: req.params.conversationid })
      .populate("from", "pseudo")
      .sort({ time_stamp: 1 })
      .exec();

    res.json(messages);
  }),
];

exports.post_conversation_message = [
  // Validate and sanitize form
  param("conversationid").trim().escape(),
  body("text", "text must be a string")
    .trim()
    .isString()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors.
      res.json({
        errors: errors.array(),
      });
    } else {
      const newMessage = new Message({
        from: req.user,
        to: req.params.conversationid,
        text: req.body.text,
      });

      await newMessage.save();

      await Conversation.findByIdAndUpdate(req.params.conversationid, {
        last_message: newMessage._id,
      });

      res.json(newMessage);
    }
  }),
];

//set online to false, but token is still valid for exp time if fetching user profile again
exports.log_out = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user, {
    online: false,
  }).exec();

  res.json({ message: "User logged out successfully" });
});
