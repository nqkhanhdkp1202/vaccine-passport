const jwt = require("jsonwebtoken");
const { Admin, User } = require("../models");

const tokenDecode = req => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ")[1];
    try {
      const tokenDecoded = jwt.verify(bearer, process.env.TOKEN_SECRET_KEY);
      return tokenDecoded;
    } catch (error) {
      return false;
    }
  }
};

exports.verifyAdminToken = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req);
  if (tokenDecoded) {
    const admin = await Admin.findById(tokenDecoded.id);
    if (!admin) res.status(403).json("Permission not allowed");
    req.admin = admin;
    next();
  } else {
    res.status(401).json("Unauthorized");
  }
};

exports.verifyToken = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req);
  if (tokenDecoded) {
    const admin = await Admin.findById(tokenDecoded.id);
    const user = await User.findById(tokenDecoded.id);
    if (!admin && !user) res.status(403).json("Permission not allowed");
    req.admin = admin;
    req.user = user;
    next();
  } else {
    res.status(401).json("Unauthorized");
  }
};
