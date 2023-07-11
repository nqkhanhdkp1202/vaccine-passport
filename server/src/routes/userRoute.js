const router = require("express").Router();
const { userController } = require("../controllers");
const tokenHandler = require("../handlers/tokenHandler");

router.post("/", tokenHandler.verifyAdminToken, userController.createUser);
router.get("/", tokenHandler.verifyAdminToken, userController.getUsersList);
router.get("/:id", tokenHandler.verifyAdminToken, userController.getUserById);
router.get("/:userId/place", tokenHandler.verifyAdminToken, userController.getAllPlace);
router.put("/:id", tokenHandler.verifyAdminToken, userController.updateById);
router.post("/vaccinated/", tokenHandler.verifyAdminToken, userController.vaccinated);
router.delete("/:id", tokenHandler.verifyAdminToken, userController.deteleById);

module.exports = router;
