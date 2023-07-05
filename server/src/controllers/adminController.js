const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { Admin } = require("../models");

exports.helloAdmin = (req, res) => {
  res.send("Hello admin");
};

exports.login = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      username: req.body.username,
    });
    if (!admin) res.status(401).json("Wrong username");
    const decryptedPass = CryptoJS.AES.decrypt(
      admin.password,
      process.env.PASSWORD_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);
    if(decryptedPass !== req.body.password) res.status(401).json("Wrong password");

    const token = jwt.sign({
        id: admin._id,
    },process.env.TOKEN_SECRET_KEY)

    admin.password = undefined;

    res.status(200).json({
        token,
        admin
    })
  } catch (error) {
    console.log(error)
  }
};
