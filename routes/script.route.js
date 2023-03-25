const { express } = require("../app");
const scriptController = require("../controllers/script.controller");
const authValidator = require("../validators/auth.validator");
const mainValidator = require("../validators/validator.main");
const fileService = require("../services/file.service");
const router = express.Router();

router.get(
  "/all",
  [authValidator.validateJwtForGetReq],
  scriptController.getAllScripts
);
router.get(
  "/:id",
  [mainValidator.validateId, [authValidator.validateJwtForGetReq]],
  scriptController.getScriptById
);
router.post(
  "/create",
  [
    authValidator.validateJwtToken,
    mainValidator.isCreator,
    fileService.fileUploader.bind(fileService),
    mainValidator.validateBody.bind(null, false, "script"),
  ],
  scriptController.createScript
);
router.put(
  "/update/:id",
  [
    mainValidator.validateId,
    authValidator.validateJwtToken,
    mainValidator.isCreator,
    fileService.fileUploader.bind(fileService),
    mainValidator.validateBody.bind(null, true, "script"),
  ],
  scriptController.updateScript
);
router.delete(
  "/delete/:id",
  [
    mainValidator.validateId,
    authValidator.validateJwtToken,
    mainValidator.isCreator,
  ],
  scriptController.deleteScript
);

module.exports = router;
