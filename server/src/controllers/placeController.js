const { Place, UserPlace } = require("../models");
const place = require("../models/place");

exports.createPlace = async (req, res) => {
  try {
    const creator = req.user._id;
    const newPlace = new Place({
      ...req.body,
      creator: creator,
    });
    const savedPlace = await newPlace.save();
    res.status(201).json(savedPlace);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getPlaceList = async (req, res) => {
  try {
    const placeList = await Place.find({})
      .populate("creator")
      .sort("-createdAt");
    for (item of placeList) {
      const userVisitLast24h = await UserPlace.find({
        place: item._id,
        createdAt: {
          $gt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      });
      item._doc.userVisitLast24h = userVisitLast24h;
    }
    res.status(200).json(placeList);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id).populate("creator");
    const userVisitLast24h = await UserPlace.find({
      place: place._id,
      createdAt: {
        $gt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    });
    place._doc.userVisitLast24h = userVisitLast24h;
    res.status(200).json(place);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.updatePlaceById = async (req, res) => {
  try {
    const creator = req.user._id;
    const placeId = req.params.id;
    const place = await Place.findOne({
      _id: placeId,
      creator: creator,
    });
    place.set(req.body);
    await place.save();
    res.status(200).json(place);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

exports.deletePlaceById = async (req, res) => {
  try {
    const creator = req.user._id;
    const placeId = req.params.id;
    await UserPlace.deleteMany({ place: req.params.id });
    await Place.findOneAndDelete({
      _id: placeId,
      creator: creator,
    });
    res.status(200).json("Deleted");
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};
