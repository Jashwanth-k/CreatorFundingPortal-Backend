const { express } = require("../app");
const authValidator = require("../validators/auth.validator");
const homeController = require("../controllers/home.controller");
const router = express.Router();

router.get("", [authValidator.validateJwtForGetReq], homeController.getHome);
router.get(
  "/uploads/me",
  [authValidator.validateJwtToken],
  homeController.getCreatorUploads
);

module.exports = router;
