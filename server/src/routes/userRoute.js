const router = require("express").Router();
const { userController } = require("../controllers");
const tokenHandler = require("../handlers/tokenHandler");

router.post("/", tokenHandler.verifyAdminToken, userController.createUser);
router.get("/", tokenHandler.verifyAdminToken, userController.getUsersList);
router.get("/:id", tokenHandler.verifyAdminToken, userController.getUserById);
router.put("/:id", tokenHandler.verifyAdminToken, userController.updateById);
router.delete("/:id", tokenHandler.verifyAdminToken, userController.deteleById);

module.exports = router;
