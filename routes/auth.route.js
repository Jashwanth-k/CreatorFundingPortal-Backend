const { express } = require("../app");
const authController = require("../controllers/auth.controller");
const authValidator = require("../validators/auth.validator");
const mainValidator = require("../validators/validator.main");
const router = express.Router();

router.post(
  "/signUp",
  [
    authValidator.validateAuthBody.bind(null, false),
    authValidator.validateEmail,
  ],
  authController.createUser
);
router.post(
  "/signIn",
  [
    authValidator.validateAuthBody.bind(null, true),
    authValidator.validateEmail,
  ],
  authController.login
);
router.delete(
  "/delete",
  [
    authValidator.validateAuthBody.bind(null, true),
    authValidator.validateJwtToken,
  ],
  authController.deleteUser
);

module.exports = router;
