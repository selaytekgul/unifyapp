const path = require("path");

const userController = require("../controllers/user");

var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", userController.getUser);

router.get("/ocean", userController.getOcean);

// GET /feed/posts
router.get("/posts", userController.getPosts);

// POST /feed/post
router.post("/post", userController.createPost);

// POST /user/tweetsbyUserName
router.post("/twUser", userController.getUserCategoryFromTweets);

// POST /user/getRecommendations
router.post("/getRecommendations", userController.getUserRecommendations);

module.exports = router;
