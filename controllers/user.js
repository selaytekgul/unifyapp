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

    categories = [];
    if (analysisResults["status"] == 200) {
      for (const key in analysisResults["result"]) {
        for (
          let index = 0;
          index < analysisResults["result"][key].length;
          index++
        ) {
          const element = analysisResults["result"][key][index];

          if (element["label"] != null) {
            var category = element["label"].substr(1).split("/");
            for (let j = 0; j < category.length; j++) {
              categories.push(category[j]);
            }
          }
        }
      }
      // Obtain unique categories from the result
      let categoriesUnique = categories.filter(
        (value, index, categories) => categories.indexOf(value) === index
      );
      res.status(201).json({
        result: categoriesUnique,
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
