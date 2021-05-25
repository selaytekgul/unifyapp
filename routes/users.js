const path = require("path");

const userController = require("../controllers/user");

var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", userController.getUser);

router.get("/emotion", userController.getEmotion);

module.exports = router;
