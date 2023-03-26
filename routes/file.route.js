const { express } = require("../app");
const router = express.Router();
const getFile = require("../controllers/file.contoller");

router.get("/:filename", getFile);
module.exports = router;
