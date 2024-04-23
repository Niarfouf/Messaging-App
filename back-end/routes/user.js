const passport = require("passport");
require("../passport-config")(passport);
const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/userController");

//get user info
router.get(
  "/info",
  passport.authenticate("jwt", { session: false }),
  user_controller.get_user_info
);

//update user profile
router.put(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  user_controller.update_user_profile
);

//search for users
router.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  user_controller.get_users
);

//post friends request
router.post(
  "/friends/:friendid",
  passport.authenticate("jwt", { session: false }),
  user_controller.post_friend_request
);

//create new conversation
router.post(
  "/conversations",
  passport.authenticate("jwt", { session: false }),
  user_controller.post_conversation
);

//get all messages in conversation
router.get(
  "/conversations/:conversationid",
  passport.authenticate("jwt", { session: false }),
  user_controller.get_conversation_messages
);

//update conversation
/*router.put(
  "/conversations/:conversationid",
  passport.authenticate("jwt", { session: false }),
  user_controller.update_conversation
);*/

//create new message in conversation
router.post(
  "/conversations/:conversationid",
  passport.authenticate("jwt", { session: false }),
  user_controller.post_conversation_message
);

//modify message in conversation
/*router.put(
  "/conversations/:conversationid/:messageid",
  passport.authenticate("jwt", { session: false }),
  user_controller.update_conversation_message
);*/

//delete message in conversation
/*router.delete(
  "/conversations/:conversationid/:messageid",
  passport.authenticate("jwt", { session: false }),
  user_controller.delete_conversation_message
);*/

router.post(
  "/log_out",
  passport.authenticate("jwt", { session: false }),
  user_controller.log_out
);

module.exports = router;
