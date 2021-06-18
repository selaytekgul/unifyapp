exports.getUser = async (req, res, next) => {
  try {
    var fr = require("./firebase");
    const allUsersRes = await fr.db.collection("users").get(); //users who have categories

    var users = allUsersRes.docs.map((doc) => doc.data());

    res.status(200).json({ result: users });
  } catch (error) {
    console.log("error:", error);
    res.status(error["status"]).json({
      response: "Error Occured",
      reason: error["name"],
    });
  }

  res.status(200).json({ message: "user" });
};
exports.getUserCategories = async (req, res, next) => {
  try {
    var fr = require("./firebase");
    const allUsersRes = await fr.db
      .collection("users")
      .where("categories", "!=", null)
      .get(); //users who have categories

    var users = allUsersRes.docs.map((doc) => doc.data());

    res.status(200).json({ result: users });
  } catch (error) {
    console.log("error:", error);
    res.status(error["status"]).json({
      response: "Error Occured",
      reason: error["name"],
    });
  }

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

  const apikey = process.env.NATURAL_LANGUAGE_UNDERSTANDING_APIKEY;
  const servURL = process.env.NATURAL_LANGUAGE_UNDERSTANDING_URL;

  const naturalLanguageUnderstanding = await new NaturalLanguageUnderstandingV1(
    {
      version: "2020-08-01",
      authenticator: new IamAuthenticator({
        apikey: `${apikey}`,
      }),
      serviceUrl: `${servURL}`,
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
exports.getUserCategoryFromTweets = async (req, res, next) => {
  try {
    const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
    const { IamAuthenticator } = require("ibm-watson/auth");
    const needle = require("needle");

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
      version: "2020-08-01",
      authenticator: new IamAuthenticator({
        apikey: "zh2ta0pUk00isPtZl4tuv3rHU2JRDyhA2-IZl68P6VxH",
      }),
      serviceUrl:
        "https://api.eu-gb.natural-language-understanding.watson.cloud.ibm.com/instances/a5181c10-50ed-4788-8797-ef900d41c5ea",
    });

    // https://github.com/twitterdev/Twitter-API-v2-sample-code/blob/master/User-Lookup/get_users_with_bearer_token.js
    // Get User objects by username, using bearer token authentication
    // https://developer.twitter.com/en/docs/twitter-api/users/lookup/quick-start

    // The code below sets the bearer token from your environment variables
    // To set environment variables on macOS or Linux, run the export command below from the terminal:
    // export BEARER_TOKEN='YOUR-TOKEN'
    const token = process.env.BEARER_TOKEN;

    const endpointURL = "https://api.twitter.com/2/users/by?usernames=";

    // specify User names to fetch, and any additional fields that are required
    // by default, only the User ID, name and user name are returned
    const paramsUserID = {
      usernames: req.body.userName, // Edit usernames to look up
      "user.fields": "created_at,description", // Edit optional query parameters here
      expansions: "pinned_tweet_id",
    };

    // this is the HTTP header that adds bearer token authentication
    const resUserID = await needle("get", endpointURL, paramsUserID, {
      headers: {
        "User-Agent": "v2UserLookupJS",
        authorization: `Bearer ${token}`,
      },
    });
    console.log("resuserıd");

    // if we could find the userId with the given name
    if (resUserID.body) {
      const userId = resUserID.body.data[0]["id"]; //assign userId
      // console.log(resUserID.body);
      // console.log(userId);

      // Get User Tweet timeline by user ID
      // https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/quick-start
      // this is the ID for @TwitterDev
      // const userId = "2244994945";
      const url = `https://api.twitter.com/2/users/${userId}/tweets`;

      let userTweets = [];

      // we request the author_id expansion so that we can print out the user name later
      let paramsUserTweets = {
        max_results: 100, //limit the max number of tweet to retrieve
        "tweet.fields": "created_at",
        expansions: "author_id",
      };

      // necessary options from the API to validate token to send request
      const options = {
        headers: {
          "User-Agent": "v2UserTweetsJS",
          authorization: `Bearer ${token}`,
        },
      };

      let hasNextPage = true;
      let nextToken = null;
      let userName;
      console.log("Retrieving Tweets...");

      // retrieve tweets from user
      while (hasNextPage) {
        const respBody = await needle("get", url, paramsUserTweets, options);
        let resp = respBody.body;
        if (
          resp &&
          resp.meta &&
          resp.meta.result_count &&
          resp.meta.result_count > 0
        ) {
          userName = resp.includes.users[0].username;
          if (resp.data) {
            userTweets.push.apply(userTweets, resp.data);
            hasNextPage = false;
          }
          if (resp.meta.next_token) {
            nextToken = resp.meta.next_token;
            hasNextPage = false;
          } else {
            hasNextPage = false;
          }
        } else {
          hasNextPage = false;
        }
      }

      console.log(
        `Got ${userTweets.length} Tweets from ${userName} (user ID ${userId})!`
      );
      // helper variable to keep tweets which will be sent to IBM to be analyzed for categories
      twetoanalyze = "";

      // concatanete each tweets from user to later convert to JSON
      for (const tweet in userTweets) {
        var toPush = userTweets[tweet]["text"].replace(/(\r\n|\n|\r)/gm, "");
        twetoanalyze += toPush;
      }
      // conert retrieved tweets to JSON for sending a request to IBM to analyze
      JSON.stringify(twetoanalyze);

      // assign tweets to text to analyze
      const analyzeParams = {
        // text: req.body.toAnalyze,
        text: twetoanalyze,
        features: {
          keywords: {
            emotion: true,
          },
          categories: {
            emotion: true,
            sentiment: true,
            limit: 100,
            explanation: true,
          },
        },
      };
      // analyze the given tweets from user
      const analysisResults = await naturalLanguageUnderstanding.analyze(
        analyzeParams
      );

      categories = [];
      // check for the status and then find and push each categories to array to later find unique categories
      if (analysisResults["status"] == 200) {
        for (const key in analysisResults["result"]) {
          for (
            let index = 0;
            index < analysisResults["result"][key].length;
            index++
          ) {
            const element = analysisResults["result"][key][index];

            if (element["label"] != null) {
              console.log("not null");
              console.log(element["label"]);
              var category = element["label"].substr(1).split("/");
              for (let j = 0; j < category.length; j++) {
                categories.push(category[j]);
              }
            }
          }
        }
        // Obtain Unique Categories
        let categoriesUnique = categories.filter(
          (value, index, categories) => categories.indexOf(value) === index
        );
        // return response Unique Categories and Analysis Results
        res.status(201).json({
          result: categoriesUnique,
          analysisResults: analysisResults,
        });
      } else {
        res.status(analysisResults["status"]).json({
          result: analysisResults["statusText"],
        });
      }
    } //if resUserId.body exist
    else {
      throw new Error("Unsuccessful request");
    }
  } catch (error) {
    console.log("error:", error);
    res.status(error["status"]).json({
      response: "Error Occured",
      reason: error["name"],
    });
  }
};
exports.getUserRecommendations = async (req, res, next) => {
  try {
    var fr = require("./firebase");
    const reqRecommendation = req.body.userName;
    const allUsersRes = await fr.db
      .collection("users")
      .where("categories", "!=", null)
      .get(); //users who have categories

    const reqUserRes = await fr.db
      .collection("users")
      .where("username", "==", reqRecommendation)
      .get();
    var reqUser = reqUserRes.docs.map((doc) => doc.data());

    var users = allUsersRes.docs.map((doc) => doc.data());

    var recommendationUserNames = {};
    for (let l = 0; l < users.length; l++) {
      recommendationUserNames[users[l].username] = 0;
    }
    for (let index = 0; index < users.length; index++) {
      if (users[index].username != reqRecommendation) {
        for (let j = 0; j < users[index].categories.length; j++) {
          for (let k = 0; k < reqUser[0].categories.length; k++) {
            if (users[index].categories[j] == reqUser[0].categories[k]) {
              recommendationUserNames[users[index].username]++;
            }
          }
        }
      }
    }
    var sortable = [];
    for (var user in recommendationUserNames) {
      sortable.push([user, recommendationUserNames[user]]);
    }
    sortable.sort(function (a, b) {
      return a[1] - b[1];
    });
    var toReturn = sortable.slice(-3);
    var toReturnKeys = toReturn.map(function (val, index) {
      return toReturn[index][0];
    });

    res.status(200).json({ result: toReturnKeys });
  } catch (error) {
    console.log("error:", error);
    res.status(error["status"]).json({
      response: "Error Occured",
      reason: error["name"],
    });
  }
};
exports.getUserRecommendationsDetailed = async (req, res, next) => {
  try {
    var fr = require("./firebase");
    const reqRecommendation = req.body.userName;
    const allUsersRes = await fr.db
      .collection("users")
      .where("categories", "!=", null)
      .get(); //users who have categories

    const reqUserRes = await fr.db
      .collection("users")
      .where("username", "==", reqRecommendation)
      .get();
    var reqUser = reqUserRes.docs.map((doc) => doc.data());

    var users = allUsersRes.docs.map((doc) => doc.data());

    var recommendationUserNames = {};
    for (let l = 0; l < users.length; l++) {
      recommendationUserNames[users[l].username] = 0;
    }
    for (let index = 0; index < users.length; index++) {
      if (users[index].username != reqRecommendation) {
        for (let j = 0; j < users[index].categories.length; j++) {
          for (let k = 0; k < reqUser[0].categories.length; k++) {
            if (users[index].categories[j] == reqUser[0].categories[k]) {
              recommendationUserNames[users[index].username]++;
            }
          }
        }
      }
    }
    res.status(200).json({ result: recommendationUserNames });
  } catch (error) {
    console.log("error:", error);
    res.status(error["status"]).json({
      response: "Error Occured",
      reason: error["name"],
    });
  }
};
