const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { Admin, User, Place, UserVaccine, VaccineLot } = require("../models");

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
    if (decryptedPass !== req.body.password)
      res.status(401).json("Wrong password");

    const token = jwt.sign(
      {
        id: admin._id,
      },
      process.env.TOKEN_SECRET_KEY
    );

    admin.password = undefined;

    res.status(200).json({
      token,
      admin,
    });
  } catch (error) {
    console.log(error);
  }
};

// admin dashboard summary data
exports.summary = async (req, res) => {
  try {
    const totalUser = await User.find({}).count();
    const totalPlace = await Place.find({}).count();

    // count user who has been vaccinated
    const userVaccinated = await UserVaccine.aggregate([
      {
        $group: { _id: "$user" },
      },
    ]).count("user");

    // count total vaccine dose
    const totalVaccineDose = await VaccineLot.aggregate([
      {
        $group: {
          _id: null,
          quantity: { $sum: "$quantity" },
        },
      },
    ]);

    // count total used vaccine dose
    const totalVaccineDoseUsed = await VaccineLot.aggregate().group({
      _id: null,
      vaccinated: { $sum: "$vaccinated" },
    });

    // get lates vaccine lot
    const latestVaccineLot = await VaccineLot.find({})
      .sort("-createdAt")
      .limit(4)
      .populate("vaccine");

    // count user who has one vaccine dose
    const userWithOneDose = await UserVaccine.aggregate()
      .group({
        _id: "$user",
        quantity: { $sum: +1 },
      })
      .match({ quantity: 1 })
      .count("count");

    // count user who has >= two dose
    const userWithAboveTwoDose = await UserVaccine.aggregate()
      .group({
        _id: "$user",
        quantity: { $sum: +1 },
      })
      .match({ quantity: { $gte: 2 } })
      .count("count");

    res.status(200).json({
      totalUser,
      totalPlace,
      userVaccinated: userVaccinated[0] ? userVaccinated[0].user : 0,
      availableVaccineDose:
        (totalVaccineDose[0] ? totalVaccineDose[0].quantity : 0) -
        (totalVaccineDoseUsed[0] ? totalVaccineDoseUsed[0].vaccinated : 0),
      latestVaccineLot,
      userVaccinatedAnalyst: {
        totalUser,
        userWithAboveTwoDose: userWithAboveTwoDose[0]
          ? userWithAboveTwoDose[0].count
          : 0,
        userWithOneDose: userWithOneDose[0] ? userWithOneDose[0].count : 0,
        userWithZeroDose:
          totalUser - (userVaccinated[0] ? userVaccinated[0].user : 0),
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
