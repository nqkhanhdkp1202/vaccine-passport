const jwt = require("jsonwebtoken");
const {
  User,
  UserVaccine,
  UserPlace,
  VaccineLot,
  Vaccine,
  Place,
} = require("../models");

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
    if (!user) {
      res.status(500).json("User not found");
    }
    user.set(req.body);
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
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

exports.vaccinated = async (req, res) => {
  const { userId, vaccineId, vaccineLotId } = req.body;
  try {
    const newVaccine = new UserVaccine({
      user: userId,
      vaccine: vaccineId,
      vaccineLot: vaccineLotId,
    });
    const savedVaccine = await newVaccine.save();
    await VaccineLot.findByIdAndUpdate(
      {
        _id: vaccineLotId,
      },
      {
        $inc: { vaccinated: +1 },
      }
    );
    savedVaccine._doc.vaccine = await Vaccine.findById(vaccineId);
    savedVaccine._doc.vaccineLot = await VaccineLot.findById(vaccineLotId);

    res.status(201).json(savedVaccine);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

exports.getAllPlace = async (req, res) => {
  try {
    const placeList = await Place.find({
      creator: req.params.userId,
    });
    res.status(200).json(placeList);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
