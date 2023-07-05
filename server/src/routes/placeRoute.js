const router = require("express").Router();
const { placeController } = require("../controllers");
const tokenHandler = require("../handlers/tokenHandler");

router.post("/", tokenHandler.verifyToken, placeController.createPlace);
router.get("/", tokenHandler.verifyToken, placeController.getPlaceList);
router.get("/:id", tokenHandler.verifyToken, placeController.getPlaceById);
router.put("/:id", tokenHandler.verifyToken, placeController.updatePlaceById);
router.delete("/:id", tokenHandler.verifyToken, placeController.deletePlaceById);

module.exports = router;
