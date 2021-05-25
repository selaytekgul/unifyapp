const path = require("path");

const indexController = require("../controllers/index");

var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", indexController.getEntryPoint);

module.exports = router;
