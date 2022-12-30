const { express } = require("../app");
const authController = require("../controllers/auth.controller");
const router = express.Router();

router.post("/signUp", authController.createUser);
router.post("/signIn", authController.login);
router.delete("/delete", authController.deleteUser);

module.exports = router;
