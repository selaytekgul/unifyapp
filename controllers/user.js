// In Node.js, use process.env to access environment variables:

// const aws = require('aws-sdk');

// let s3 = new aws.S3({
//   accessKeyId: process.env.S3_KEY,
//   secretAccessKey: process.env.S3_SECRET
// });

// const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
// const { IamAuthenticator } = require("ibm-watson/auth");

// const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
//   version: "2020-08-01",
//   authenticator: new IamAuthenticator({
//     apikey: process.env.NATURAL_LANGUAGE_UNDERSTANDING_APIKEY,
//   }),
//   serviceUrl: process.env.NATURAL_LANGUAGE_UNDERSTANDING_URL,
// });

// const analyzeParams = {
//   html: "<html><head><title>Fruits</title></head><body><h1>Apples and Oranges</h1><p>I love apples! I don't like oranges.</p></body></html>",
//   features: {
//     emotion: {
//       targets: ["apples", "oranges"],
//     },
//   },
// };

// naturalLanguageUnderstanding
//   .analyze(analyzeParams)
//   .then((analysisResults) => {
//     console.log(JSON.stringify(analysisResults, null, 2));
//   })
//   .catch((err) => {
//     console.log("error:", err);
//   });

exports.getUser = (req, res, next) => {
  res.status(200).json({ message: "user" });
};
exports.getOcean = (req, res, next) => {
  res.status(200).json({ message: "/user/ocean" });
};
exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        title: "First Post",
        content: "This is the first post!",
        apikey: process.env.NATURAL_LANGUAGE_UNDERSTANDING_APIKEY,
        serviceUrl: process.env.NATURAL_LANGUAGE_UNDERSTANDING_URL,
      },
    ],
  });
};

exports.createPost = async (req, res, next) => {
  try {
    const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
    const { IamAuthenticator } = require("ibm-watson/auth");

    const apikey = process.env.NATURAL_LANGUAGE_UNDERSTANDING_APIKEY;
    const url = process.env.NATURAL_LANGUAGE_UNDERSTANDING_URL;
    const naturalLanguageUnderstanding =
      await new NaturalLanguageUnderstandingV1({
        version: "2020-08-01",
        authenticator: new IamAuthenticator({
          apikey: String(apikey),
        }),
        serviceUrl: String(url),
      });

    // const title = req.body.title;
    // const content = req.body.content;
    // const toAnalyze = req.body.toAnalyze;
    const toAnalyze = {
      html: "<html><head><title>Fruits</title></head><body><h1>Apples and Oranges</h1><p>I love apples! I don't like oranges.</p></body></html>",
      features: {
        emotion: {
          targets: ["apples", "oranges"],
        },
      },
    };
    const analysisResults = await naturalLanguageUnderstanding.analyze(
      toAnalyze
    );
    res.status(201).json({
      result: JSON.stringify(analysisResults, null, 2),
    });
  } catch (error) {
    console.log("error:", error);
  }
  // console.log(JSON.stringify(analysisResults, null, 2));
  // })
  // catch((err) => {
  // });

  // Create post in db
  // res.status(201).json({
  //   message: "Post created successfully!",
  //   post: {
  //     id: new Date().toISOString(),
  //     title: title,
  //     content: content,
  //     toAnalyze: toAnalyze,
  //   },
  // });
};
