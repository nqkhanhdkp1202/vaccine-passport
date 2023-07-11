const router = require("express").Router();
const { vaccineLotController } = require("../controllers");
const tokenHandler = require("../handlers/tokenHandler");

router.post("/", tokenHandler.verifyToken, vaccineLotController.createVaccineLot);
router.get("/", tokenHandler.verifyToken, vaccineLotController.getVaccineLotList);
router.get("/:id", tokenHandler.verifyToken, vaccineLotController.getVaccineLotById);
router.put("/:id", tokenHandler.verifyToken, vaccineLotController.updateVaccineLot);
router.delete("/:id", tokenHandler.verifyToken, vaccineLotController.deleteVaccineLotById);

module.exports = router;