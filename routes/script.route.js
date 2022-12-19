const { express } = require("../app");
const scriptController = require("../controllers/script.controller");
const router = express.Router();

router.get("/all", scriptController.getAllScripts);
router.get("/:id", scriptController.getScriptById);
router.post("/create", scriptController.createScript);
router.put("/update/:id", scriptController.updateScript);
router.delete("/delete/:id", scriptController.deleteScript);

module.exports = router;
