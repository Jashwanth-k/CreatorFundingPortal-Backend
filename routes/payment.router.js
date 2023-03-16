const { express } = require("../app");
const router = express.Router();

router.post("/send");
router.get("/getAll");
module.exports = router;
