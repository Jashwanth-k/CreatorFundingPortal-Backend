const { express } = require("../app");
const musicController = require("../controllers/music.controller");
const fileService = require("../services/file.service");
const authValidator = require("../validators/auth.validator");
const mainValidator = require("../validators/validator.main");
const router = express.Router();

router.get("/all", musicController.getAllMusics);
router.get("/:id", [mainValidator.validateId], musicController.getMusicById);
router.post(
  "/create",
  [
    authValidator.validateJwtToken,
    mainValidator.isCreator,
    fileService.fileUploader.bind(fileService),
    mainValidator.validateBody.bind(null, false, "music"),
  ],
  musicController.createMusic
);
router.put(
  "/update/:id",
  [
    mainValidator.validateId,
    authValidator.validateJwtToken,
    mainValidator.isCreator,
    fileService.fileUploader.bind(fileService),
    mainValidator.validateBody.bind(null, true, "music"),
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
