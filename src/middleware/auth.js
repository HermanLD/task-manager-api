const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const clientToken = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(clientToken, "thisisnode");
    const user = await User.findOne({
      _id: decodedToken._id,
      "tokens.token": clientToken,
    });

    if (!user) throw new Error();

    req.token = clientToken;

    //? Attach user Obj to request, which is passed to router endpoint
    req.user = user;

    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = auth;
