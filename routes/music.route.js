const { express } = require("../app");
const musicController = require("../controllers/music.controller");
const router = express.Router();

router.get("/all", musicController.getAllMusics);
router.get("/:id", musicController.getMusicById);
router.post("/create", musicController.createMusic);
router.put("/update/:id", musicController.updateMusic);
router.delete("/delete/:id", musicController.deleteMusic);

module.exports = router;
