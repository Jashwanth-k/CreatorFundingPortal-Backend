const { express } = require("../app");
const musicController = require("../controllers/music.controller");
const authValidator = require("../validators/auth.validator");
const mainValidator = require("../validators/validator.main");
const router = express.Router();

router.get("/all", musicController.getAllMusics);
router.get("/:id", [mainValidator.validateId], musicController.getMusicById);
router.post(
  "/create",
  [
    mainValidator.validateBody.bind(null, false, "music"),
    authValidator.validateJwtToken,
    mainValidator.isCreator,
  ],
  musicController.createMusic
);
router.put(
  "/update/:id",
  [
    mainValidator.validateBody.bind(null, true, "music"),
    mainValidator.validateId,
    authValidator.validateJwtToken,
    mainValidator.isCreator,
  ],
  musicController.updateMusic
);
router.delete(
  "/delete/:id",
  [
    mainValidator.validateId,
    authValidator.validateJwtToken,
    mainValidator.isCreator,
  ],
  musicController.deleteMusic
);

module.exports = router;
