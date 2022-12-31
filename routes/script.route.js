const { express } = require("../app");
const scriptController = require("../controllers/script.controller");
const authValidator = require("../validators/auth.validator");
const mainValidator = require("../validators/validator.main");
const router = express.Router();

router.get("/all", scriptController.getAllScripts);
router.get("/:id", [mainValidator.validateId], scriptController.getScriptById);
router.post(
  "/create",
  [
    mainValidator.validateBody.bind(null, false, "script"),
    authValidator.validateJwtToken,
    mainValidator.isCreator,
  ],
  scriptController.createScript
);
router.put(
  "/update/:id",
  [
    mainValidator.validateBody.bind(null, true, "script"),
    mainValidator.validateId,
    authValidator.validateJwtToken,
    mainValidator.isCreator,
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
