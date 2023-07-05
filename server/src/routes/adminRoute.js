const router = require("express").Router();
const { adminController } = require("../controllers");

router.get("/", adminController.helloAdmin);
router.post("/login", adminController.login);

module.exports = router;
