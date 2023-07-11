const router = require("express").Router();
const { userController } = require("../controllers");
const tokenHandler = require("../handlers/tokenHandler");

router.post("/", tokenHandler.verifyAdminToken, userController.createUser);
router.get("/", tokenHandler.verifyToken, userController.getUsersList);
router.get("/:id", tokenHandler.verifyToken, userController.getUserById);
router.get("/:userId/place", tokenHandler.verifyToken, userController.getAllPlace);
router.get("/:userId/check-in", tokenHandler.verifyToken, userController.getListCheckedIn);
router.put("/:id", tokenHandler.verifyAdminToken, userController.updateById);
router.post("/vaccinated/", tokenHandler.verifyAdminToken, userController.vaccinated);
router.post("/checkin-place/", tokenHandler.verifyToken, userController.checkinPlace);
router.delete("/:id", tokenHandler.verifyAdminToken, userController.deteleById);

module.exports = router;
