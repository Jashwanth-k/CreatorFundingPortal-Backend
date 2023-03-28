const { express } = require("../app");
const router = express.Router();
const getFile = require("../controllers/file.contoller");
const authValidator = require("../validators/auth.validator");

router.get("/:filename", [authValidator.validateJwtForGetReq], getFile);
module.exports = router;
