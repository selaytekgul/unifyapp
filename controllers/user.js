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
  const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
  const { IamAuthenticator } = require("ibm-watson/auth");

  const naturalLanguageUnderstanding = await new NaturalLanguageUnderstandingV1(
    {
      version: "2020-08-01",
      authenticator: new IamAuthenticator({
        apikey: "zh2ta0pUk00isPtZl4tuv3rHU2JRDyhA2-IZl68P6VxH",
      }),
      serviceUrl:
        "https://api.eu-gb.natural-language-understanding.watson.cloud.ibm.com/instances/a5181c10-50ed-4788-8797-ef900d41c5ea",
    }
  );

  const analyzeParams = {
    text: req.body.toAnalyze,
    features: {
      keywords: {
        emotion: true,
      },
      categories: {
        emotion: true,
        sentiment: true,
      },
    },
  };
  try {
    const analysisResults = await naturalLanguageUnderstanding.analyze(
      analyzeParams
    );

    if (analysisResults["status"] == 200) {
      for (const key in analysisResults) {
        console.log(key);
        if (key == "result") {
          for (let i = 0; i < key.length; i++) {
            const element = key[i];
            console.log(element);
          }
        }
      }

      res.status(201).json({
        result: analysisResults,
      });
    } else {
      res.status(analysisResults["status"]).json({
        result: analysisResults["statusText"],
      });
    }
  } catch (error) {
    console.log("error:", error);
    res.status(error["status"]).json({
      response: "Error Occured",
      reason: error["name"],
    });
  }
};
