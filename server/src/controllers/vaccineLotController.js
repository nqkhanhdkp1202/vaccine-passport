const { VaccineLot, UserVaccine } = require("../models");

exports.createVaccineLot = async (req, res) => {
  try {
    const newVaccineLot = new VaccineLot({
      name: req.body.name,
      quantity: req.body.quantity,
      vaccinated: 0,
      vaccine: req.body.vaccineId,
    });
    const saveVaccineLot = await newVaccineLot.save();
    res.status(201).json(saveVaccineLot);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

exports.getVaccineLotList = async (req, res) => {
  try {
    const vaccineLotList = await VaccineLot.find({})
      .populate("vaccine")
      .sort("-createdAt");
    res.status(200).json(vaccineLotList);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

exports.getVaccineLotById = async (req, res) => {
  try {
    const vaccineLot = await VaccineLot.findById(req.params.id).populate(
      "vaccine"
    );
    res.status(200).json(vaccineLot);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

exports.updateVaccineLot = async (req, res) => {
  try {
    const vaccineLot = await VaccineLot.findById(req.params.id);
    vaccineLot.set(req.body);
    await vaccineLot.save();
    res.status(200).json(vaccineLot);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

exports.deleteVaccineLotById = async (req, res) => {
  try {
    await UserVaccine.deleteMany({ vaccineLot: req.params.id });
    await VaccineLot.findByIdAndDelete(req.params.id);
    res.status(200).json("Deleted");
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};
