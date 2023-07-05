const jwt = require("jsonwebtoken");
const { User, UserVaccine, UserPlace } = require("../models");

exports.createUser = async (req, res) => {
  const { phoneNumber, idNumber } = req.body;
  try {
    let user = await User.findOne({ phoneNumber: phoneNumber });
    if (user)
      res
        .status(403)
        .json("Phone number already registered for another account");

    user = await User.findOne({ idNumber: idNumber });
    if (user) res.status(403).json("ID already registered for another account");

    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    const token = jwt.sign(
      {
        id: savedUser._id,
      },
      process.env.TOKEN_SECRET_KEY
    );

    res.status(201).json({
      token,
      user: savedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getUsersList = async (req, res) => {
  try {
    const userList = await User.find({}).sort("-createAt");
    for (item of userList) {
      const vaccine = await UserVaccine.find({ user: item._id }).sort(
        "-createAt"
      );
      item._doc.vaccine = vaccine;
    }
    res.status(200).json(userList);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const userVaccine = await UserVaccine.find({
      user: req.params.id,
    })
      .populate("vaccine")
      .populate("vaccineLot")
      .sort("-createAt");
    const userPlaceVisit = await UserPlace.find({
      user: req.params.id,
    })
      .populate("place")
      .sort("-createAt");
    user._doc.vaccinated = userVaccine;
    user._doc.placeVisited = userPlaceVisit;
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.updateById = async (req, res) => {
  const { phoneNumber, idNumber } = req.body;
  try {
    let user = await User.findOne({ phoneNumber: phoneNumber });
    if (user) {
      res
        .status(403)
        .json("Phone number already registered for another account");
      return false;
    }
    user = await User.findOne({ idNumber: idNumber });
    if (user) {
      res.status(403).json("ID already registered for another account");
      return false;
    }

    user = await User.findById(req.params.id);
    user.set(req.body);
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.deteleById = async (req, res) => {
  try {
    const userId = req.params.id;
    await UserVaccine.deleteMany({ user: userId });
    await UserPlace.deleteMany({ user: userId });
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json("User not found");
    }

    res.status(200).json("User deleted successfully");
    
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
