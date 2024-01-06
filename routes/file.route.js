const { express } = require("../app");
const router = express.Router();
const fileController = require("../controllers/file.contoller");
const authValidator = require("../validators/auth.validator");

router.get(
  "/:filename",
  [authValidator.validateJwtForGetReq],
  fileController.getFile
);
router.get(
  "/original/:filename",
  [authValidator.validateJwtToken],
  fileController.getOriginalFile
);     
module.exports = router;
