exports.getUser = (req, res, next) => {
  res.status(200).json({ message: "user" });
};
exports.getEmotion = (req, res, next) => {
    res.status(200).json({ message: "/user/emotion" });

};
