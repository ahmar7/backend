let jwt = require("jsonwebtoken");
let userScema = require("../models/model");
let auth = async (req, res, next) => {
  try {
    let token = req.cookies.jwttoken;
    let verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    let userFind = await userScema.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });

    if (!userFind) {
      throw new Error("User not found");
    }
    req.userFind = userFind;
    req.userId = userFind._id;
    req.token = token;
    next();
  } catch (error) {
    console.log("error");
    res.status(404).send(error);
  }
};

module.exports = auth;
