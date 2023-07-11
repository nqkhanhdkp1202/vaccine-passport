const { Vaccine, VaccineLot, UserVaccine } = require("../models");

exports.createVaccine = async (req, res) => {
  try {
    const newVaccine = new Vaccine({
      name: req.body.name,
    });
    const saveVaccine = await newVaccine.save();
    saveVaccine._doc.quantity = 0;
    saveVaccine._doc.vaccinated = 0;
    saveVaccine._doc.vaccineLots = [];
    res.status(201).json(saveVaccine);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

exports.getVaccineList = async (req, res) => {
  try {
    const vaccineList = await Vaccine.find({}).sort("-createdAt");
    for (const vaccine of vaccineList) {
      const vaccineLot = await VaccineLot.find({ vaccine: vaccine._id });
      vaccine._doc.quantity = vaccineLot.reduce(
        (total, item) => total + Number(item.quantity),
        0
      );
      vaccine._doc.vaccinated = vaccineLot.reduce(
        (total, item) => total + Number(item.vaccinated),
        0
      );
      vaccine._doc.vaccineLot = vaccineLot;
    }
    res.status(200).json(vaccineList);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getVaccineById = async (req, res) => {
  try {
    const vaccine = await Vaccine.findById(req.params.id);
    const vaccineLot = await VaccineLot.find({ vaccine: vaccine._id });
    vaccine._doc.quantity = vaccineLot.reduce(
      (total, item) => total + Number(item.quantity),
      0
    );
    vaccine._doc.vaccinated = vaccineLot.reduce(
      (total, item) => total + Number(item.vaccinated),
      0
    );
    vaccine._doc.vaccineLot = vaccineLot;
    res.status(200).json(vaccine);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.updateVaccineById = async (req, res) => {
  try {
    const vaccineId = req.params.id;
    const vaccine = await Vaccine.findOne({
      _id: vaccineId,
    });
    vaccine.set(req.body);
    await vaccine.save();
    res.status(200).json(vaccine);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.deleteVaccineById = async (req, res) => {
  try {
    await VaccineLot.deleteMany({ vaccine: req.params.id });
    await UserVaccine.deleteMany({ vaccine: req.params.id });
    await Vaccine.findByIdAndDelete(req.params.id);
    res.status(200).json("Deleted");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
