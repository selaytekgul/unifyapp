const path = require("path");

const userController = require("../controllers/user");

var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", userController.getUser);

router.get("/ocean", userController.getOcean);

// GET /feed/posts
router.get('/posts', userController.getPosts);

// POST /feed/post
router.post('/post', userController.createPost);

module.exports = router;
