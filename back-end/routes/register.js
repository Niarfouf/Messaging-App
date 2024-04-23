const express = require("express");
const router = express.Router();

const register_controller = require("../controllers/registerController");

router.post("/sign-in", register_controller.sign_in);
router.post("/sign-up", register_controller.sign_up);

module.exports = router;
