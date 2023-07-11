const router = require("express").Router();
const { vaccineControler } = require("../controllers");
const tokenHandler = require("../handlers/tokenHandler");

router.post("/", tokenHandler.verifyToken, vaccineControler.createVaccine);
router.get("/", tokenHandler.verifyToken, vaccineControler.getVaccineList);
router.get("/:id", tokenHandler.verifyToken, vaccineControler.getVaccineById);
router.put("/:id", tokenHandler.verifyToken, vaccineControler.updateVaccineById);
router.delete("/:id", tokenHandler.verifyToken, vaccineControler.deleteVaccineById);

module.exports = router;
